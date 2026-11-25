// Give each account and each temporary window its own Grid.Space browser state.
(()=>{
 const params=new URL(location.href).searchParams;
 const scope=params.get('account')||'',scratch=params.get('scratch');
 const guest=scope.startsWith('guest:');
 if(!/^(?:user|guest):[a-f0-9-]{36}$/i.test(scope))throw Error('A WebOS workspace is required.');
 if(scratch&&!/^[a-f0-9-]{36}$/i.test(scratch))throw Error('Invalid temporary workspace.');
 const prefix='codi-grid/'+scope+'/'+(scratch?'scratch/'+scratch+'/':'');
 const raw=guest?window.sessionStorage:window.localStorage;
 const names=()=>Object.keys(raw).filter(key=>key.startsWith(prefix));
 const storage=new Proxy(raw,{
  get(target,key){
   if(key==='getItem')return name=>target.getItem(prefix+name);
   if(key==='setItem')return (name,value)=>target.setItem(prefix+name,value);
   if(key==='removeItem')return name=>target.removeItem(prefix+name);
   if(key==='clear')return ()=>names().forEach(name=>target.removeItem(name));
   if(key==='key')return index=>names()[index]?.slice(prefix.length)||null;
   if(key==='length')return names().length;
   if(typeof key==='string')return target.getItem(prefix+key)??undefined;
   return Reflect.get(target,key,target);
  },
  set(target,key,value){target.setItem(prefix+key,value);return true;},
  deleteProperty(target,key){target.removeItem(prefix+key);return true;}
 });
 Object.defineProperty(window,'localStorage',{value:storage});
 const factory=window.indexedDB,open=factory.open.bind(factory),drop=factory.deleteDatabase.bind(factory);
 const opened=new Set();
 if(scratch)window.__codiScratchDatabases=()=>[...opened];
 const temporary=guest&&!scratch;
 const connections=new Set();
 let closing=false;
 factory.open=(name,...args)=>{
  const scoped=prefix+name;
  if(scratch||temporary)opened.add(scoped);
  const request=open(scoped,...args);
  if(temporary)request.addEventListener('success',()=>{
   if(closing){request.result.close();drop(scoped);}
   else connections.add(request.result);
  });
  return request;
 };
 factory.deleteDatabase=(name,...args)=>drop(prefix+name,...args);
 if(temporary)window.addEventListener('pagehide',event=>{
  if(event.persisted)return;
  closing=true;
  storage.clear();
  for(const db of connections)db.close();
  for(const name of opened)drop(name);
 });
 const urls=new Map(),create=URL.createObjectURL.bind(URL),revoke=URL.revokeObjectURL.bind(URL),click=HTMLAnchorElement.prototype.click;URL.createObjectURL=blob=>{const url=create(blob);urls.set(url,blob);return url;};URL.revokeObjectURL=url=>{urls.delete(url);revoke(url);};
 const exportError=code=>parent.postMessage({type:'codi-grid-export-error',code},location.origin);
 HTMLAnchorElement.prototype.click=function(){if(this.hasAttribute('download')){const blob=urls.get(this.href);if(!blob){exportError('unavailable');return;}if(blob.size>128*1024*1024){exportError('too-large');return;}blob.arrayBuffer().then(bytes=>parent.postMessage({type:'codi-grid-export',name:this.download,bytes},location.origin,[bytes])).catch(()=>exportError('read-failed'));return;}return click.call(this);};
})();
