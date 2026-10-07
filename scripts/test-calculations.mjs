import {spawnSync} from 'node:child_process';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const dir=mkdtempSync(join(tmpdir(),'marketcalc-tests-'));
try{const compilation=spawnSync(process.execPath,['node_modules/typescript/bin/tsc','src/tests/calculations.test.ts','--outDir',dir,'--module','commonjs','--target','es2022','--esModuleInterop','--skipLibCheck'],{stdio:'inherit'});if(compilation.status!==0)process.exitCode=compilation.status||1;else process.exitCode=spawnSync(process.execPath,['--test',join(dir,'tests/calculations.test.js')],{stdio:'inherit'}).status||0;}finally{rmSync(dir,{recursive:true,force:true});}
