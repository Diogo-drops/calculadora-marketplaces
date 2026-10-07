import {execFileSync} from 'node:child_process';
try{
 const previous=process.env.VERCEL_GIT_PREVIOUS_SHA;
 if(!previous)process.exit(1);
 const files=execFileSync('git',['diff','--name-only',previous,'HEAD'],{encoding:'utf8'}).trim().split('\n');
 process.exit(files.length>0&&files.every(f=>f==='data/fees.json')?0:1);
}catch{process.exit(1);}
