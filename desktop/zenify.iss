[Setup]
AppName=Zenify
AppVersion=1.0.0
AppPublisher=Edii Loupatty
DefaultDirName={autopf}\Zenify
DefaultGroupName=Zenify
OutputDir=Output
OutputBaseFilename=ZenifySetup
SetupIconFile=logo.ico
Compression=lzma
SolidCompression=yes
ArchitecturesAllowed=x64
ArchitecturesInstallIn64BitMode=x64

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
Source: "zenify-desktop.exe"; DestDir: "{app}"; Flags: ignoreversion
; Jika kamu punya file lain yang dibutuhkan saat jalan, tambahkan di sini.

[Icons]
Name: "{group}\Zenify"; Filename: "{app}\zenify-desktop.exe"
Name: "{commondesktop}\Zenify"; Filename: "{app}\zenify-desktop.exe"; Tasks: desktopicon

[Run]
Filename: "{app}\zenify-desktop.exe"; Description: "{cm:LaunchProgram,Zenify}"; Flags: nowait postinstall skipifsilent
