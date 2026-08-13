param(
  [int]$Port = 8768,
  [string]$Symbol = 'XAUUSD'
)

$ErrorActionPreference = 'Stop'
$listener = $null
$ab = $null
$fixedSymbol = $Symbol.Trim().ToUpperInvariant()
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
    return $false
  }
}

function Get-GoldQuote {
  if (-not (Ensure-AmiBroker)) { throw "AmiBroker OLE unavailable: $($script:lastError)" }
  $stock = $script:ab.Stocks.Item($script:fixedSymbol)
  if ($null -eq $stock) { throw "Symbol '$($script:fixedSymbol)' was not found in AmiBroker." }
  $quotes = $stock.Quotations
  $count = [int]$quotes.Count
  if ($count -le 0) { throw "No quotations are available for '$($script:fixedSymbol)'." }
  $quote = $quotes.Item($count - 1)
  $price = [double]$quote.Close
  if ([double]::IsNaN($price) -or [double]::IsInfinity($price) -or $price -le 0) { throw "Invalid Close for '$($script:fixedSymbol)'." }

  $direction = $script:lastDirection
  if ($null -ne $script:lastPrice) {
    if ($price -gt [double]$script:lastPrice) { $direction = 'UP' }
    elseif ($price -lt [double]$script:lastPrice) { $direction = 'DOWN' }
  }
  if ($direction -notin @('UP','DOWN')) { $direction = 'FLAT' }
  $script:lastPrice = $price
  $script:lastDirection = $direction

  [ordered]@{
    ok = $true
    symbol = $script:fixedSymbol
    price = [Math]::Round($price, 6)
    direction = $direction
    observedAt = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
    source = 'AmiBroker.OLE.XAUUSD.LastClose'
    port = $Port
  }
}

function Read-Request([System.Net.Sockets.NetworkStream]$stream) {
  $reader = New-Object System.IO.StreamReader($stream,[System.Text.Encoding]::ASCII,$false,4096,$true)
  $requestLine = $reader.ReadLine()
  if ([string]::IsNullOrWhiteSpace($requestLine)) { return $null }
  $parts = $requestLine.Split(' ')
  if ($parts.Count -lt 2) { return $null }
  while ($true) { $line = $reader.ReadLine(); if ($null -eq $line -or $line -eq '') { break } }
  [ordered]@{ method=$parts[0].Trim().ToUpperInvariant(); target=$parts[1].Trim() }
}

function Write-Response([System.Net.Sockets.NetworkStream]$stream,[int]$status,[string]$reason,[string]$body,[string]$type='application/json; charset=utf-8') {
  if ($null -eq $body) { $body = '' }
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($body)
  $header = @(
    "HTTP/1.1 $status $reason",
    "Content-Type: $type",
    "Content-Length: $($bytes.Length)",
    'Access-Control-Allow-Origin: *',
    'Access-Control-Allow-Methods: GET, OPTIONS',
    'Access-Control-Allow-Headers: Content-Type, Accept, Cache-Control, Pragma, Private-Network',
    'Access-Control-Allow-Private-Network: true',
    'Cache-Control: no-store, no-cache, must-revalidate, max-age=0',
    'Pragma: no-cache',
    'Connection: close',
    '', ''
  ) -join "`r`n"
  $h = [System.Text.Encoding]::ASCII.GetBytes($header)
  $stream.Write($h,0,$h.Length)
  if ($bytes.Length) { $stream.Write($bytes,0,$bytes.Length) }
  $stream.Flush()
}

try {
  if (-not (Ensure-AmiBroker)) { throw "Unable to connect to AmiBroker: $script:lastError" }
  Write-Host "AmiBroker connected. Fixed symbol: $fixedSymbol" -ForegroundColor Cyan
  try {
    $test = Get-GoldQuote
    Write-Host ("Initial XAUUSD price: {0:N2}" -f $test.price) -ForegroundColor Green
  } catch {
    Write-Warning $_.Exception.Message
  }

  $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback,$Port)
  $listener.Start()
  Write-Host "GOLD bridge LIVE on http://127.0.0.1:$Port/quote" -ForegroundColor Green
  Write-Host "Keep this PowerShell window open. Press Ctrl+C to stop.`n"

  while ($true) {
    $client = $listener.AcceptTcpClient()
    try {
      $client.NoDelay = $true
      $stream = $client.GetStream()
      $stream.ReadTimeout = 3000
      $stream.WriteTimeout = 3000
      $request = Read-Request $stream
      if ($null -eq $request) { continue }
      if ($request.method -eq 'OPTIONS') { Write-Response $stream 204 'No Content' '' 'text/plain; charset=utf-8'; continue }
      $uri = [Uri]("http://127.0.0.1$($request.target)")
      $path = $uri.AbsolutePath.ToLowerInvariant()
      if ($request.method -eq 'GET' -and $path -eq '/health') {
        $payload = [ordered]@{ok=(Ensure-AmiBroker);service='amibroker-gold-v494';symbol=$fixedSymbol;lastPrice=$script:lastPrice;lastDirection=$script:lastDirection;error=$script:lastError;port=$Port} | ConvertTo-Json -Compress
        Write-Response $stream 200 'OK' $payload
        continue
      }
      if ($request.method -eq 'GET' -and ($path -eq '/quote' -or $path -eq '/live_quote.json')) {
        try {
          $payload = Get-GoldQuote | ConvertTo-Json -Compress
          Write-Response $stream 200 'OK' $payload
        } catch {
          $script:lastError = $_.Exception.Message
          $payload = [ordered]@{ok=$false;symbol=$fixedSymbol;error=$script:lastError;port=$Port} | ConvertTo-Json -Compress
          Write-Response $stream 503 'Service Unavailable' $payload
        }
        continue
      }
      Write-Response $stream 404 'Not Found' '{"ok":false,"error":"Not found"}'
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
