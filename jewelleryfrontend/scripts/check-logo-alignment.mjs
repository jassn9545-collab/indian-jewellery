import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
mkdirSync('artifacts',{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({reducedMotion:'reduce'});
for(const width of [320,390,768,1024,1120,1280,1440]){
 await page.setViewportSize({width,height:900});
 await page.goto('http://localhost:3000',{waitUntil:'networkidle'});
 console.log(width,await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,logoCenter:(()=>{const r=document.querySelector('.sf-logo').getBoundingClientRect();return r.x+r.width/2-innerWidth/2})(),headerChildren:[...document.querySelector('.sf-nav-inner').children].filter(e=>e.getBoundingClientRect().width).map(e=>({name:e.className,x:e.getBoundingClientRect().x,right:e.getBoundingClientRect().right}))})));
 if([320,1440].includes(width)) await page.screenshot({path:`artifacts/logo-alignment-${width}.png`,fullPage:true});
}
await browser.close();
