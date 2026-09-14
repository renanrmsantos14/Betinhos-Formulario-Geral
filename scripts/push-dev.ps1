param(
  [string] $EnvironmentUrl = "https://org23b93544.crm2.dynamics.com/",
  [string] $TenantId = "organizations",
  [string] $ClientId = "",
  [string] $MetadataPath = "",
  [switch] $DeviceCode,
  [switch] $NoPublish,
  [switch] $WhatIf,
  [switch] $RequireManifest,
  [switch] $ProvisionPlatform,
  [switch] $ProvisionFlows,
  [string] $DataverseConnectionReferenceLogicalName = "",
  [string] $DeepSeekConnectionReferenceLogicalName = "",
  [string] $DeepSeekApiName = "shared_betinhosdeepseek",
  [string] $DeepSeekOperationId = "Responses"
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
  if ($ProvisionFlows) { $forward += "-ProvisionFlows" }
  if ($ProvisionPlatform) { $forward += "-ProvisionPlatform" }
  if ($DataverseConnectionReferenceLogicalName) { $forward += @("-DataverseConnectionReferenceLogicalName", $DataverseConnectionReferenceLogicalName) }
  if ($DeepSeekConnectionReferenceLogicalName) { $forward += @("-DeepSeekConnectionReferenceLogicalName", $DeepSeekConnectionReferenceLogicalName) }
  if ($DeepSeekApiName) { $forward += @("-DeepSeekApiName", $DeepSeekApiName) }
  if ($DeepSeekOperationId) { $forward += @("-DeepSeekOperationId", $DeepSeekOperationId) }
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

if ($ProvisionPlatform) {
  if ([string]::IsNullOrWhiteSpace($DataverseConnectionReferenceLogicalName)) { $DataverseConnectionReferenceLogicalName = $env:AI_SCHEDULE_DATAVERSE_CONNECTION_REFERENCE }
  if ([string]::IsNullOrWhiteSpace($DeepSeekConnectionReferenceLogicalName)) { $DeepSeekConnectionReferenceLogicalName = $env:AI_SCHEDULE_DEEPSEEK_CONNECTION_REFERENCE }
  if ([string]::IsNullOrWhiteSpace($DataverseConnectionReferenceLogicalName) -or [string]::IsNullOrWhiteSpace($DeepSeekConnectionReferenceLogicalName)) {
    throw "Para o push completo, defina AI_SCHEDULE_DATAVERSE_CONNECTION_REFERENCE e AI_SCHEDULE_DEEPSEEK_CONNECTION_REFERENCE."
  }
  Step "provisionamento idempotente do schema Dataverse da agenda IA"
  $schemaScript = Join-Path $PSScriptRoot "provision-ai-schedule-schema.ps1"
  $schemaParams = @{ EnvironmentUrl = $EnvironmentUrl; TenantId = $TenantId; ClientId = $ClientId; DeviceCode = $DeviceCode; WhatIf = $WhatIf }
  & $schemaScript @schemaParams
  Assert-Exit "provisionamento do schema"

  Step "criação/atualização do Custom Connector DeepSeek"
  $connectorScript = Join-Path $PSScriptRoot "provision-deepseek-connector.ps1"
  & $connectorScript -EnvironmentUrl $EnvironmentUrl -SolutionUniqueName "AppBetinhos" -WhatIf:$WhatIf
  Assert-Exit "provisionamento do connector"
  $ProvisionFlows = $true
}

Step "publicação idempotente do WebResource na solution AppBetinhos"
$publish = Join-Path $PSScriptRoot "publish-ai-schedule-webresource.ps1"
$publishParams = @{ EnvironmentUrl = $EnvironmentUrl; TenantId = $TenantId; WhatIf = $WhatIf; NoPublish = $NoPublish; DeviceCode = $DeviceCode }
if ($ClientId) { $publishParams.ClientId = $ClientId }
& $publish @publishParams
Assert-Exit "publicação do WebResource"

if ($ProvisionFlows) {
  Step "provisionamento dos dois flows da agenda IA"
  $flowScript = Join-Path $PSScriptRoot "provision-ai-schedule-flows.ps1"
  $flowParams = @{ EnvironmentUrl = $EnvironmentUrl; TenantId = $TenantId; ClientId = $ClientId; DataverseConnectionReferenceLogicalName = $DataverseConnectionReferenceLogicalName; DeepSeekConnectionReferenceLogicalName = $DeepSeekConnectionReferenceLogicalName; DeepSeekApiName = $DeepSeekApiName; DeepSeekOperationId = $DeepSeekOperationId; DeviceCode = $DeviceCode; WhatIf = $WhatIf }
  & $flowScript @flowParams
  Assert-Exit "provisionamento dos flows"
}

Step "push concluído: testes, build e WebResource DEV atualizados"
if ($ProvisionFlows) { Step "flows da agenda IA provisionados e ativados" }
else { Step "flows/connector DeepSeek não foram provisionados (use -ProvisionFlows após adicionar as definições JSON e Connection References)" }
