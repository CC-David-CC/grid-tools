// Appended to the pinned Mesh:Tool bundle by stage.py; these functions share
// the upstream module scope and use its document model rather than STL export.
window.codiMeshSnapshot = async () => {
  const document = api2.document;
  await document.flush();
  return {space:document.getSpace(),meta:document.getMeta()};
};
window.codiMeshRestore = async (snapshot) => {
  const document = api2.document;
  await document.flush();
  await document.commit('codi.before-open','Before opening project');
  document.pause();
  try {
    clear_workspace();
    await document.create('My files project');
    for (const [key,value] of Object.entries(snapshot.space)) await document.spaceStore.put(key,value);
    document.setMeta(snapshot.meta);
    await restore_workspace_from_state(snapshot.space,snapshot.meta);
    apply_camera_state(get_doc_meta(snapshot.meta).camera);
    space.update();
  } finally { document.resume(); }
  await document.commit('codi.open','Open My files project');
  api2.file.set_doc_name(document.current?.name || 'My files project');
};
