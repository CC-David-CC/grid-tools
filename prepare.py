#!/usr/bin/env python3
"""Build the pinned Grid.Space applications into ignored local dependencies."""
import os,pathlib,subprocess,tempfile
HERE=pathlib.Path(__file__).resolve().parent
COMMIT='d138275bbe9d4e4030d8cb8b2dcf66607da9295a'
node=HERE/'node_modules'
if not (node/'esbuild').is_dir():raise SystemExit('Run npm ci --ignore-scripts in apps/system/grid-tools first.')
env=os.environ.copy();env['PATH']=str(node/'.bin')+os.pathsep+env.get('PATH','')
def run(args,cwd):subprocess.run(args,cwd=cwd,env=env,check=True)
with tempfile.TemporaryDirectory(prefix='codi-grid-source-') as temporary:
 src=pathlib.Path(temporary)/'source';src.mkdir();run(['git','init','-q'],src);run(['git','remote','add','origin','https://github.com/GridSpace/grid-apps.git'],src);run(['git','fetch','-q','--depth','1','origin',COMMIT],src);run(['git','checkout','-q','--detach','FETCH_HEAD'],src)
 actual=subprocess.check_output(['git','rev-parse','HEAD'],cwd=src,text=True).strip()
 if actual!=COMMIT:raise RuntimeError('Grid.Space revision mismatch')
 (src/'node_modules').symlink_to(node,target_is_directory=True)
 for config in ['webpack-three-esm.js','webpack-jszip-esm.js','webpack-quickjs-esm.js']:run(['webpack','--config','bin/'+config],src)
 api=src/'src/kiri/app/api.js';data=api.read_text();before='frame: true, // receive frame events';assert data.count(before)==1;api.write_text(data.replace(before,'frame: false, // desktop uses its own same-origin bridge'))
 build=src/'bin/esbuild.config.mjs';data=build.read_text().replace('        generateDevices();','        await generateDevices();');a=data.index('        // Bundle void main app');b=data.index('        // Bundle mesh main app',a);data=data[:a]+data[b:];data=data.replace('        appendExtraModules(', '        await appendExtraModules(');build.write_text(data)
 run(['node','bin/esbuild.config.mjs'],src);run(['python3',str(HERE/'stage.py'),str(src)],src)
print('Prepared Grid.Space',COMMIT)
