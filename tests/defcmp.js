// Défaut rapide ou austérité étalée (atlas, section 11) : six scénarios, 200 tirages par lecture, valeurs médianes.
// Usage : node tests/defcmp.js
const {chromium}=require('playwright'); const path=require('path');
(async()=>{const br=await chromium.launch();const pg=await br.newPage();
await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await pg.goto('file://'+path.resolve(__dirname,'..','index.html'));
await pg.waitForFunction(()=>typeof MC!=='undefined'&&MC&&MC.pol,{timeout:120000});
for(const rd of ['central','keynes','liberal']){
  const t=await pg.evaluate(async rd=>{defRd=rd; defCmpCalc(); await new Promise(r=>{const w=()=>document.querySelector('#defCmp tbody').innerText.includes('Calcul en cours')?setTimeout(w,200):r(); setTimeout(w,100);});
    return [...document.querySelectorAll('#defCmp tbody tr')].map(r=>[...r.cells].map(c=>c.innerText).join(' | ')).join('\n');},rd);
  console.log('== '+rd+'\n'+t);}
await br.close();})();
