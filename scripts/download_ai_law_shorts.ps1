#Requires -Version 5.1
<#
.SYNOPSIS
  Poll NotebookLM video artifacts for Learn AI Law shorts, download completed MP4s,
  update shorts-catalog.json, and refresh the SPA media folder.
#>
param(
  [string]$NotebookId = "",
  [string]$OutDir = "C:\output\obsidian\learning\ai-law\notebooklm\shorts",
  [string]$SpaDir = "C:\projects\claude\learn-ai-law",
  [int]$MaxWaitMinutes = 180,
  [int]$PollSeconds = 45
)

$ErrorActionPreference = "Continue"
New-Item -ItemType Directory -Force -Path $OutDir, "$SpaDir\media\shorts" | Out-Null

$statePath = Join-Path $OutDir "notebook-state.json"
$manifestPath = Join-Path $OutDir "shorts-manifest.json"
if (-not $NotebookId -and (Test-Path $statePath)) {
  $NotebookId = [string](Get-Content $statePath -Raw -Encoding UTF8 | ConvertFrom-Json).notebook_id
}
if (-not $NotebookId) { throw "NotebookId required" }
if (-not (Test-Path $manifestPath)) { throw "Missing manifest - run create_ai_law_shorts.ps1 first." }

$parsed = Get-Content $manifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
if ($parsed -is [System.Array]) { $manifest = @($parsed) } else { $manifest = @($parsed) }

$deadline = (Get-Date).AddMinutes($MaxWaitMinutes)
Write-Host "[shorts] polling notebook=$NotebookId until $deadline"

function Get-VideoStatusMap {
  param($NotebookId)
  $raw = & nlm video list $NotebookId --json 2>&1 | Out-String
  try {
    $arr = $raw | ConvertFrom-Json
    if ($arr -isnot [System.Array]) { $arr = @($arr) }
    $map = @{}
    foreach ($a in $arr) {
      $id = $a.artifact_id
      if (-not $id) { $id = $a.id }
      if ($id) { $map[[string]$id] = $a }
    }
    return $map
  } catch {
    Write-Host "[shorts] list parse warn: $($_.Exception.Message)"
    return @{}
  }
}

function Write-Utf8NoBom {
  param([string]$Path, [string]$Text)
  $utf8 = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Text, $utf8)
}

$done = 0
$pending = 0
while ((Get-Date) -lt $deadline) {
  $statusMap = Get-VideoStatusMap -NotebookId $NotebookId
  $pending = 0
  $done = 0
  foreach ($row in $manifest) {
    if (-not $row.artifact_id) { $pending++; continue }
    $st = "unknown"
    $key = [string]$row.artifact_id
    if ($statusMap.ContainsKey($key)) {
      $st = [string]$statusMap[$key].status
    }
    $row.status = $st
    $target = Join-Path $OutDir ($row.name + ".mp4")
    $spaTarget = Join-Path $SpaDir "media\shorts\$($row.name).mp4"
    if ($st -match "ready|complete|completed|success|done") {
      $done++
      if (-not (Test-Path $target)) {
        Write-Host "[shorts] downloading $($row.name) ($($row.artifact_id))"
        & nlm download video $NotebookId --id $row.artifact_id --output $target --no-progress 2>&1 | Out-Null
        if (Test-Path $target) { Copy-Item $target $spaTarget -Force }
      } else {
        if (-not (Test-Path $spaTarget)) { Copy-Item $target $spaTarget -Force }
      }
      if (Test-Path $spaTarget) { $row.status = "ready" }
    } else {
      $pending++
      Write-Host "[shorts] waiting $($row.name) status=$st"
    }
  }
  Write-Utf8NoBom -Path $manifestPath -Text (ConvertTo-Json -InputObject @($manifest) -Depth 6)

  $items = @()
  foreach ($row in $manifest) {
    $rel = "media/shorts/$($row.name).mp4"
    $exists = Test-Path (Join-Path $SpaDir $rel)
    $items += [pscustomobject]@{
      id = $row.name
      name = $row.name
      title = $row.title
      file = $rel
      artifact_id = $row.artifact_id
      status = $(if ($exists) { "ready" } elseif ($row.status) { $row.status } else { "pending" })
    }
  }
  $ready = @($items | Where-Object { $_.status -eq "ready" }).Count
  $catalog = [pscustomobject]@{
    notebook_id = $NotebookId
    title = "Learn AI Law - 20 shorts"
    total = $items.Count
    ready = $ready
    updated = (Get-Date).ToString("o")
    items = $items
  }
  $catalogJson = ConvertTo-Json -InputObject $catalog -Depth 6
  Write-Utf8NoBom -Path (Join-Path $SpaDir "shorts-catalog.json") -Text $catalogJson
  Write-Utf8NoBom -Path (Join-Path $OutDir "shorts-catalog.json") -Text $catalogJson

  Write-Host "[shorts] ready=$ready done=$done pending=$pending"
  if ($pending -eq 0 -and $done -ge 1) {
    Write-Host "[shorts] all known artifacts ready. Exit poll."
    break
  }
  Start-Sleep -Seconds $PollSeconds
}

Write-Host "[shorts] final ready check:"
Get-ChildItem "$SpaDir\media\shorts" -Filter *.mp4 -ErrorAction SilentlyContinue | Select-Object Name, Length
