// Scénarios BCE de LFI (encadré « Les solutions BCE de LFI à l'épreuve du simulateur ») :
// 1) gel, annulation, traité révisé ; 2) désobéir de l'intérieur.
// Lecture centrale, 200 tirages. Usage : node tests/bce-scenarios.js
const {chromium}=require('playwright'); const path=require('path');
(async()=>{const br=await chromium.launch();const pg=await br.newPage();
await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await pg.goto('file://'+path.resolve(__dirname,'..','index.html'));
await pg.waitForFunction(()=>typeof MC!=='undefined'&&MC&&MC.pol,{timeout:120000});
console.log(await pg.evaluate(()=>{const yi=y=>y-START, p=CANDS.find(c=>c.id==='melenchon'), keep=JSON.parse(JSON.stringify(p)), B0=Object.assign({},BASE), m0=metric, out=[];
 const A=[['Programme tel que modélisé',{},{}],['La BCE accepte, le conflit coûte quand même',{bceOk:1},{}],['Gel selon LFI',{bceOk:1,eu:0,bceFull:1},{}],['Annulation selon LFI',{bceOk:1,eu:0,bceCancel:1},{}],['Annulation, vraie comptabilité',{bceOk:1,eu:0,bceCancel:1,bceCost:1},{}],['Annulation, vraie comptabilité, conflit',{bceOk:1,bceCancel:1,bceCost:1},{}],['Traité révisé par les 27',{bceOk:1,eu:0,ecbDirect:1},{}],['Escalade sur les capitaux',{bceOk:0,eu:1.4},{}],['Référence : ni gel ni conflit',{bce:0,bceOk:0,eu:0},{}]];
 const D=[['Désobéissance telle que modélisée',{},{}],['Jusqu\'au bout : refus du plan d\'aide',{},{exit:'refus'}],['Trop gros pour tomber (écart plafonné à 2,5 points)',{ecbProtect:2.5},{}],['Trop gros pour tomber (écart plafonné à 1,5 point)',{ecbProtect:1.5},{}],['Sanctions européennes (0,35 point de PIB par an, 2028-2031)',{sanction:0.35},{}],['Alliés : 40 % de la zone euro',{},{allies:40}],['Escalade sur les capitaux',{eu:1.4},{}],['Référence : sans conflit',{eu:0,bce:0,bceOk:0},{}]];
 const run=(lab,mod,bm,full)=>{ Object.assign(p,mod); Object.assign(BASE,B0,bm); const r={};
  metric='debt'; runMC(); r.cr=Math.round(100*MC.pol.rows.melenchon.cr); r.c46=Math.round(100*MC.rows.find(z=>z.p.id==='melenchon').cr); r.d36=MC.series.melenchon[yi(2036)][1].toFixed(0); r.d46=MC.series.melenchon[yi(2046)][1].toFixed(0);
  metric='pov'; runMC(); r.p40=MC.series.melenchon[yi(2040)][1].toFixed(1);
  let extra=''; if(full){ metric='tension'; runMC(); extra=' | dette 2046 '+r.d46+' | tension 2036 '+MC.series.melenchon[yi(2036)][1].toFixed(0); } else { metric='burden'; runMC(); extra=' | dette 2036 '+r.d36+' | intérêts/recettes 2032 '+MC.series.melenchon[yi(2032)][1].toFixed(1); }
  out.push(lab.padEnd(60)+' crise '+r.cr+' / '+r.c46+extra+' | pauvreté 2040 '+r.p40);
  for(const k of Object.keys(mod)){ if(k in keep) p[k]=keep[k]; else delete p[k]; } };
 out.push('== Gel, annulation, traité'); for(const [l,m,b] of A) run(l,m,b,false);
 out.push('\n== Désobéir de l\'intérieur'); for(const [l,m,b] of D) run(l,m,b,true);
 Object.assign(BASE,B0); metric='debt'; runMC(); out.push('\nTous les programmes (crise avant 2032 / d\'ici 2046) : '+CANDS.map(c=>c.id+' '+Math.round(100*MC.pol.rows[c.id].cr)+'/'+Math.round(100*MC.rows.find(z=>z.p.id===c.id).cr)).join(', '));
 metric=m0; runMC(); return out.join('\n');}));
await br.close();})();
