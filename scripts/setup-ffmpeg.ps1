# Installs the current Windows release locally; it does not change system PATH.
# Source is linked by https://ffmpeg.org/download.html. Verify the vendor checksum.
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$taskRepoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$taskRuntime = Join-Path $taskRepoRoot '.runtime\ffmpeg'
New-Item -ItemType Directory -Path $taskRuntime -Force | Out-Null
$taskArchive = Join-Path $taskRuntime 'ffmpeg-release-essentials.7z'
$taskBaseUrl = 'https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.7z'
$taskRelease = (& curl.exe --fail --location --silent --show-error --max-time 30 'https://api.github.com/repos/GyanD/codexffmpeg/releases/tags/9.0.2') | ConvertFrom-Json
$taskAsset = @($taskRelease.assets | Where-Object { $_.name -eq 'ffmpeg-9.0.2-essentials_build.7z' })
$taskChecksumAsset = @($taskRelease.assets | Where-Object { $_.name -eq 'ffmpeg-9.0.2-essentials_build.7z.sha256' })
$taskDownload = if ($taskAsset.Count -eq 1) { $taskAsset[0].browser_download_url } else { $taskBaseUrl }
$taskChecksumUrl = if ($taskAsset.Count -eq 1 -and $taskChecksumAsset.Count -eq 1) { $taskChecksumAsset[0].browser_download_url } else { $taskBaseUrl + '.sha256' }
if (!$taskDownload.StartsWith('https://github.com/GyanD/codexffmpeg/releases/download/9.0.2/') -and $taskDownload -ne $taskBaseUrl) { throw 'Unexpected FFmpeg mirror.' }
if (!$taskChecksumUrl.StartsWith('https://github.com/GyanD/codexffmpeg/releases/download/9.0.2/') -and $taskChecksumUrl -ne ($taskBaseUrl + '.sha256')) { throw 'Unexpected FFmpeg checksum source.' }
& curl.exe --fail --location --silent --show-error --output $taskArchive $taskDownload
if ($LASTEXITCODE -ne 0) { throw 'FFmpeg download failed.' }
$taskChecksumText = & curl.exe --fail --location --silent --show-error $taskChecksumUrl
if ($LASTEXITCODE -ne 0) { throw 'FFmpeg checksum download failed.' }
$taskExpected = [regex]::Match($taskChecksumText, '[a-fA-F0-9]{64}').Value
$taskActual = (Get-FileHash -LiteralPath $taskArchive -Algorithm SHA256).Hash
if (!$taskExpected -or $taskActual -ne $taskExpected) { throw 'FFmpeg archive checksum verification failed.' }
& tar.exe -xf $taskArchive -C $taskRuntime
if ($LASTEXITCODE -ne 0) { throw 'FFmpeg archive extraction failed.' }
$taskExecutables = @(Get-ChildItem -LiteralPath $taskRuntime -Recurse -Filter 'ffmpeg.exe')
if ($taskExecutables.Count -ne 1) { throw 'Unexpected FFmpeg archive layout.' }
$taskExecutable = $taskExecutables[0].FullName
& $taskExecutable -version | Select-Object -First 1
Write-Output ('FFMPEG_PATH=' + $taskExecutable)
