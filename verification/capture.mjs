import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
const require = createRequire(import.meta.url);
const {chromium} = require('playwright');
const browser = await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless:true, args:['--no-sandbox']});
const base = process.argv[2] || 'https://exa.ai/docs';
const prefix = process.argv[3] || 'production';
const paths = process.argv.slice(4).length ? process.argv.slice(4) : ['', 'search/quickstart'];
for(const path of paths) for(const [name, width, height] of [['desktop',1512,982],['mobile',390,844]]) {
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,colorScheme:'light'});
 const page=await context.newPage(); console.log('Capturing',prefix,path,name);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`${base.replace(/\/$/,'')}${path ? '/' + path : ''}`,{waitUntil:'domcontentloaded',timeout:60000}).catch(async e=>{console.log(e.message);await page.waitForTimeout(5000)});
 await page.evaluate(async()=>{await Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,12000))]);});
 await page.waitForTimeout(1500);
 const file=`verification/screenshots/${prefix}-${path.replaceAll('/','-')||'home'}-${name}`;
 await page.screenshot({path:`${file}.png`,fullPage:false});
 await fs.writeFile(`${file}.json`,JSON.stringify(await page.evaluate(()=>({url:location.href, title:document.title, customScripts:[...document.scripts].map(s=>s.src).filter(x=>x && !x.includes('_next')),geometry:Object.fromEntries(['#navbar','#sidebar','#header','#content-area','#table-of-contents','.docs-home'].map(s=>{const e=document.querySelector(s),r=e?.getBoundingClientRect();return [s,e?{x:r.x,y:r.y,width:r.width,height:r.height,font:getComputedStyle(e).fontFamily}:null]}))})),null,2));
 console.log(file,errors);await context.close();
}
await browser.close();
