# Mesh:Tool on WebOS

Open **3D Printing → Mesh Editor (Mesh:Tool)**. Mesh:Tool and Kiri:Moto share
the local Grid.Space bundle. In a checkout with the wrapper at
`apps/grid-tools`, build the pinned browser assets with
`npm ci --prefix apps/grid-tools --ignore-scripts` and
`python3 apps/grid-tools/prepare.py`. WebGL is required.

## Phone workflow

1. Open **File → Add 20-unit example cube**. If the cube is deselected, open
   **Objects and log** and tap the cube in the object list.
2. Open **Objects → Duplicate**. The object list now contains the original
   cube and its duplicate.
3. Select one cube and open **File → Export → STL**. Enter a filename in the
   WebOS export panel and choose **Save export**. The saved binary STL has
   12 triangles and spans 20 units on all three axes. STL carries no unit
   label.
4. Choose **File → Save workspace as…**. A bare name gains the `.meshproj`
   extension. Close the window, open the project from Files and confirm
   **Replace**. Both models remain editable with the same geometry.
5. Make another edit and choose **File → Save workspace** to update the file.
   Use **Open model from My files** to import the STL as additional geometry.

[Help menu on the Galaxy S10+](mesh-tool-portrait-help.png) ·
[Duplicated objects](mesh-tool-portrait-duplicated.png) ·
[STL saved to Files](mesh-tool-portrait-exported.png) ·
[Editable workspace reopened](mesh-tool-portrait-reopened.png)

## Device coverage

The physical Galaxy S10+ used Chrome 158.0.8127.92 in portrait. The Moto G 5G
used Chrome 158.0.8127.42 in landscape. Chromium touch-tablet emulation at
820 × 1050 CSS pixels completed the same core workflow. Guest saves last
for the current browser tab. The isolated signed-in desktop replay reopened
the synced project from a fresh context.

| Workflow | S10+ | Desktop |
| --- | --- | --- |
| Add and inspect the generated cube | Pass | Pass |
| Select and duplicate a mesh | Pass | Pass |
| Switch modes, reach all menu headings and change the camera | Mode and menu pass | Pass |
| Export a separate fabrication file and check its contents | STL | STL, OBJ, 3MF and STEP |
| Save and reopen an editable project through Files | Pass | Pass |
| Keep edits on cancel and save a later revision in place | Pass | Pass |
| Import the exported STL through the My Files picker | Pass | Pass |
| Reopen synchronized work in a fresh signed-in session | | Pass |
| Advanced Boolean repair workflow | | Open |
| Sketch creation and editing workflow | | Open |

The evidence covers the digital mesh. Physical fabrication is unverified.

Viewer `56f8d568effe543f4efa74d0d95092b365519dbb6af3c4eea2c8445a384989c1` uses Grid.Space wrapper `cb3a5aefa1450c222ca4c8c5f4a583aa426a5012`. The
[WebOS release record](https://github.com/CC-David-CC/WebOS/blob/webos/mesh-tool-qualification/deploy/ACTIVE-RELEASE.md)
contains the exact rollback.
