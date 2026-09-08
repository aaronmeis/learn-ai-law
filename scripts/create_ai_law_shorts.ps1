#Requires -Version 5.1
<#
.SYNOPSIS
  Create (or resume) a Learn AI Law NotebookLM notebook, ingest the shorts source pack,
  and launch 20 vertical --format short videos with unique focus prompts.
#>
param(
  [string]$NotebookId = "",
  [string]$TopicsPath = "C:\projects\claude\learn-ai-law\assets-src\notebooklm\shorts-topics.json",
  [string]$SourcePack = "C:\projects\claude\learn-ai-law\assets-src\notebooklm\shorts-source-pack.md",
  [string]$OutDir = "C:\output\obsidian\learning\ai-law\notebooklm\shorts",
  [string]$SpaDir = "C:\projects\claude\learn-ai-law",
  [switch]$SkipCreate,
  [switch]$SkipIngest,
  [switch]$ForceRecreate,
  [int]$ThrottleSeconds = 45,
  [int]$RateLimitRetries = 4,
  [int]$RateLimitWaitSeconds = 90
)

$ErrorActionPreference = "Continue"
New-Item -ItemType Directory -Force -Path $OutDir, "$SpaDir\media\shorts" | Out-Null

if (-not (Test-Path $TopicsPath)) { throw "Missing topics: $TopicsPath" }
if (-not (Test-Path $SourcePack)) { throw "Missing source pack: $SourcePack" }

$topicsDoc = Get-Content $TopicsPath -Raw -Encoding UTF8 | ConvertFrom-Json
$items = @($topicsDoc.items)
$manifestPath = Join-Path $OutDir "shorts-manifest.json"
$statePath = Join-Path $OutDir "notebook-state.json"

function Invoke-Nlm {
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$NlmArgs)
  $raw = & nlm @NlmArgs 2>&1 | Out-String
  return @{ ExitCode = $LASTEXITCODE; Raw = $raw }
}

function Get-NotebookIdFromJson {
  param([string]$Raw)
  try {
    $obj = $Raw | ConvertFrom-Json
    foreach ($k in @("id", "notebook_id", "notebookId")) {
      if ($obj.PSObject.Properties.Name -contains $k -and $obj.$k) { return [string]$obj.$k }
    }
  } catch {}
  if ($Raw -match "([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})") {
    return $Matches[1]
  }
  return $null
}

function Get-ArtifactIdFromJson {
  param([string]$Raw)
  try {
    $obj = $Raw | ConvertFrom-Json
    foreach ($k in @("artifact_id", "id", "video_id")) {
      if ($obj.PSObject.Properties.Name -contains $k -and $obj.$k) { return [string]$obj.$k }
    }
  } catch {}
  if ($Raw -match "([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})") {
    return $Matches[1]
  }
  return $null
}

# Load prior state if present
if (-not $NotebookId -and (Test-Path $statePath)) {
  try {
    $st = Get-Content $statePath -Raw | ConvertFrom-Json
    if ($st.notebook_id) { $NotebookId = [string]$st.notebook_id }
  } catch {}
}

if (-not $SkipCreate -and -not $NotebookId) {
  Write-Host "[shorts] creating notebook..."
  $title = "NEXUS | learn-ai-law-shorts | 2026-09-08 | curriculum-shorts"
  $res = Invoke-Nlm notebook create $title --json
  if ($res.ExitCode -ne 0) { throw "notebook create failed: $($res.Raw)" }
  $NotebookId = Get-NotebookIdFromJson -Raw $res.Raw
  if (-not $NotebookId) { throw "Could not parse notebook id from: $($res.Raw)" }
  Write-Host "[shorts] notebook_id=$NotebookId"
  & nlm alias set learn-ai-law-shorts $NotebookId 2>&1 | Out-Null
  & nlm tag add $NotebookId --tags "nexus,learn-ai-law,shorts,snapdragon-grok" --title $title 2>&1 | Out-Null
}

if (-not $NotebookId) { throw "NotebookId required (pass -NotebookId or create first)." }

@{
  notebook_id = $NotebookId
  title = $topicsDoc.title
  updated = (Get-Date).ToString("o")
} | ConvertTo-Json | Set-Content $statePath -Encoding utf8

if (-not $SkipIngest) {
  Write-Host "[shorts] ingesting source pack..."
  $res = Invoke-Nlm source add $NotebookId --file $SourcePack --wait --json
  if ($res.ExitCode -ne 0) {
    Write-Host "[shorts] source add warn/exit=$($res.ExitCode): $($res.Raw)"
  } else {
    Write-Host "[shorts] source ingested"
  }

  # Also add week-5 regulatory reading + glossary excerpts if present (optional enrichers)
  $extra = @(
    "C:\obsidian\personal_research_2026\Learning\AI-Law\reference\readings-regulatory.md",
    "C:\obsidian\personal_research_2026\Learning\AI-Law\reference\glossary.md"
  )
  foreach ($f in $extra) {
    if (Test-Path $f) {
      Write-Host "[shorts] ingesting extra: $f"
      $r2 = Invoke-Nlm source add $NotebookId --file $f --wait --json
      if ($r2.ExitCode -ne 0) { Write-Host "[shorts] extra ingest warn: $($r2.Raw)" }
      Start-Sleep -Seconds 2
    }
  }
}

# Load or init manifest (force array even when JSON has one object)
$manifest = @()
if (Test-Path $manifestPath) {
  try {
    $parsed = Get-Content $manifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
    if ($null -eq $parsed) { $manifest = @() }
    elseif ($parsed -is [System.Array]) { $manifest = @($parsed) }
    else { $manifest = @($parsed) }
  } catch { $manifest = @() }
}

function Find-ManifestRow {
  param($Name)
  foreach ($row in $manifest) {
    if ($row.name -eq $Name) { return $row }
  }
  return $null
}

$newManifest = @()
foreach ($it in $items) {
  $existing = Find-ManifestRow -Name $it.name
  if (-not $ForceRecreate -and $existing -and $existing.artifact_id) {
    Write-Host "[shorts] skip create (already have artifact): $($it.name)"
    $newManifest += [pscustomobject]@{
      name = $it.name
      title = $it.title
      focus = $it.focus
      artifact_id = $existing.artifact_id
      status = $(if ($existing.status) { $existing.status } else { "unknown" })
    }
    continue
  }

  Write-Host "[shorts] creating video $($it.name) ..."
  $focus = [string]$it.focus
  # Note: --format short does not accept --style; visual direction must live inside --focus.
  $aid = $null
  $res = $null
  for ($attempt = 1; $attempt -le ($RateLimitRetries + 1); $attempt++) {
    $res = Invoke-Nlm video create $NotebookId --format short --focus $focus --confirm --json
    $aid = Get-ArtifactIdFromJson -Raw $res.Raw
    if ($aid) { break }
    $isRate = ($res.Raw -match "Rate limited|RESOURCE_EXHAUSTED|code 8")
    if ($isRate -and $attempt -le $RateLimitRetries) {
      Write-Host "[shorts] rate limited on $($it.name); sleeping ${RateLimitWaitSeconds}s (attempt $attempt/$RateLimitRetries)"
      Start-Sleep -Seconds $RateLimitWaitSeconds
      continue
    }
    break
  }
  $status = if ($aid) { "generating" } else { "error" }
  if (-not $aid) {
    Write-Host "[shorts] CREATE FAIL $($it.name): $($res.Raw)"
  } else {
    Write-Host "[shorts] started $($it.name) artifact=$aid"
  }
  $newManifest += [pscustomobject]@{
    name = $it.name
    title = $it.title
    focus = $it.focus
    artifact_id = $aid
    status = $status
    raw = $res.Raw
  }
  (ConvertTo-Json -InputObject @($newManifest) -Depth 6) | Set-Content $manifestPath -Encoding utf8
  Start-Sleep -Seconds $ThrottleSeconds
}

(ConvertTo-Json -InputObject @($newManifest) -Depth 6) | Set-Content $manifestPath -Encoding utf8

# Seed SPA catalog (pending until downloads)
$catalogItems = @()
foreach ($row in $newManifest) {
  $rel = "media/shorts/$($row.name).mp4"
  $exists = Test-Path (Join-Path $SpaDir $rel)
  $catalogItems += [pscustomobject]@{
    id = $row.name
    name = $row.name
    title = $row.title
    file = $rel
    artifact_id = $row.artifact_id
    status = $(if ($exists) { "ready" } else { $row.status })
  }
}
$ready = @($catalogItems | Where-Object { $_.status -eq "ready" }).Count
$catalog = [pscustomobject]@{
  notebook_id = $NotebookId
  title = $topicsDoc.title
  total = $catalogItems.Count
  ready = $ready
  updated = (Get-Date).ToString("o")
  items = $catalogItems
}
$catalog | ConvertTo-Json -Depth 6 | Set-Content (Join-Path $SpaDir "shorts-catalog.json") -Encoding utf8
$catalog | ConvertTo-Json -Depth 6 | Set-Content (Join-Path $OutDir "shorts-catalog.json") -Encoding utf8

Write-Host "[shorts] done launching. notebook=$NotebookId manifest=$manifestPath"
Write-Host "[shorts] next: .\scripts\download_ai_law_shorts.ps1 -NotebookId $NotebookId"
