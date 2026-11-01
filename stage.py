import pathlib,shutil,re,json,sys
HERE=pathlib.Path(__file__).resolve().parent
src=pathlib.Path(sys.argv[1]).resolve();out=HERE/'node_modules/grid-dist'
if out.exists():shutil.rmtree(out)
out.mkdir(parents=True,exist_ok=True)
def put(source,destination,transform=None):
 p=out/destination;p.parent.mkdir(parents=True,exist_ok=True);data=(src/source).read_bytes();p.write_bytes(transform(data) if transform else data)
def js(data):
 s=data.decode();s=s.replace('navigator.serviceWorker.controller','null').replace('platform4.load_stl("/obj/cube.stl"','platform4.load_stl("../obj/cube.stl"');
 if 'function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc, isAsync) {' in s:
  a=s.index('    function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc, isAsync) {');b=s.index('    var __embind_register_class_constructor',a)
  s=s[:a]+"""    function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc, isAsync) {
      const method = argTypes[1] !== null && classType !== null, needs = usesDestructorStack(argTypes), returns = argTypes[0].name !== 'void';
      return createNamedFunction(humanName, function(...values) {
        if (values.length !== argTypes.length-2) throwBindingError('function ' + humanName + ' called with ' + values.length + ' arguments, expected ' + (argTypes.length-2));
        const destructors=needs?[]:null, wired=[];
        if (method) wired.push(argTypes[1].toWireType(destructors,this));
        for (let i=0;i<values.length;i++) wired.push(argTypes[i+2].toWireType(destructors,values[i]));
        const result=cppInvokerFunc(cppTargetFunc,...wired);
        if (needs) runDestructors(destructors); else for (let i=method?1:2;i<argTypes.length;i++) if(argTypes[i].destructorFunction!==null) argTypes[i].destructorFunction(wired[i-(method?1:2)]);
        return returns?argTypes[0].fromWireType(result):undefined;
      });
    }
"""+s[b:]
  a=s.index('    function __emval_get_method_caller(argCount, argTypes, kind) {');b=s.index('    function __emval_get_property',a)
  s=s[:a]+"""    function __emval_get_method_caller(argCount, argTypes, kind) {
      argTypes >>>= 0; const types = emval_lookupTypes(argCount,argTypes), ret=types.shift();
      const caller = function(obj,func,destructorsRef,args) {const values=[];let offset=0;for(const type of types){values.push(type.readValueFromPointer(args+offset));offset+=type.argPackAdvance;}const rv=kind===1?Reflect.construct(func,values):func.apply(obj,values);return ret.isVoid?undefined:emval_returnValue(ret,destructorsRef,rv);};
      return emval_addMethodCaller(caller);
    }
"""+s[b:]
 s=s.replace('"/wasm/kiri-sla.wasm"','new URL("../../../wasm/kiri-sla.wasm", import.meta.url).href').replace('"/wasm/kiri-geo.wasm"','new URL("../../../wasm/kiri-geo.wasm", import.meta.url).href').replace('"/lib/gpu/raster-worker.js"','new URL("../../gpu/raster-worker.js", import.meta.url).href');return s.encode()
def mesh_js(data):
 s=js(data).decode()
 # The About dialog is still available through Help; it should not interrupt
 # every new account's first project. Fail the build if upstream changes here.
 welcome='    if (api2.prefs.map.info.welcome !== false) {\n      api2.welcome(version2);\n    }'
 if s.count(welcome)!=1:raise RuntimeError('Mesh startup welcome hook changed; review the upstream build')
 return s.replace(welcome,'    // Codi desktop: keep About in Help, without opening it on startup.').encode()
def kiri_js(data):
 s=js(data).decode();start=s.index('function checkSeed(then) {');end=s.index('\nfunction onBooleanClick5',start);section=s[start:end]
 if section.count('api2.help.show();')!=2:raise RuntimeError('Kiri startup help hooks changed; review the upstream build')
 return (s[:start]+section.replace('api2.help.show();','/* Codi desktop: Help remains available from the menu. */')+s[end:]).encode()
for source,destination in [('src/pack/kiri-main.js','lib/main/kiri.js'),('src/pack/mesh-main.js','lib/main/mesh.js'),('src/pack/kiri-work.js','lib/kiri/run/worker.js'),('src/pack/kiri-pool.js','lib/kiri/run/minion.js'),('src/pack/mesh-work.js','lib/mesh/work.js')]:put(source,destination,mesh_js if destination=='lib/main/mesh.js' else kiri_js if destination=='lib/main/kiri.js' else js)
with (out/'lib/main/mesh.js').open('a') as f:f.write('\nwindow.codiLoadFiles = load_files;\n'+(HERE/'mesh-bridge.js').read_text())
put('web/obj/cube.stl','obj/cube.stl')
for name in ['kiri-sla.wasm','kiri-geo.wasm','kiri-ani.wasm','manifold.wasm']:put('src/wasm/'+name,'wasm/'+name)
for dest in ['lib/kiri/wasm/manifold.wasm','lib/wasm/manifold.wasm']:put('src/wasm/manifold.wasm',dest)
for name in ['raster-worker.js','raster-path.js']:put('node_modules/@gridspace/raster-path/build/'+name,'lib/gpu/'+name)
put('src/ext/tween.js','lib/ext/tween.js')
for name in ['palette.css','theme.css','menubar.css','russo-one.ttf']:put('web/moto/'+name,'moto/'+name)
for name in ['fa-v4compatibility.woff2','fa-brands-400.woff2','fa-regular-400.woff2','fa-solid-900.woff2']:put('node_modules/@fortawesome/fontawesome-free/webfonts/'+name,'font/webfonts/'+name)
put('node_modules/@fortawesome/fontawesome-free/css/all.min.css','font/css/all.min.css')
put('node_modules/@fortawesome/fontawesome-free/js/all.min.js','font/js/all.min.js')
put('node_modules/bootstrap-icons/font/bootstrap-icons.min.css','fon2/bootstrap-icons.min.css')
for name in ['bootstrap-icons.woff','bootstrap-icons.woff2']:put('node_modules/bootstrap-icons/font/fonts/'+name,'fon2/fonts/'+name)
for app in ['kiri','mesh']:
 put('web/'+app+'/index.css',app+'/index.css')
 data=(src/'web'/app/'index.html').read_text();data=re.sub(r'<script>\s*(.*?)\s*</script>',lambda m:'<script src="theme.js"></script>' if (out/app/'theme.js').write_text(m.group(1)) else '',data,flags=re.S)
 data=data.replace('href="/', 'href="../').replace('src="/', 'src="../').replace(" onclick=\"kiri.api.modal.show('don8')\"",'')
 data=data.replace('<head>','<head><script src="../scope.js"></script>')
 (out/app/'index.html').write_text(data)
for name in ['kirimoto.png','meshtool.png']:put('web/icon/'+name,'icon/'+name)
(out/'license.txt').write_bytes((src/'license.md').read_bytes())
(out/'scope.js').write_bytes((HERE/'scope.js').read_bytes())
for pkg in ['three','three-mesh-bvh','jszip','quickjs-emscripten','manifold-3d','earcut','@tracespace/parser','@tweenjs/tween.js','@gridspace/raster-path','@fortawesome/fontawesome-free','bootstrap-icons']:
 root=src/'node_modules'/pkg;license=next((p for p in root.iterdir() if p.is_file() and p.name.lower().startswith('license')),None)
 if license is None:raise RuntimeError('Missing upstream license for '+pkg)
 dest=out/'notices'/(pkg.replace('/','-')+'.txt');dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(license.read_bytes())
assets=['node_modules/grid-dist/'+str(p.relative_to(out)) for p in out.rglob('*') if p.is_file()]
(HERE/'app.json').write_text(json.dumps({'assets':sorted(assets)},indent=2)+'\n');print('assets',len(assets),'size',sum(p.stat().st_size for p in out.rglob('*') if p.is_file()))
