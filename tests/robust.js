// Conclusions solides (« Ce qu'il faut retenir ») : part des tirages où chaque conclusion reste vraie.
// 400 tirages, mêmes tirages que le site (makeDraws) : 200 en lecture centrale, 100 keynésienne, 100 libérale.
// Programmes des six candidats réels, chiffrage crédible. Usage : node tests/robust.js
const {chromium}=require('playwright'); const path=require('path');
(async()=>{const br=await chromium.launch();const pg=await br.newPage();
await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await pg.goto('file://'+path.resolve(__dirname,'..','index.html'));
await pg.waitForFunction(()=>typeof MC!=='undefined'&&MC&&MC.pol,{timeout:120000});
const out=await pg.evaluate(()=>{const yi=y=>y-START, md0=mode; mode='credible';
 const ids=CANDS.filter(p=>p.id!=='statu'&&!p.fictif&&!p.gov).map(p=>p.id);
 const all=[];
 for(const [pk,k] of [['central',200],['keynes',100],['liberal',100]]) all.push(...makeDraws(Object.assign({},BASE0,PRESETS[pk],{noCrisis:0})).slice(0,k));
 const N=all.length, cnt={povMin:{},povMax:{},tens32:{},debtNC46:{},debtNC36:{},first:{}}; let any=0,every=0,nCr=0;
 for(const d of all){const res={};
  for(const id of ids){const p=CANDS.find(c=>c.id===id); const r=simDraw(p,d), rn=simDraw(p,Object.assign({},d,{b:Object.assign({},d.b,{noCrisis:1})}));
   res[id]={pov:r.pov[yi(2032)],cr:r.crisis??2047,ten:r.tension[yi(2032)],d46:rn.debt[yi(2046)],d36:rn.debt[yi(2036)]};}
  const am=(f,min)=>ids.reduce((a,i)=>(min?f(res[i])<f(res[a]):f(res[i])>f(res[a]))?i:a,ids[0]), inc=(o,k)=>o[k]=(o[k]||0)+1;
  inc(cnt.povMin,am(x=>x.pov,1)); inc(cnt.povMax,am(x=>x.pov,0)); inc(cnt.tens32,am(x=>x.ten,0)); inc(cnt.debtNC46,am(x=>x.d46,1)); inc(cnt.debtNC36,am(x=>x.d36,1));
  const c=ids.filter(i=>res[i].cr<2047); if(c.length){any++; nCr++; inc(cnt.first,am(x=>x.cr,1));} if(c.length===ids.length) every++;}
 if(typeof setSocialKey==='function') setSocialKey(0.2); mode=md0;
 const f=(o,n)=>Object.entries(o).sort((a,b)=>b[1]-a[1]).map(([k,v])=>k+' '+Math.round(100*v/n)+' %').join(', ');
 return [`tirages ${N}`,`pauvreté 2032 la plus basse : ${f(cnt.povMin,N)}`,`pauvreté 2032 la plus haute : ${f(cnt.povMax,N)}`,`tension 2032 la plus forte : ${f(cnt.tens32,N)}`,
  `dette 2046 hors crise la plus basse : ${f(cnt.debtNC46,N)}`,`dette 2036 hors crise la plus basse : ${f(cnt.debtNC36,N)}`,
  `au moins un programme en crise d'ici 2046 : ${Math.round(100*any/N)} % ; tous : ${Math.round(100*every/N)} %`,`premier touché, quand une crise survient : ${f(cnt.first,nCr)}`].join('\n');});
console.log(out); await br.close();})();
