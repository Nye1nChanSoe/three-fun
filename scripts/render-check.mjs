import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
const server=spawn('npm',['run','dev','--','--port','4173'],{stdio:'ignore'});
await new Promise(r=>setTimeout(r,1800)); await mkdir('screenshots',{recursive:true});
const browser=await chromium.launch({headless:true});
for(const [name,viewport] of Object.entries({desktop:{width:1280,height:800},mobile:{width:390,height:844}})){
 const page=await browser.newPage({viewport}); await page.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'}); await page.waitForTimeout(1200);
 const sample=await page.locator('#world').evaluate(c=>{const x=c.getContext('webgl2')||c.getContext('webgl'),p=new Uint8Array(4);let total=0,bright=0;for(let iy=1;iy<6;iy++)for(let ix=1;ix<6;ix++){x.readPixels((c.width*ix/6)|0,(c.height*iy/6)|0,1,1,x.RGBA,x.UNSIGNED_BYTE,p);total+=p[0]+p[1]+p[2];if(p[0]+p[1]+p[2]>12)bright++}return [total,bright]});
 if(sample[1]<4) throw new Error(`${name}: blank WebGL canvas`);
 await page.screenshot({path:`screenshots/${name}.png`}); console.log(`${name}: webgl pixel ${sample.join(',')}`); await page.close();
} await browser.close(); server.kill();
