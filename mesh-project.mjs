const FORMAT='codi-mesh-project/1', LIMIT=128*1024*1024;
const TYPES=Object.freeze({Float32Array,Float64Array,Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array});
// Mesh:Tool may accept a snapshot but fail to restore a model faithfully.
// Compare model IDs and every saved vertex, not just the number of entries.
export function sameMeshGeometry(expected,actual){
 const a=expected?.space,b=actual?.space;if(!a||!b||Object.keys(a).length!==Object.keys(b).length)return false;
 for(const [id,model] of Object.entries(a)){
  if(!Object.hasOwn(b,id))return false;
  if(!!model?.mesh!==!!b[id]?.mesh)return false;
  if(model?.mesh){const vertices=b[id]?.mesh;if(!vertices||vertices.length!==model.mesh.length)return false;for(let i=0;i<vertices.length;i++)if(vertices[i]!==model.mesh[i])return false;}
 }
 return true;
}
function validTypedValues(type,values){
 const ranges={Int8Array:[-128,127],Uint8Array:[0,255],Uint8ClampedArray:[0,255],Int16Array:[-32768,32767],Uint16Array:[0,65535],Int32Array:[-2147483648,2147483647],Uint32Array:[0,4294967295]};
 return values.every(n=>typeof n==='number'&&Number.isFinite(n)&&(type!=='Float32Array'||(Number.isFinite(Math.fround(n))&&(n===0||Math.fround(n)!==0)))&&(!ranges[type]||(Number.isInteger(n)&&n>=ranges[type][0]&&n<=ranges[type][1])));
}
function check(snapshot){
 if(!snapshot||typeof snapshot!=='object'||!snapshot.space||!snapshot.meta||Array.isArray(snapshot.space)||Array.isArray(snapshot.meta))throw Error('This is not a supported Mesh:Tool project.');
 let count=0;const stack=[snapshot.space,snapshot.meta];while(stack.length){const value=stack.pop();if(!value||typeof value!=='object')continue;if(ArrayBuffer.isView(value)){const type=Object.prototype.toString.call(value).slice(8,-1);if(!Object.hasOwn(TYPES,type)||!validTypedValues(type,value))throw Error('Project contains invalid typed data.');continue;}if(++count>1000000)throw Error('Project is too complex.');for(const [key,item] of Object.entries(value)){if(key==='__proto__'||key==='constructor'||key==='prototype')throw Error('Project contains an unsupported field.');if(item&&typeof item==='object')stack.push(item);else if(typeof item==='number'&&!Number.isFinite(item))throw Error('Project contains an invalid number.');}}
 const entries=Object.entries(snapshot.space);if(entries.length>10000)throw Error('Project contains too many objects.');
 for(const [,item] of entries){if(Array.isArray(item)){if(item.some(id=>typeof id!=='string'||!Object.hasOwn(snapshot.space,id)))throw Error('Project has an invalid model group.');}else if(item?.type==='sketch'){continue;}else if(!item||typeof item!=='object'||typeof item.file!=='string'||Object.prototype.toString.call(item.mesh)!=='[object Float32Array]'||!item.mesh.length||item.mesh.length%9!==0||item.mesh.some(n=>!Number.isFinite(n)))throw Error('Project has invalid mesh data.');}
 return snapshot;
}
export function encodeMeshProject(snapshot){check(snapshot);const bytes=new TextEncoder().encode(JSON.stringify({format:FORMAT,snapshot},(_key,value)=>{if(ArrayBuffer.isView(value)){const type=value.constructor.name;if(!Object.hasOwn(TYPES,type))throw Error('Unsupported project data.');return {$codiTypedArray:type,values:Array.from(value)}}return value}));if(bytes.byteLength>LIMIT)throw Error('Project exceeds the 128 MiB file limit.');return bytes;}
export function decodeMeshProject(bytes){if(bytes.byteLength>LIMIT)throw Error('Project exceeds the 128 MiB file limit.');let data;try{data=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes),(_key,value)=>{if(value&&typeof value==='object'&&Object.hasOwn(value,'$codiTypedArray')){const Type=TYPES[value.$codiTypedArray];if(!Type||Object.keys(value).length!==2||!Array.isArray(value.values)||!validTypedValues(value.$codiTypedArray,value.values))throw Error('Invalid typed array');return new Type(value.values)}return value});}catch{throw Error('This is not a valid Mesh:Tool project file.');}if(data?.format!==FORMAT)throw Error('This is not a supported Mesh:Tool project.');return check(data.snapshot);}
