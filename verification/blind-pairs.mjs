import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const dir='verification/blind';await fs.mkdir(dir,{recursive:true});
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const key=[];
for(const [i,name] of ['home-desktop','home-mobile','search-quickstart-desktop','search-quickstart-mobile'].entries()){
 const variants=crypto.randomInt(2)?['final','production-fast']:['production-fast','final'];
 const files=await Promise.all(variants.map(v=>fs.readFile(`verification/screenshots/${v}-${name}.png`)));
 const mobile=name.endsWith('mobile'), width=mobile?390:1512,height=mobile?844:982;
 const page=await browser.newPage({viewport:{width:width*2+30,height:height+50}});
 await page.setContent(`<style>*{box-sizing:border-box}body{margin:0;background:#e5e7eb;font:16px system-ui}main{display:flex;gap:10px;padding:10px}section{width:${width}px}h2{height:30px;margin:0;font-size:16px;text-align:center}img{display:block;width:100%}</style><main>${files.map((f,j)=>`<section><h2>${j?'B':'A'}</h2><img src="data:image/png;base64,${f.toString('base64')}"></section>`).join('')}</main>`);
 await page.screenshot({path:`${dir}/pair-${i+1}.png`});await page.close();key.push({pair:i+1,page:name,A:variants[0],B:variants[1]});
}
await fs.writeFile('/tmp/exa-blind-key.json',JSON.stringify(key,null,2));await browser.close();
