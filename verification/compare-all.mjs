import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const root='verification/all-pages';await fs.mkdir(root,{recursive:true});
const manifest=JSON.parse(await fs.readFile('source-snapshot/manifest.json','utf8'));
const pages=manifest.pages;
const only = process.env.EXA_COMPARE_ONLY;
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const results=[];let next=0;
async function inspect(context,source,route,id){
 const page=await context.newPage(); const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try {
 const response=await page.goto(source,{waitUntil:'domcontentloaded',timeout:30000});
 await page.waitForSelector('h1',{timeout:15000});
 await page.evaluate(()=>Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,5000))]));
 await page.waitForTimeout(650);
 const data=await page.evaluate(()=>{
 const rect=e=>{if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}};
 return {url:location.href,title:document.title,h1:document.querySelector('h1')?.innerText,geometry:Object.fromEntries(['#navbar','#sidebar-content','#header','#header h1','#content-area','#table-of-contents'].map(s=>[s,rect(document.querySelector(s))])),brokenImages:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).filter(i=>i.getBoundingClientRect().top<innerHeight).map(i=>i.src),bodyText:document.querySelector('#content')?.innerText||document.querySelector('article')?.innerText||'',scrollHeight:document.documentElement.scrollHeight};
 });
 data.status=response.status();data.errors=errors;
 await page.screenshot({path:`${root}/${id}-${route}.png`});
 return data;
 }catch(e){return {failure:e.message,errors}}finally{await page.close()}
}
async function worker(){const context=await browser.newContext({viewport:{width:1512,height:982},colorScheme:'light',deviceScaleFactor:1});while(next<pages.length){const i=next++,p=pages[i],id=String(i).padStart(3,'0');if (only && !only.split(',').some(value => p.source.endsWith(value))) continue;const path=new URL(p.source).pathname.replace(/\/docs\/index$/, '/docs');const prod=process.env.EXA_COMPARE_LOCAL ? JSON.parse(await fs.readFile(`${root}/${id}.json`, 'utf8')).production : await inspect(context,'https://exa.ai'+path,'production',id);const local=await inspect(context,'http://localhost:3000'+path,'local',id);const deltas={};for(const k of Object.keys(prod.geometry||{})){const a=prod.geometry[k],b=local.geometry?.[k];if(!a||!b){if(!!a!==!!b)deltas[k]={production:a,local:b};continue;}for(const t of ['x','y','width','height']){if(k==='#content-area'&&t==='height')continue;if(Math.abs(a[t]-b[t])>1)deltas[k+' '+t]=Number((b[t]-a[t]).toFixed(2));}}
 const result={id,path,production:prod,local,deltas};results.push(result);await fs.writeFile(`${root}/${id}.json`,JSON.stringify(result,null,2));console.log(`${results.length}/${pages.length} ${path} deltas=${Object.keys(deltas).length} errors=${local.errors?.length||0} broken=${local.brokenImages?.length||0}${prod.failure||local.failure?' FAILURE':''}`);
 }await context.close();}
await Promise.all([worker(),worker(),worker()]);results.sort((a,b)=>a.id.localeCompare(b.id));if (!only) await fs.writeFile(`${root}/summary.json`,JSON.stringify({count:results.length,results},null,2));await browser.close();
