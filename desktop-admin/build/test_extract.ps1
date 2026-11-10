Add-Type -AssemblyName System.Drawing
$exe = (Convert-Path 'desktop-admin\dist-package\Shikhon Admin-win32-x64\Shikhon Admin.exe')
$icon = [System.Drawing.Icon]::ExtractAssociatedIcon($exe)
$bmp = $icon.ToBitmap()
$bmp.Save('desktop-admin\build\extracted_exe_icon.png')
Write-Output "Extracted exe icon saved to desktop-admin\build\extracted_exe_icon.png"
