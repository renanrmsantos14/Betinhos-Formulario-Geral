param(
  [string] $EnvironmentUrl = "https://org23b93544.crm2.dynamics.com/",
  [string] $SolutionUniqueName = "AppBetinhos",
  [string] $ConnectorId = "",
  [switch] $WhatIf
)

try { [Console]::OutputEncoding = [Text.UTF8Encoding]::new($false) } catch { }

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
function Step([string]$Message) { Write-Host "[provision-deepseek] $Message" }
$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$connectorRoot = Join-Path $root "power-platform\connector"
Set-Location $connectorRoot
$settings = Join-Path $connectorRoot "settings.json"
$definition = Join-Path $connectorRoot "deepseek-api-definition.json"
$properties = Join-Path $connectorRoot "apiProperties.json"
foreach ($path in @($settings, $definition, $properties)) { if (-not (Test-Path -LiteralPath $path -PathType Leaf)) { throw "Arquivo ausente: $path" } }
if ($EnvironmentUrl.TrimEnd("/") -notmatch "org23b93544\.crm2\.dynamics\.com$") { throw "Connector bloqueado: somente ambiente DEV org23b93544." }
if ($WhatIf) { Step "dry-run: criaria ou atualizaria o connector Betinhos DeepSeek na solution $SolutionUniqueName"; exit 0 }

$args = @("connector", "create", "--environment", $EnvironmentUrl, "--settings-file", $settings, "--solution-unique-name", $SolutionUniqueName)
if ($ConnectorId) { $args = @("connector", "update", "--environment", $EnvironmentUrl, "--connector-id", $ConnectorId, "--settings-file", $settings, "--solution-unique-name", $SolutionUniqueName) }
Step "publicando definição OpenAPI do connector Betinhos DeepSeek"
& pac @args
if ($LASTEXITCODE -ne 0) { throw "pac connector falhou com exit code $LASTEXITCODE. Se já existir, informe -ConnectorId para atualização." }
Step "connector Betinhos DeepSeek pronto"
