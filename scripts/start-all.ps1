$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "Starting admin backend on http://127.0.0.1:8011/admin"
$backend = Start-Process -FilePath "npm.cmd" -ArgumentList "run", "backend" -WorkingDirectory $root -PassThru -WindowStyle Hidden

try {
  Write-Host "Starting website on http://127.0.0.1:5173"
  npm.cmd run dev
}
finally {
  if ($backend -and -not $backend.HasExited) {
    Stop-Process -Id $backend.Id -ErrorAction SilentlyContinue
  }
}
