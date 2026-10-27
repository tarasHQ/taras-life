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
- 📄`vscode` - supposed to sync those, but maybe do local backup, just to make sure?
- 📄`kaspersky` - exceptions + activation (deactivate on current windows)
- 📄`power toys` - has internal backup and restore logic
- 📄`Windhawk` - mods + their settings (probably best bet is to copy config in text mode?) + your custom mods code and settings
- 📄`Obsidian` - Sync settings, editor settings, maybe per-device plugin settings? It doesn't sync ALL. So check it out.
- `git` - .gitconfig to use noreplay mail
- `Kaspersky` - Security settings -> Network Settings -> inject script into web traffic... , alongside with other useless stuff like Anti-Banner or Safe Money

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

- 📄`Portable apps` - get `startup` folder, get portable apps shortcuts folder, copy documents.

- 📄`File explorer quick access` pinned shortcuts state (screenshot)

- 📄`SMB users` - for recordings/pve-backups

- 📄`tampermonkey scripts` - export

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
