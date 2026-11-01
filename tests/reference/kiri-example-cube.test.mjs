import assert from 'node:assert/strict';
import {exampleCube} from '../apps/system/grid-tools/example-cube.mjs';
for(const unitScale of [1,25.4]){
 const bytes=exampleCube(20/unitScale),view=new DataView(bytes.buffer),count=view.getUint32(80,true),edges=new Map(),points=[];assert.equal(count,12);assert.equal(bytes.length,84+50*count);
 for(let i=0;i<count;i++){const vertices=[];for(let j=0;j<3;j++){const v=[];for(let k=0;k<3;k++)v.push(view.getFloat32(84+i*50+12+12*j+4*k,true)*unitScale);vertices.push(v);points.push(v)}for(let j=0;j<3;j++){const pair=[vertices[j].join(','),vertices[(j+1)%3].join(',')].sort().join('|');edges.set(pair,(edges.get(pair)||0)+1)}}
 assert.ok([...edges.values()].every(n=>n===2),'each triangle edge must be shared');for(let k=0;k<3;k++){const values=points.map(p=>p[k]);assert.ok(Math.abs(Math.max(...values)-Math.min(...values)-20)<0.0001)}
}
assert.throws(()=>exampleCube(0));console.log('PASS example cube is closed and 20 mm for metric and CAM inch conversion');
