# Kiri:Moto on WebOS

WebOS opens **Fabrication Studio (Kiri:Moto)** from **3D Printing**. Kiri:Moto
and **Mesh Editor (Mesh:Tool)** share the Grid.Space build. See the
[package and workspace notes](../../README.md) for the pinned upstream build
and the WebOS Files bridge.

| Artifact | Tested revision |
| --- | --- |
| Grid.Space wrapper | `f36e83dfafb6dd9f532596cdefeec93934e8cc43` |
| WebOS viewer | `6676a3842adb988f7d75b32d9d4470914ca5ac5362a1f25876452c6922b0b23d` |
| Previous viewer | `ec3deccd50677eda9ff2ab8e2b7181061c3ad6d68b42634e91ea87daf1ace736` |

## Phone workflow

1. Open **File**, then **Add 20 mm example cube**. A cube appears beside the
   model already on the plate. Use the current filament profile and choose
   **Slice**, then **Preview**. The test profile generated 81 slices for the cube.
2. Use **File › Save workspace as…**. Enter a name and save. A bare filename
   takes the editable `.kiri` extension.
3. Choose **Export**, then **G-code**. In the WebOS export panel, enter a
   filename and use **Save export**. A bare filename takes the offered extension.
4. Close Kiri:Moto. Open the `.kiri` file from My Files and confirm **Replace**.
   The plate restores the editable models. Add another cube and use
   **File › Save workspace** to update the same project.
5. Open the exported `.gcode` file from My Files. G-code Preview shows
   the toolpath. The sample output was about 2.17 MB and contained extrusion moves.

Guest My Files stays available in the current browser tab. Signed-in desktop
testing uploaded a synthetic 12 mm STL, picked it in Kiri:Moto, and verified
that the account could reopen the saved workspace in a fresh browser session.
The menu stayed within the portrait viewport, and the workspace name field
accepted typing with the Android software keyboard open. Cancelling the
model picker left the plate available for work.

| Workflow | Galaxy S10+ portrait | Desktop Chromium |
| --- | --- | --- |
| Add a known model to the build plate | Pass | Pass |
| Upload and import a separate STL from My Files | Desktop check | Pass |
| Select and resize a model | Desktop check | Pass |
| Slice and preview with a filament profile | Pass | Pass |
| Save, reopen and revise an editable workspace | Pass | Pass |
| Export and inspect G-code through My Files | Pass | Pass |
| Export selected geometry as STL | Desktop check | Pass |
| Configure advanced fabrication modes and profiles | Pending | Pending |

Mouse and keyboard testing scaled a 20 mm cube to 24 mm and verified the
exported STL contained 12 facets at the new dimensions. The desktop parity
and phone coverage results are 7 of 8 and 4 of 8. Advanced profiles, alternate
fabrication modes, and physical printer operation remain outside these results.

The physical portrait check used Chrome 158.0.8127.92 on the Galaxy S10+ at
411 CSS pixels wide. A Moto G 5G ran the same workflow in landscape on Chrome
158.0.8127.42. Desktop Chromium was 158.0.8127.36. Touch-tablet emulation at
820 × 1050 CSS pixels exercised the file menu, slice preview, export save,
workspace reopen and in-place save. A Mesh:Tool regression check on the S10+
added a cube, saved a native `.meshproj`, and reopened it from My Files.

## Physical Galaxy S10+ screenshots
The screenshots show the hosted guest replay at ksu.codes.

- [Readable File actions](screenshots/s10-file-menu.png)
- [Layer preview](screenshots/s10-preview.png)
- [Editable workspace reopened from My Files](screenshots/s10-reopened.png)
- [Exported toolpath opened in G-code Preview](screenshots/s10-gcode-preview.png)
