import assert from 'node:assert/strict';import {sameMeshGeometry} from '../apps/system/grid-tools/mesh-project.mjs';
const a={space:{group:['cube'],cube:{mesh:new Float32Array([0,1,2,3,4,5,6,7,8])}}};
const copy=()=>structuredClone(a);assert.equal(sameMeshGeometry(a,copy()),true);
let changed=copy();changed.space.cube.mesh[3]=9;assert.equal(sameMeshGeometry(a,changed),false,'changed vertex must be rejected even when object count matches');
changed=copy();changed.space.cube.mesh=new Float32Array([0,1,2]);assert.equal(sameMeshGeometry(a,changed),false);
changed=copy();changed.space.other=changed.space.cube;delete changed.space.cube;assert.equal(sameMeshGeometry(a,changed),false,'changed model ID is rejected');
changed=copy();delete changed.space.cube.mesh;assert.equal(sameMeshGeometry(a,changed),false);
console.log('PASS mesh geometry restore comparison');
