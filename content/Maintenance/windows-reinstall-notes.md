## Rules

- Includes notes for **pre-install preparation** + **post install things**
- If something is not used anymore, don't rush to delete it, if there's chance it'll be used again in future. List can be huge. You go through it like once every year or two. It's better

📄 - shows where you should check things and get the latest version of them

## 📄Apps

- ### Downloads
  - `All-in-one visual c++ runtimes`
  - `.net "whatever it's called" things`
- 📄Check settings of all apps, portable ones may be safe, but other ones may need the export
- 📄`ClickMonitorDDC` - after reinstall would need to update the config
- 📄`Obsidian` - download and install fonts `jetbrains mono` & `atkinson hyperlegible next`
- 📄`Deskflow` - config in program data for monitors location
- 📄`PotPlayer` - not sure if it's better than re-setting up.
- 📄`vscode` - supposed to sync those, but maybe do local backup, just to make sure?&#x20;
  - you have 2 users, normal and admin(for protected ahk scripts). admin created automatically if not present. you need to copypaste `settings` and `keybindings` in user folder in `roaming`. Change theme though, to distinguish between all instances.
    - copy `.gitconfig` from user folder before reinstall. For this setup you need to use `dpapi` credentials manager + pat. That's all configured in gitconfig.
  - So, the idea is - elevated instance uses different user folder + different shared storage folder, to avoid logging me out in non-elevated instance, after I run elevated instance.
    - Ok, maybe not, there were issues with pushing. I authed through dpapi + browser and seems like it's working?
- 📄`kaspersky` - exceptions + activation (deactivate on current windows)&#x20;
  - Security settings -> Network Settings -> inject script into web traffic... , alongside with other useless stuff like Anti-Banner or Safe Money
  - add into network's trusted addresses openrouter.ai / chatgpt.com / etc. so kaspersky won't use self-signed certificates.
    - Or just disable scanning secure connection (used for useless protection)
- 📄`OBS` - plugins and their settings. Scenes. Profiles. Etc. Backup all.
- 📄`power toys` - has internal backup and restore logic
- 📄`Windhawk` - mods + their settings (probably best bet is to copy config in text mode?) + your custom mods code and settings
- 📄`Obsidian` - Sync settings, editor settings, maybe per-device plugin settings? It doesn't sync ALL. So check it out.
- `git` - .gitconfig to use noreplay mail
- `Microsoft Office` - https://config.office.com/deploymentsettings (download installer and place xml with `setup.exe /configuration test.xml`) so you can install only word/excel.

## Installation Process

- Figure out how to use proper user name and not its BS with cropped email.

## Files Extraction

- Folders : `documents`, `Dev`, `Desktop`

## Settings

- ### Mouse
  - 📄Get speed settings
  - Disable that high-precision thing
  - Use custom ibeam cursor (in customization in archive)
- ### Other
  - 📄folder icons - remember/screenshot which are you using. they proved to be useful
  - Privacy -> Search - remove store/bing suggestions
  - 📄backup windows credentials
  - dd-MM-yyyy short date is available through "numbers" settings in legacy control panel
  - ctrl+shift for ukr<->rus language switching you should install ukr as additional keyboard (not additional language)
  - `multitasking` - disable that top bar-snap-layout-thing
  - `system sounds` - use custom sound with 500ms silence for `default beep`, so it's not broken in headphones, and more pleasant to the ear.
  - #### `regedit`
    - To disable HDCP `[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000]` - create dword `"RMHdcpKeyglobZero"=dword:00000001`, last 4 digits in path `\0000` is id of the gpu, if you have multiple - I added this on both.
- ### File Explorer Options
  - 📄 - screenshot all settings. It's pretty useful to configure.

## Tinkering

- ### Task Scheduler
  - 📄**AHK task** Export before install and then import after.
  - **Disable Microsoft compatibility service** through the task scheduler (was using cpu too much)
    - `Task Scheduler Library` > `Microsoft` > `Windows` > `Application Experience` > `Microsoft Compatibility Appraiser Exp` task - disable
- ### Services.msc
  - Logitech/Razer/NordVpn - disable services, for logitech maybe you can delete some .exe files to be sure
- ### Regedit
  - 📄Keyboard tweaks `HKEY_CURRENT_USER\Control Panel\Accessibility\Keyboard Response`
    - `AutroRepeatDelay` - 150, `AutoRepeatRate` - 7, `DelayBeforeAcceptance` - 0, `BounceTime` - 0
    - but you also need to max out GUI sliders
  - `Computer\HKEY_CURRENT_USER\Control Panel\Desktop` to 50 to reduce time to show menus

## Other

- 📄`portable-apps` - get `startup` folder, get portable apps shortcuts folder, copy documents.

- 📄`File explorer quick access` pinned shortcuts state (screenshot)

- 📄`SMB users` - for recordings/pve-backups

- 📄`tampermonkey scripts` - export (from both pc?)

- 📄`Drivers`, ax210, motherboard, install nvidia after amd

- `C:/Windows/HelpPane.exe` - make yourself owner, give your user edit rights, and rename it, so accidental f1 presses won't open that help window

- Reserve ip address of PC by its mac on router.

- Removing store search (when telemetry is off and a toggle in settings is hidden) https://superuser.com/questions/1927207/how-to-remove-the-store-results-from-the-start-menu

- https://schneegans.de/windows/unattend-generator/ - for inspiration for configurations

- Disable windows restore/recovery for C:/ (uses like 15-20 gigs for nothing)

- Enable long paths

- disable fast startup/hibernation

- Disable Edge Startup Boost and Background mode

- Disable device's silent auto install of proprietary software
  - gpedit, CC > AT > Sys > DI > Prevent automatic download of app... metadata.

- https://github.com/ChrisTitusTech/winutil - debloating app

- Disable search indexing. Works like ass anyways, and you have "everything" app that is miles better (and quicker) in you need to find something

---

Previous install screenshots.
![[Maintenance/_attachments/Snipaste_2026-10-21_22-46-28.png|255]]
