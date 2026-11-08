// Audit du coût des programmes complets : effet de la lecture « Programme complet (audit) » sur chaque candidat
// (dette, crise, pauvreté), comparée au chiffrage crédible. Lecture centrale, 200 tirages. Usage : node tests/audit.js
const {chromium}=require('playwright'); const path=require('path');
(async()=>{const br=await chromium.launch();const pg=await br.newPage();
await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await pg.goto('file://'+path.resolve(__dirname,'..','index.html'));
await pg.waitForFunction(()=>typeof MC!=='undefined'&&MC&&MC.pol,{timeout:120000});
const res=await pg.evaluate(()=>{const yi=y=>y-START, m0=metric, md0=mode, out={}; let fail=0, msg=[];
 const ids=CANDS.map(c=>c.id).filter(i=>i!=='statu'&&i!=='gov');
 // 1) déterministe : la lecture audit ne change que les candidats audités, dans le bon sens
 const B=Object.assign({},BASE,{noCrisis:1});
 for(const c of CANDS){ const a=simulate(c,'credible',B), u=simulate(c,'audit',B); const n=auditNet(c.id,1);
   const dd=u.debt[yi(2032)]-a.debt[yi(2032)];
   if(!AUDIT[c.id]&&Math.abs(dd)>1e-9){fail++;msg.push('ÉCHEC '+c.id+' : change sans audit');}
   if(AUDIT[c.id]&&n>0&&!(dd>0)){fail++;msg.push('ÉCHEC '+c.id+' : dette 2032 ne monte pas');}
   if(u.debt.some(x=>!isFinite(x))){fail++;msg.push('ÉCHEC '+c.id+' : valeur non finie');}
   out[c.id]={net:n, dd32:dd}; }
 // 2) Monte-Carlo : crise et dette médiane, chiffrage crédible puis programme complet
 for(const m of ['credible','audit']){ mode=m; metric='debt'; runMC();
   for(const id of ids){ const o=out[id]; o[m]={cr:Math.round(100*MC.pol.rows[id].cr), c46:Math.round(100*MC.rows.find(z=>z.p.id===id).cr), d32:MC.series[id][yi(2032)][1], d36:MC.series[id][yi(2036)][1]}; }
   metric='pov'; runMC(); for(const id of ids) out[id][m].p32=MC.series[id][yi(2032)][1]; }
 mode=md0; metric=m0; runMC();
 return {out,fail,msg};});
const f=(x,d=0)=>x.toFixed(d).replace('.',',');
console.log('Candidat'.padEnd(12)+'audit net'.padStart(10)+' | crédible : crise 2032/2046, dette 2032, 2036, pauvreté 2032 | programme complet : idem');
for(const [id,o] of Object.entries(res.out)){ if(!o.credible) continue;
 const s=r=>`${r.cr} / ${r.c46} %, ${f(r.d32)} %, ${f(r.d36)} %, ${f(r.p32,1)} %`;
 console.log(id.padEnd(12)+(f(o.net,1)+' Md€').padStart(10)+' | '+s(o.credible).padEnd(34)+' | '+s(o.audit)); }
res.msg.forEach(m=>console.log(m)); console.log(res.fail?res.fail+' échec(s)':'contrôles : tout est bon');
await br.close(); process.exit(res.fail?1:0);})();
