// Indice de qualité de vie : bornes, référence 2025, effet des poids. Usage : node tests/qdv.js
const {chromium}=require('playwright'); const path=require('path');
(async()=>{const br=await chromium.launch();const pg=await br.newPage(); const errs=[]; pg.on('pageerror',e=>errs.push(e.message));
await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await pg.goto('file://'+path.resolve(__dirname,'..','index.html'));
await pg.waitForFunction(()=>typeof MC!=='undefined'&&MC&&MC.pol,{timeout:120000});
const r=await pg.evaluate(()=>{const msg=[]; let fail=0; const yi=y=>y-START;
 for(const c of CANDS){const s=simulate(c,'credible',BASE);
  if(Math.abs(s.qdv[0]-5)>1e-9){fail++;msg.push('ÉCHEC '+c.id+' : 2025 ≠ 5');}
  if(s.qdv.some(v=>!(v>=0&&v<=10))){fail++;msg.push('ÉCHEC '+c.id+' : hors bornes');}
  for(const k in s.qdvDim) if(s.qdvDim[k].length!==s.qdv.length){fail++;msg.push('ÉCHEC '+c.id+' '+k+' : longueur');}
  const only=simulate(c,'credible',Object.assign({},BASE,{qdvW:Object.fromEntries(Object.keys(QDV_W0).map(k=>[k,k==='pov'?1:0]))}));
  if(Math.abs(only.qdv[yi(2032)]-s.qdvDim.pov[yi(2032)])>1e-9){fail++;msg.push('ÉCHEC '+c.id+' : poids non appliqués');}
  const zero=simulate(c,'credible',Object.assign({},BASE,{qdvW:Object.fromEntries(Object.keys(QDV_W0).map(k=>[k,0]))}));
  if(zero.qdv.some(v=>v!==5)){fail++;msg.push('ÉCHEC '+c.id+' : poids nuls');}}
 document.querySelector('[data-go="menages"]')?.click(); render(true);
 const rows=document.querySelectorAll('#tblqdv tbody tr').length, sl=document.querySelectorAll('#qdvW input').length;
 if(rows!==CANDS.length){fail++;msg.push('ÉCHEC tableau : '+rows+' lignes');} if(sl!==10){fail++;msg.push('ÉCHEC curseurs : '+sl);}
 const inp=document.querySelector('#qdvW input[data-qdv="demo"]'); const before=LASTRES.find(x=>x.p.id==='melenchon').r.qdv[yi(2032)]; inp.value=3; inp.oninput(); const after=LASTRES.find(x=>x.p.id==='melenchon').r.qdv[yi(2032)];
 if(!(after<before)){fail++;msg.push('ÉCHEC curseur démocratie sans effet');} document.getElementById('qdvReset').click();
 return {fail,msg};});
r.msg.forEach(m=>console.log(m)); if(errs.length){console.log('Erreurs page :',errs);r.fail++;}
console.log(r.fail?'qdv : '+r.fail+' échec(s)':'qdv : tout est bon'); await br.close(); process.exit(r.fail?1:0);})();
