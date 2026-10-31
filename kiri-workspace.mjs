const LIMIT=128*1024*1024,FORMAT='codi-kiri-workspace/1';
export function encodeWorkspace(snapshot){
 const {settings,version,work,view,time}=snapshot||{};
 const data={format:FORMAT,workspace:{settings,version,work,view,time}};
 const bytes=new TextEncoder().encode(JSON.stringify(data));if(bytes.byteLength>LIMIT)throw Error('Workspace exceeds the 128 MiB file limit.');
 // Validate our own output as well as imported files before offering it.
 decodeWorkspace(bytes);return bytes;
}
export function decodeWorkspace(bytes){
 if(bytes.byteLength>LIMIT)throw Error('Workspace exceeds the 128 MiB file limit.');
 let value;try{value=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes))}catch{throw Error('This is not a valid Kiri workspace file.');}
 const w=value?.workspace;if(value?.format!==FORMAT||!w||!w.settings||typeof w.settings!=='object'||Array.isArray(w.settings)||!Array.isArray(w.work)||w.work.length>256||!Number.isFinite(w.time))throw Error('This is not a supported Kiri workspace.');
 if(typeof w.settings.mode!=='string'||!w.settings.controller||!w.settings.process||!w.settings.device||!w.settings.sproc||!w.settings.cproc||!w.settings.filter||!w.settings.devices||!w.settings.devproc||!w.settings.widget)throw Error('Workspace settings are incomplete.');
 const ids=new Set();for(const item of w.work){if(!item||item.type!==100||item.ver!==1||item.json!==true||typeof item.id!=='string'||!item.id||ids.has(item.id)||typeof item.group!=='string'||!item.group||!item.track||typeof item.track!=='object'||!item.track.pos||!['x','y','z'].every(k=>Number.isFinite(item.track.pos[k]))||!Array.isArray(item.geo)||!item.geo.length||item.geo.length%9!==0)throw Error('Workspace model data is invalid.');ids.add(item.id);for(const n of item.geo)if(typeof n!=='number'||!Number.isFinite(n))throw Error('Workspace model coordinates are invalid.');}
 const stack=[w.settings,w.view];let nodes=0;while(stack.length){const item=stack.pop();if(!item||typeof item!=='object')continue;if(++nodes>1000000)throw Error('Workspace settings are too complex.');for(const [key,v] of Object.entries(item)){if(key==='__proto__'||key==='constructor'||key==='prototype')throw Error('Workspace contains an unsupported setting.');if(v&&typeof v==='object')stack.push(v);}}
 return w;
}
