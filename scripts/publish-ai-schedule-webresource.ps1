param(
  [string] $EnvironmentUrl = "https://org23b93544.crm2.dynamics.com/",
  [string] $TenantId = "organizations",
  [string] $ClientId = "",
  [string] $SolutionUniqueName = "AppBetinhos",
  [string] $WebResourceName = "new_formulario_geral.html",
  [string] $EntityLogicalName = "cr40f_solicitacaoiaagendamento",
  [string] $FilePath = "webresource.html",
  [switch] $DeviceCode,
  [switch] $NoPublish,
  [switch] $WhatIf
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

function Write-Step([string] $Message) { Write-Host "[publish-ai-webresource] $Message" }
function Escape-OData([string] $Value) { return $Value.Replace("'", "''") }
function Response-Status($ErrorRecord) {
  try { return [int] $ErrorRecord.Exception.Response.StatusCode } catch { return 0 }
}
function Invoke-WithRetry([scriptblock] $Action, [string] $Label) {
  for ($attempt = 1; $attempt -le 7; $attempt++) {
    try { return & $Action }
    catch {
      $message = $_.Exception.Message
      if ($attempt -eq 7 -or $message -notmatch "0x80071151|another \[Import\] running|currently being imported|another customization operation") { throw }
      Write-Step "$Label aguardando importação concorrente; nova tentativa em 10s ($attempt/6)"
      Start-Sleep -Seconds 10
    }
  }
}

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $root
$environmentBaseUrl = $EnvironmentUrl.TrimEnd("/")
$apiBaseUrl = "$environmentBaseUrl/api/data/v9.2"
$resolvedFile = (Resolve-Path $FilePath).Path
if (-not (Test-Path -LiteralPath $resolvedFile -PathType Leaf)) { throw "WebResource não encontrado: $resolvedFile. Execute npm run build." }

if ($WhatIf) {
  $bytes = (Get-Item -LiteralPath $resolvedFile).Length
  Write-Step "dry-run: validaria solution $SolutionUniqueName e entidade $EntityLogicalName"
  Write-Step "dry-run: criaria ou atualizaria $WebResourceName ($bytes bytes) e publicaria o WebResource"
  exit 0
}

if ([string]::IsNullOrWhiteSpace($ClientId)) {
  $ClientId = if ($env:DV_CLIENT_ID) { $env:DV_CLIENT_ID } else { "51f81489-12ee-4a9e-aaae-a2591f45987d" }
}
$clientGuid = [Guid]::Empty
if (-not [Guid]::TryParse($ClientId, [ref] $clientGuid)) { throw "ClientId inválido: '$ClientId'." }

if (-not (Get-Module -ListAvailable MSAL.PS)) {
  throw "Módulo MSAL.PS não encontrado. Instale com: Install-Module MSAL.PS -Scope CurrentUser"
}
Import-Module MSAL.PS -ErrorAction Stop
$scope = "$environmentBaseUrl/user_impersonation"
$client = New-MsalClientApplication -ClientId $clientGuid.ToString() -TenantId $TenantId -RedirectUri ([Uri] "http://localhost")
Enable-MsalTokenCacheOnDisk -PublicClientApplication $client
try { $tokenResult = Get-MsalToken -PublicClientApplication $client -Scopes $scope -Silent }
catch {
  if ($DeviceCode) { $tokenResult = Get-MsalToken -PublicClientApplication $client -Scopes $scope -DeviceCode }
  else { $tokenResult = Get-MsalToken -PublicClientApplication $client -Scopes $scope -Interactive }
}
if ([string]::IsNullOrWhiteSpace($tokenResult.AccessToken)) { throw "Falha ao obter token MSAL para $scope" }

$headers = @{
  Authorization = "Bearer $($tokenResult.AccessToken)"
  Accept = "application/json"
  "OData-MaxVersion" = "4.0"
  "OData-Version" = "4.0"
  "MSCRM.SolutionUniqueName" = $SolutionUniqueName
}

function Get-Json([string] $Uri) { return Invoke-RestMethod -Method Get -Uri $Uri -Headers $headers -ErrorAction Stop }
function Publish-Xml([string] $Xml, [string] $Label) {
  if ($NoPublish -or $WhatIf) { Write-Step "dry-run: publicaria $Label"; return }
  Invoke-WithRetry -Label $Label -Action {
    Invoke-RestMethod -Method Post -Uri "$apiBaseUrl/PublishXml" -Headers $headers -ContentType "application/json; charset=utf-8" -Body (@{ ParameterXml = $Xml } | ConvertTo-Json) -ErrorAction Stop | Out-Null
  } | Out-Null
}

Write-Step "validando solution $SolutionUniqueName"
$solutionFilter = Escape-OData $SolutionUniqueName
$solution = Get-Json "$apiBaseUrl/solutions?`$select=solutionid,uniquename&`$filter=uniquename eq '$solutionFilter'"
if (-not $solution.value -or $solution.value.Count -ne 1) { throw "Solution '$SolutionUniqueName' não encontrada de forma única no ambiente DEV." }

Write-Step "validando entidade $EntityLogicalName"
$entityFilter = Escape-OData $EntityLogicalName
$entity = Get-Json "$apiBaseUrl/EntityDefinitions(LogicalName='$entityFilter')?`$select=MetadataId,LogicalName"
if (-not $entity.LogicalName) { throw "Entidade Dataverse não encontrada: $EntityLogicalName" }

$nameFilter = Escape-OData $WebResourceName
$lookupUri = "$apiBaseUrl/webresourceset?`$select=webresourceid,name,displayname,webresourcetype&`$filter=name eq '$nameFilter'"
$lookup = Get-Json $lookupUri
if ($lookup.value -and $lookup.value.Count -gt 1) { throw "Mais de um WebResource encontrado para '$WebResourceName'." }

$content = [Convert]::ToBase64String([IO.File]::ReadAllBytes($resolvedFile))
$displayName = "Formulário Geral - Agendar por IA"
$webResourceId = $null
if (-not $lookup.value -or $lookup.value.Count -eq 0) {
  Write-Step "criando $WebResourceName na solution $SolutionUniqueName"
  if (-not $WhatIf) {
    $body = @{ name = $WebResourceName; displayname = $displayName; webresourcetype = 1; content = $content } | ConvertTo-Json -Depth 4
    Invoke-RestMethod -Method Post -Uri "$apiBaseUrl/webresourceset" -Headers $headers -ContentType "application/json; charset=utf-8" -Body $body -ErrorAction Stop | Out-Null
    $lookup = Get-Json $lookupUri
  }
  else { Write-Step "dry-run: criaria $WebResourceName" }
}
if ($lookup.value -and $lookup.value.Count -ge 1) {
  $existing = $lookup.value[0]
  if ($existing.webresourcetype -ne 1) { throw "$WebResourceName já existe e não é HTML." }
  $webResourceId = $existing.webresourceid
  Write-Step "atualizando $WebResourceName ($webResourceId)"
  if (-not $WhatIf) {
    $patch = @{ displayname = $displayName; content = $content } | ConvertTo-Json -Depth 4
    Invoke-WithRetry -Label $WebResourceName -Action {
      Invoke-RestMethod -Method Patch -Uri "$apiBaseUrl/webresourceset($webResourceId)" -Headers $headers -ContentType "application/json; charset=utf-8" -Body $patch -ErrorAction Stop | Out-Null
    } | Out-Null
  }
}

if ($webResourceId -and -not $NoPublish) {
  $safeResourceId = [System.Security.SecurityElement]::Escape([string] $webResourceId)
  $safeEntityName = [System.Security.SecurityElement]::Escape($EntityLogicalName)
  Publish-Xml -Label $WebResourceName -Xml "<importexportxml><entities><entity>$safeEntityName</entity></entities><webresources><webresource>$safeResourceId</webresource></webresources></importexportxml>"
}

$suffix = if ($webResourceId) { " ($webResourceId)" } else { " (dry-run)" }
Write-Step "concluído: $WebResourceName$suffix"
