// A closed 20 mm cube, encoded as binary STL (which carries no unit metadata).
export function exampleCube(side=20){
 if(!Number.isFinite(side)||side<=0)throw Error('Invalid example size.');
 const v=[[0,0,0],[side,0,0],[side,side,0],[0,side,0],[0,0,side],[side,0,side],[side,side,side],[0,side,side]];
 const faces=[[0,2,1],[0,3,2],[4,5,6],[4,6,7],[0,1,5],[0,5,4],[1,2,6],[1,6,5],[2,3,7],[2,7,6],[3,0,4],[3,4,7]];
 const bytes=new Uint8Array(84+faces.length*50),view=new DataView(bytes.buffer);
 view.setUint32(80,faces.length,true);
 faces.forEach((face,i)=>{let offset=84+i*50+12;for(const index of face)for(const n of v[index]){view.setFloat32(offset,n,true);offset+=4;}});
 return bytes;
}
