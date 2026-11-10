$desktop = [System.Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktop 'Shikhon Admin.lnk'
$targetExe = (Convert-Path 'desktop-admin\dist-package\Shikhon Admin-win32-x64\Shikhon Admin.exe')
$iconFile = (Convert-Path 'desktop-admin\build\icon.ico')

$wsh = New-Object -ComObject WScript.Shell
$shortcut = $wsh.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $targetExe
$shortcut.WorkingDirectory = [System.IO.Path]::GetDirectoryName($targetExe)
$shortcut.IconLocation = "$iconFile,0"
$shortcut.Description = "Shikhon Admin Dashboard"
$shortcut.Save()

Write-Output "Shortcut saved: $shortcutPath -> $targetExe"

$code = @"
using System;
using System.Runtime.InteropServices;
public class ShellRefresh {
    [DllImport("shell32.dll")]
    public static extern void SHChangeNotify(int wEventId, uint uFlags, IntPtr dwItem1, IntPtr dwItem2);
}
"@

Add-Type -TypeDefinition $code
[ShellRefresh]::SHChangeNotify(0x08000000, 0, [IntPtr]::Zero, [IntPtr]::Zero)
Write-Output "SHChangeNotify triggered: Desktop and Explorer icons refreshed!"
