$desktop = [System.Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktop 'Shikhon Admin.lnk'
$targetExe = (Convert-Path 'desktop-admin\dist-package\Shikhon Admin-win32-x64\Shikhon Admin.exe')
$iconFile = (Convert-Path 'desktop-admin\build\shikhon_brand_icon.ico')

# Delete existing shortcut if present so Windows cannot reuse cached shortcut icon
if (Test-Path $shortcutPath) {
    Remove-Item $shortcutPath -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 300
}

$wsh = New-Object -ComObject WScript.Shell
$shortcut = $wsh.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $targetExe
$shortcut.WorkingDirectory = [System.IO.Path]::GetDirectoryName($targetExe)
$shortcut.IconLocation = "$iconFile,0"
$shortcut.Description = "Shikhon Admin Dashboard"
$shortcut.Save()

Write-Output "Shortcut saved with fresh brand icon: $shortcutPath -> $targetExe with icon $iconFile"

# Refresh shell and notify icon change
$code = @"
using System;
using System.Runtime.InteropServices;
public class ShellRefresh {
    [DllImport("shell32.dll")]
    public static extern void SHChangeNotify(int wEventId, uint uFlags, IntPtr dwItem1, IntPtr dwItem2);
}
"@

try {
    Add-Type -TypeDefinition $code -ErrorAction SilentlyContinue
} catch {}

try {
    [ShellRefresh]::SHChangeNotify(0x08000000, 0, [IntPtr]::Zero, [IntPtr]::Zero)
} catch {}

# Also trigger ie4uinit if available to flush icon cache
if (Get-Command ie4uinit.exe -ErrorAction SilentlyContinue) {
    Start-Process -FilePath "ie4uinit.exe" -ArgumentList "-show" -Wait -ErrorAction SilentlyContinue
}

Write-Output "Desktop and Explorer icons refreshed!"
