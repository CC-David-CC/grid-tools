# Kiri:Moto and Mesh:Tool

These two desktop entries share a lazy-loaded, locally packaged Grid.Space
browser build. Kiri:Moto provides slicing; Mesh:Tool edits and repairs meshes.
In Kiri:Moto, choose **File → Add 20 mm example cube** to try a first model
without uploading one. It adds a closed cube alongside any existing models.
Select a printer profile and slice it, then save the workspace or export the
toolpath to My files. The STL geometry assumes millimetres; an STL does not
contain a unit label. Verify the profile and toolpath independently before
using a real printer. The example does not connect to or validate hardware.
Use Open from My files to load an account-mirrored model. Upload a model from your computer in Files first. Upstream export actions open a save panel where you can choose a My files folder and name; replacements require confirmation and use version checks. A pending export prompts before its window closes. `.stl`, `.obj`, and `.3mf`
files opened in Files launch Mesh:Tool. Kiri:Moto can save a `.kiri` workspace snapshot, including its models and slicing settings, to My files. That snapshot is synchronized with the account drive. Use Open workspace to restore it; the current workspace will be replaced after confirmation. Changes made after a snapshot require another save. Mesh:Tool can also save a `.meshproj` workspace snapshot to My files, including mesh geometry, groups, sketches and document metadata. Select Open workspace to restore a snapshot; save again after subsequent edits. Snapshots preserve the current document, not its undo history. Other working state remains in browser storage; export fabrication files separately. The apps do not
connect directly to a printer. WebGL is required.

Run `npm ci --prefix apps/system/grid-tools --ignore-scripts`, then run
`python3 apps/system/grid-tools/prepare.py` with Node on PATH before building.
This fetches the pinned upstream Git revision, runs its browser build using the
pinned build dependencies, adapts paths and supplies Emscripten bindings without
dynamic JavaScript execution. It disables the upstream unrestricted frame
message API and redirects downloads to the Files bridge. Per-account namespaces
separate these apps' browser workspace keys. Prepared assets and downloaded
packages remain outside Git. Upstream and dependency license notices are
included in the resulting bundle.

Browser tests cover a model imported from Files, mesh union, STL export to Files,
Kiri:Moto model import, slicing and G-code export to Files, and account workspace isolation. Other
formats, machine profiles, advanced CNC/SLA features, and physical printers have
not been comprehensively tested. Verify the printer profile and output yourself.

Workspace namespacing prevents accidental cross-account reuse in this desktop;
it is not a security boundary against other trusted same-origin application code.

The embedded controls are upstream desktop-oriented interfaces; a phone-sized automated workflow does not establish that every control is touch-friendly. Kiri workspace snapshots are explicit saves, not continuous synchronization. Mesh:Tool snapshots are also explicit saves; export fabrication results to My files separately. Printer profiles, resulting G-code, mesh repair and fabrication safety require independent verification.

The current version puts model and workspace actions in each editor's File
menu, with the original desktop controls as a fallback if the menu cannot be
found. First save and Save workspace as ask for a My files path. Upstream
file-input activation is redirected to the My files picker. Mesh:Tool's About
and Kiri:Moto's Help no longer open automatically at first start, but remain
available from their menus. The stage script checks the upstream startup hooks
and fails if they change. Desktop, emulated-phone and 4K account checks cover
menu actions, model import, workspace save, sync and reopen; a clean rebuilt
bundle passed the phone-sized workflow. These checks do not establish physical
touch behavior. A public phone-sized workflow also passed.

Export saves capture the chosen destination when Save export is pressed, even if the filename changes while storage responds. Existing-file checks use metadata rather than rereading the full model; an immediate conflict is reported for resolution in Files. Workspace snapshot writes also report immediate conflicts.

When synchronization finds that a saved workspace has changed, was deleted, or has conflicting copies, a notice stays visible without replacing the open model. Save a copy or reopen the workspace as appropriate. The warning checks the browser mirror; it does not guarantee instant detection of changes on another device before synchronization.

Workspace and export replacement use desktop confirmations. Changing a saved target while confirmation is open prevents replacement. When opening a workspace, the app also compares the current model and settings before and after confirmation and refuses to replace changed work; camera movement and Kiri's internal save timestamp are excluded from that comparison. Browser-local state and user changes made after a snapshot still require a new save.

If opening a workspace and restoring the previous one both fail, a persistent
warning marks the current workspace uncertain. Saving workspace snapshots and
exports is blocked until a saved workspace is opened successfully; closing asks
for confirmation. Desktop and emulated-phone account tests injected both
failures in Kiri:Moto after slicing a cube and checked preservation and recovery.
Separate tests imported an STL, sliced it, and synchronized the G-code export.
These checks do not certify geometry, printer settings, or physical output.

Closing asks for confirmation while a workspace snapshot is being saved. A
write already sent to storage may still complete after the window closes.

The export filename must retain the format extension supplied by the editor,
so an STL cannot accidentally be saved as a PNG. Common G-code extensions
(`.gcode`, `.gco`, `.nc`, `.ngc`, `.gc`, `.g`, and `.tap`) are interchangeable
for a G-code export. A rejected name leaves the pending export open for
correction. This checks the label, not the exported content or suitability for a
machine. Local desktop and emulated-phone tests cover a real Mesh STL, rejection
of a `.png` name, a real Kiri slice saved as `.nc`, account synchronization,
and fresh-session recovery; physical touch and hardware are not verified.

If a restored workspace file is invalid or missing, its stale file association
is cleared and the current in-browser workspace remains available. Local desktop
and emulated-phone tests cover both Kiri:Moto and Mesh:Tool with an invalid
workspace, model import, snapshot save/server sync and refresh; phone-sized
missing-file tests cover the fallback. Physical touch and machine output remain
unverified.

Kiri workspace import rejects geometry coordinates that cannot be represented
as finite 32-bit floats, and checks the restored vertex values against the
32-bit conversion in a temporary editor before replacing the current workspace.
This catches lost or changed geometry in that import path; it is not a complete
validation of every setting, model format, slicer operation or printer output.

Mesh:Tool project snapshots reject invalid typed-array values before opening or
saving, including integers outside their array's range and non-finite or
unrepresentable 32-bit float values. A rejected project leaves the current
workspace open. This protects against these conversion errors; it does not
establish that every third-party project field is supported.

If a browser export cannot be read or exceeds the file-size limit, its error is
shown in the desktop app's status area rather than a browser alert. The export
is not written; choose another export or retry after correcting the problem.

If opening a restored file fails because storage is temporarily unavailable or
the file conflicts, the original association is retained and **Retry saved
file** is offered. Workspace imports ask before replacing the current workspace;
cancel keeps the current work. A scratch snapshot defaults to a separate path if
the original used the default name. Missing or invalid files still clear stale
associations. Local registered-account desktop and emulated-phone tests checked
both tools using a saved workspace, injected read failure, cancel/confirm retry,
synchronization, and preservation of the original file. Physical touch and
manufacturing behavior remain unverified.
Phone-sized account tests also saved a separate scratch workspace after the
injected read failure and verified that the original server file was unchanged
for both Kiri:Moto and Mesh:Tool. This used the fallback workspace, not a
physical device or full manufacturing workflow.

The example was checked as a closed 20 mm cube, and local registered-account
Chrome tests on desktop and an emulated phone added two copies, sliced them,
saved and synchronized a workspace, and reopened it. CAM inch scaling was
checked numerically, not through a real CAM workflow. Physical touch and
fabrication remain unverified.

Exports suggest the folder of the most recently saved or opened workspace,
using the filename supplied by the editor; the path remains editable before
saving. Without an associated workspace, exports start in My files root.
The suggestion does not change the export contents. Real Kiri:Moto desktop
and emulated-phone account tests cover adding the example cube, slicing,
saving a workspace in a folder, exporting beside it, syncing and reading the
export in a fresh browser session. Mesh:Tool shares the suggestion logic but
was not independently exercised in that test; physical touch and machine
output remain unverified.
