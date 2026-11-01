# Kiri:Moto and Mesh:Tool

These two desktop entries share a lazy-loaded, locally packaged Grid.Space
browser build. Kiri:Moto provides slicing; Mesh:Tool edits and repairs meshes.
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

Closing asks for confirmation while a workspace snapshot is being saved. A
write already sent to storage may still complete after the window closes.
