param(
  [string] $EnvironmentUrl = "https://org23b93544.crm2.dynamics.com/",
  [string] $TenantId = "organizations",
  [string] $ClientId = "",
  [string] $MetadataPath = "",
  [switch] $DeviceCode,
  [switch] $NoPublish,
  [switch] $WhatIf,
  [switch] $RequireManifest
)

# O MSAL.PS precisa do Windows PowerShell 5.1 nesta máquina.
if ($PSVersionTable.PSEdition -eq "Core" -or $PSHOME -like "*codex-runtimes*") {
  $windowsPowerShell = Join-Path $env:WINDIR "System32\WindowsPowerShell\v1.0\powershell.exe"
  $forward = @("-NoProfile", "-ExecutionPolicy", "Bypass", "-File", $PSCommandPath, "-EnvironmentUrl", $EnvironmentUrl, "-TenantId", $TenantId)
  if ($ClientId) { $forward += @("-ClientId", $ClientId) }
  if ($MetadataPath) { $forward += @("-MetadataPath", $MetadataPath) }
  if ($DeviceCode) { $forward += "-DeviceCode" }
  if ($NoPublish) { $forward += "-NoPublish" }
  if ($WhatIf) { $forward += "-WhatIf" }
  if ($RequireManifest) { $forward += "-RequireManifest" }
  & $windowsPowerShell @forward
  exit $LASTEXITCODE
}

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $root

function Step([string] $Message) { Write-Host "[push-dev] $Message" }
function Assert-Exit([string] $Label) { if ($LASTEXITCODE -ne 0) { throw "$Label falhou com exit code $LASTEXITCODE." } }

$environmentBaseUrl = $EnvironmentUrl.TrimEnd("/").ToLowerInvariant()
if ($environmentBaseUrl -notmatch "org23b93544\.crm2\.dynamics\.com$") {
  throw "Push bloqueado: o script é DEV e só aceita https://org23b93544.crm2.dynamics.com/."
}

Step "testes da agenda IA"
npm run test:ai
Assert-Exit "npm run test:ai"
Step "build do WebResource"
npm run build
Assert-Exit "npm run build"

if ($MetadataPath) {
  $metadata = (Resolve-Path $MetadataPath -ErrorAction Stop).Path
  Step "validação do manifesto contra metadata DEV"
  node scripts/validate_ai_schedule_manifest.mjs --manifest docs/power-platform/ai_schedule_solution_manifest.json --metadata $metadata
  Assert-Exit "validação do manifesto"
}
elseif ($RequireManifest) {
  throw "Informe -MetadataPath com o JSON exportado do DEV para continuar."
}
else {
  Step "manifesto externo não validado (use -MetadataPath para habilitar o gate)"
}

Step "publicação idempotente do WebResource na solution AppBetinhos"
$publish = Join-Path $PSScriptRoot "publish-ai-schedule-webresource.ps1"
$publishParams = @{ EnvironmentUrl = $EnvironmentUrl; TenantId = $TenantId; WhatIf = $WhatIf; NoPublish = $NoPublish; DeviceCode = $DeviceCode }
if ($ClientId) { $publishParams.ClientId = $ClientId }
& $publish @publishParams
Assert-Exit "publicação do WebResource"

Step "push concluído: testes, build e WebResource DEV atualizados"
Step "flows/connector DeepSeek não foram importados: este repositório ainda não contém pacote solution-aware desses artefatos"
