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

$args = @("connector", "create", "--settings-file", $settings, "--solution-unique-name", $SolutionUniqueName)
if ($ConnectorId) { $args = @("connector", "update", "--connector-id", $ConnectorId, "--settings-file", $settings, "--solution-unique-name", $SolutionUniqueName) }
Step "publicando definição OpenAPI do connector Betinhos DeepSeek"
$pacOutput = @(& pac @args 2>&1)
$pacExitCode = $LASTEXITCODE
$pacOutput | ForEach-Object { Write-Host $_ }
$pacText = ($pacOutput -join "`n")
if ($pacExitCode -ne 0 -or $pacText -match '(?m)^Error:') { throw "pac connector falhou (exit code $pacExitCode). Se já existir, informe -ConnectorId para atualização." }
Step "connector Betinhos DeepSeek pronto"
