import assert from 'node:assert/strict';
import {encodeMeshProject,decodeMeshProject} from '../apps/system/grid-tools/mesh-project.mjs';
const snapshot={space:{model:{file:'cube',mesh:new Float32Array([0,0,0,1,0,0,0,1,0])},group:['model']},meta:{model:{position:{x:2,y:3,z:4}}}};
const result=decodeMeshProject(encodeMeshProject(snapshot));assert.deepEqual(result,snapshot);
assert.throws(()=>decodeMeshProject(new TextEncoder().encode('{bad')),/valid/);
assert.throws(()=>encodeMeshProject({space:{group:['missing']},meta:{}}),/group/);
assert.throws(()=>encodeMeshProject({space:{model:{file:'a',mesh:new Float32Array([1,2,3])}},meta:{}}),/mesh/);
assert.throws(()=>decodeMeshProject(new TextEncoder().encode('{"format":"codi-mesh-project/1","snapshot":{"space":{},"meta":{"__proto__":{}}}}')),/unsupported/);
for(const [type,values] of [['Uint8Array',[256]],['Int8Array',[1.5]],['Float32Array',[1e300]],['Float32Array',[1e-300]]]){const file={format:'codi-mesh-project/1',snapshot:{space:{},meta:{value:{$codiTypedArray:type,values}}}};assert.throws(()=>decodeMeshProject(new TextEncoder().encode(JSON.stringify(file))),/valid/);}
assert.throws(()=>encodeMeshProject({space:{},meta:{value:new Float32Array([Infinity])}}),/invalid typed/);
console.log('PASS Mesh project round trip and invalid project checks');
