param(
  [int]$Port = 8768,
  [string]$DefaultSymbol = 'XAUUSD'
)

$ErrorActionPreference = 'Stop'
$listener = $null
$ab = $null
$requestedSymbol = $DefaultSymbol.Trim().ToUpperInvariant()
$lastPrice = $null
$lastDirection = 'FLAT'
$lastError = $null

function Ensure-AmiBroker {
  try {
    if ($null -eq $script:ab) {
      $script:ab = New-Object -ComObject 'Broker.Application'
    } else {
      $null = $script:ab.Version
    }
    return $true
  } catch {
    $script:lastError = $_.Exception.Message
    try { $script:ab = New-Object -ComObject 'Broker.Application' } catch { return $false }
    return $true
  }
}

function Get-ActiveSymbol {
  if (-not (Ensure-AmiBroker)) { return $script:requestedSymbol }
  try {
    $doc = $script:ab.ActiveDocument
    if ($null -ne $doc -and -not [string]::IsNullOrWhiteSpace([string]$doc.Name)) {
      return ([string]$doc.Name).Trim().ToUpperInvariant()
    }
  } catch {}
  return $script:requestedSymbol
}

function Get-AmiBrokerQuote {
  if (-not (Ensure-AmiBroker)) { throw "AmiBroker OLE is unavailable: $($script:lastError)" }

  $symbol = Get-ActiveSymbol
  if ([string]::IsNullOrWhiteSpace($symbol)) { $symbol = $script:requestedSymbol }

  $stock = $script:ab.Stocks.Item($symbol)
  if ($null -eq $stock) { throw "Symbol '$symbol' was not found in AmiBroker." }

  $quotes = $stock.Quotations
  $count = [int]$quotes.Count
  if ($count -le 0) { throw "No quotations are available for '$symbol'." }

  $quote = $quotes.Item($count - 1)
  $price = [double]$quote.Close
  if (-not [double]::IsFinite($price) -or $price -le 0) { throw "Invalid last Close for '$symbol'." }

  $direction = $script:lastDirection
  if ($null -ne $script:lastPrice) {
    if ($price -gt [double]$script:lastPrice) { $direction = 'UP' }
    elseif ($price -lt [double]$script:lastPrice) { $direction = 'DOWN' }
    elseif ($direction -notin @('UP','DOWN')) { $direction = 'FLAT' }
  }

  $script:lastPrice = $price
  $script:lastDirection = $direction
  $script:requestedSymbol = $symbol

  return [ordered]@{
    ok = $true
    symbol = $symbol
    price = $price
    direction = $direction
    observedAt = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
    quoteDate = ([DateTime]$quote.Date).ToString('o')
    source = 'AmiBroker.OLE.Stock.Quotations.Last.Close'
    port = $Port
  }
}

function Read-HttpRequest([System.Net.Sockets.NetworkStream]$stream) {
  $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::ASCII, $false, 4096, $true)
  $requestLine = $reader.ReadLine()
  if ([string]::IsNullOrWhiteSpace($requestLine)) { return $null }

  $parts = $requestLine.Split(' ')
  if ($parts.Count -lt 2) { return $null }
  $method = $parts[0].Trim().ToUpperInvariant()
  $target = $parts[1].Trim()

  $headers = @{}
  while ($true) {
    $line = $reader.ReadLine()
    if ($null -eq $line -or $line -eq '') { break }
    $idx = $line.IndexOf(':')
    if ($idx -gt 0) {
      $name = $line.Substring(0,$idx).Trim().ToLowerInvariant()
      $value = $line.Substring($idx+1).Trim()
      $headers[$name] = $value
    }
  }

  $body = ''
  $length = 0
  if ($headers.ContainsKey('content-length')) { [void][int]::TryParse($headers['content-length'], [ref]$length) }
  if ($length -gt 0) {
    $buffer = New-Object char[] $length
    $read = $reader.ReadBlock($buffer, 0, $length)
    if ($read -gt 0) { $body = -join $buffer[0..($read-1)] }
  }

  return [ordered]@{ method=$method; target=$target; headers=$headers; body=$body }
}

function Write-HttpResponse(
  [System.Net.Sockets.NetworkStream]$stream,
  [int]$status,
  [string]$reason,
  [string]$body,
  [string]$contentType='application/json; charset=utf-8'
) {
  if ($null -eq $body) { $body = '' }
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($body)
  $header = @(
    "HTTP/1.1 $status $reason",
    "Content-Type: $contentType",
    "Content-Length: $($bytes.Length)",
    'Access-Control-Allow-Origin: *',
    'Access-Control-Allow-Methods: GET, POST, OPTIONS',
    'Access-Control-Allow-Headers: Content-Type, Accept, Cache-Control, Pragma, Private-Network',
    'Access-Control-Allow-Private-Network: true',
    'Cache-Control: no-store, no-cache, must-revalidate, max-age=0',
    'Pragma: no-cache',
    'Expires: 0',
    'Connection: close',
    '',
    ''
  ) -join "`r`n"
  $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
  $stream.Write($headerBytes,0,$headerBytes.Length)
  if ($bytes.Length -gt 0) { $stream.Write($bytes,0,$bytes.Length) }
  $stream.Flush()
}

try {
  $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
  $listener.Start()
  Write-Host "`nAmiBroker V493 bridge is running" -ForegroundColor Green
  Write-Host "Port      : $Port"
  Write-Host "Quote URL : http://127.0.0.1:$Port/quote"
  Write-Host "Health URL: http://127.0.0.1:$Port/health"
  Write-Host "Press Ctrl+C to stop.`n"

  while ($true) {
    $client = $listener.AcceptTcpClient()
    try {
      $client.NoDelay = $true
      $stream = $client.GetStream()
      $stream.ReadTimeout = 2000
      $stream.WriteTimeout = 2000
      $request = Read-HttpRequest $stream
      if ($null -eq $request) { continue }

      if ($request.method -eq 'OPTIONS') {
        Write-HttpResponse $stream 204 'No Content' '' 'text/plain; charset=utf-8'
        continue
      }

      $uri = [Uri]("http://127.0.0.1$($request.target)")
      $path = $uri.AbsolutePath.ToLowerInvariant()

      if ($request.method -eq 'POST' -and $path -eq '/symbol') {
        $candidate = ([string]$request.body).Trim().ToUpperInvariant()
        if (-not [string]::IsNullOrWhiteSpace($candidate)) { $script:requestedSymbol = $candidate }
        $payload = [ordered]@{ ok=$true; symbol=$script:requestedSymbol; port=$Port } | ConvertTo-Json -Compress
        Write-HttpResponse $stream 200 'OK' $payload
        continue
      }

      if ($request.method -eq 'GET' -and $path -eq '/health') {
        $ole = Ensure-AmiBroker
        $payload = [ordered]@{
          ok = $ole
          service = 'amibroker-live-bridge-v493'
          port = $Port
          symbol = (Get-ActiveSymbol)
          lastPrice = $script:lastPrice
          lastDirection = $script:lastDirection
          error = $script:lastError
        } | ConvertTo-Json -Compress
        Write-HttpResponse $stream 200 'OK' $payload
        continue
      }

      if ($request.method -eq 'GET' -and ($path -eq '/quote' -or $path -eq '/live_quote.json')) {
        try {
          $payload = Get-AmiBrokerQuote | ConvertTo-Json -Compress
          Write-HttpResponse $stream 200 'OK' $payload
        } catch {
          $script:lastError = $_.Exception.Message
          $payload = [ordered]@{ ok=$false; symbol=$script:requestedSymbol; error=$script:lastError; port=$Port } | ConvertTo-Json -Compress
          Write-HttpResponse $stream 503 'Service Unavailable' $payload
        }
        continue
      }

      $payload = [ordered]@{ ok=$false; error='Not found'; path=$path } | ConvertTo-Json -Compress
      Write-HttpResponse $stream 404 'Not Found' $payload
    } catch {
      Write-Warning $_.Exception.Message
    } finally {
      try { $client.Close() } catch {}
    }
  }
} finally {
  if ($null -ne $listener) { try { $listener.Stop() } catch {} }
  if ($null -ne $ab) { try { [void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($ab) } catch {} }
}
