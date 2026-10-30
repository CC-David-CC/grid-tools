# Kiri:Moto and Mesh:Tool

These two desktop entries share a lazy-loaded, locally packaged Grid.Space
browser build. Kiri:Moto provides slicing; Mesh:Tool edits and repairs meshes.
Use Open from Files to load an account-mirrored model; upstream export actions
are redirected into Files and use version checks. `.stl`, `.obj`, and `.3mf`
files opened in Files launch Mesh:Tool. The embedded workspace and printer
settings live in the current account's browser storage; they are not yet synced
as a project to the server. Export files to Files to sync them. The apps do not
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
