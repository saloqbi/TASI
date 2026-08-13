param([int]$Port=8768,[string]$Symbol='XAUUSD')
$ErrorActionPreference='Stop'
$listener=$null;$ab=$null;$lastPrice=$null;$lastDirection='FLAT';$sequence=0;$lastError=$null;$lastRefresh=[datetime]::MinValue
$fixedSymbol=$Symbol.Trim().ToUpperInvariant()
function Ensure-Ab {
  try { if($null-eq $script:ab){$script:ab=New-Object -ComObject 'Broker.Application'}; return $true }
  catch {$script:lastError=$_.Exception.Message;return $false}
}
function Get-FreshQuote {
  if(-not(Ensure-Ab)){throw "AmiBroker OLE unavailable: $script:lastError"}
  $active=''
  try {$active=[string]$script:ab.ActiveDocument.Name} catch {}
  if($active -and $active.Trim().ToUpperInvariant() -ne $script:fixedSymbol){throw "Active AmiBroker symbol is '$active', expected '$script:fixedSymbol'"}
  if(([datetime]::UtcNow-$script:lastRefresh).TotalMilliseconds-ge 100){
    $script:ab.RefreshAll();$script:lastRefresh=[datetime]::UtcNow
  }
  $stock=$script:ab.Stocks.Item($script:fixedSymbol)
  if($null-eq $stock){throw "Symbol '$script:fixedSymbol' not found"}
  $quotes=$stock.Quotations;$count=[int]$quotes.Count
  if($count-le 0){throw "No quotations for '$script:fixedSymbol'"}
  $q=$quotes.Item($count-1)
  $price=[double]$q.Close
  if($price-le 0-or[double]::IsNaN($price)-or[double]::IsInfinity($price)){throw 'Invalid latest Close'}
  $direction=$script:lastDirection
  if($null-ne $script:lastPrice){if($price-gt[double]$script:lastPrice){$direction='UP'}elseif($price-lt[double]$script:lastPrice){$direction='DOWN'}}
  if($direction-notin @('UP','DOWN')){$direction='FLAT'}
  $script:lastPrice=$price;$script:lastDirection=$direction;$script:sequence++
  $quoteDate=$null;try{$quoteDate=([datetime]$q.Date).ToUniversalTime().ToString('o')}catch{}
  [ordered]@{
    ok=$true;symbol=$script:fixedSymbol;activeSymbol=$active
    price=[math]::Round($price,6);open=[math]::Round([double]$q.Open,6);high=[math]::Round([double]$q.High,6);low=[math]::Round([double]$q.Low,6)
    direction=$direction;sequence=$script:sequence;observedAt=[DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
    quoteDate=$quoteDate;quotationCount=$count;source='AmiBroker.OLE.RefreshAll.LatestQuotation.Close';port=$Port
  }
}
function Read-Request($stream){
  $reader=New-Object IO.StreamReader($stream,[Text.Encoding]::ASCII,$false,4096,$true)
  $line=$reader.ReadLine();if([string]::IsNullOrWhiteSpace($line)){return $null}
  $parts=$line.Split(' ');while(($h=$reader.ReadLine())-ne $null-and $h-ne ''){}
  [ordered]@{method=$parts[0].ToUpperInvariant();target=$parts[1]}
}
function Reply($stream,$code,$reason,$body){
  $bytes=[Text.Encoding]::UTF8.GetBytes($body)
  $header="HTTP/1.1 $code $reason`r`nContent-Type: application/json; charset=utf-8`r`nContent-Length: $($bytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nAccess-Control-Allow-Methods: GET, OPTIONS`r`nAccess-Control-Allow-Headers: Content-Type, Accept, Cache-Control, Pragma, Private-Network`r`nAccess-Control-Allow-Private-Network: true`r`nCache-Control: no-store, no-cache, must-revalidate, max-age=0`r`nPragma: no-cache`r`nConnection: close`r`n`r`n"
  $h=[Text.Encoding]::ASCII.GetBytes($header);$stream.Write($h,0,$h.Length)
  if($bytes.Length){$stream.Write($bytes,0,$bytes.Length)};$stream.Flush()
}
try {
  if(-not(Ensure-Ab)){throw "Cannot connect to AmiBroker: $script:lastError"}
  $listener=[Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback,$Port);$listener.Start()
  Write-Host "V501 FRESH AMIBROKER LINK READY: http://127.0.0.1:$Port/quote" -ForegroundColor Green
  Write-Host "Reads XAUUSD after RefreshAll on every cycle. Keep this window open." -ForegroundColor Cyan
  while($true){
    $client=$listener.AcceptTcpClient()
    try {
      $client.NoDelay=$true;$stream=$client.GetStream();$stream.ReadTimeout=1500;$stream.WriteTimeout=1500
      $req=Read-Request $stream;if($null-eq $req){continue}
      if($req.method-eq'OPTIONS'){Reply $stream 204 'No Content' '';continue}
      $path=([Uri]("http://127.0.0.1$($req.target)")).AbsolutePath.ToLowerInvariant()
      if($req.method-eq'GET'-and $path-eq'/health'){
        Reply $stream 200 'OK' ([ordered]@{ok=(Ensure-Ab);service='amibroker-fresh-v501';symbol=$fixedSymbol;port=$Port;lastPrice=$lastPrice;error=$lastError}|ConvertTo-Json -Compress);continue
      }
      if($req.method-eq'GET'-and $path-eq'/quote'){
        try {Reply $stream 200 'OK' (Get-FreshQuote|ConvertTo-Json -Compress)}
        catch {$lastError=$_.Exception.Message;Reply $stream 503 'Service Unavailable' ([ordered]@{ok=$false;symbol=$fixedSymbol;error=$lastError;port=$Port}|ConvertTo-Json -Compress)}
        continue
      }
      Reply $stream 404 'Not Found' '{"ok":false,"error":"Not found"}'
    } finally {try{$client.Close()}catch{}}
  }
} finally {
  if($listener){try{$listener.Stop()}catch{}}
  if($ab){try{[void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($ab)}catch{}}
}
