// Test de non-régression : vérifie que les chiffres publiés dans la page et le README restent vrais,
// et que les règles de la méthode sont respectées (mêmes règles pour tous, monotonie, pas de valeur absurde).
// Usage : node tests/regression.js (nécessite playwright et index.html construit)
const {chromium}=require('playwright');
const path=require('path');
(async()=>{
  const br=await chromium.launch(); const pg=await br.newPage();
  await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
  await pg.goto('file://'+path.resolve(__dirname,'../index.html'));
  const out=await pg.evaluate(()=>{
    const B=o=>Object.assign({},BASE0,PRESETS.central,o||{});
    const sim=(id,o,mode)=>simulate(CANDS0.find(p=>p.id===id),mode||"credible",B(o));
    const sq=sim("statu"), ids=CANDS0.filter(p=>!p.fictif).map(p=>p.id), r={};
    for(const id of ids) r[id]=sim(id);
    const y=t=>t-2025, checks=[];
    const near=(lab,v,lo,hi)=>checks.push([lab,v,v>=lo&&v<=hi,lo+" à "+hi]);
    const ok=(lab,c)=>checks.push([lab,"",!!c,"vrai"]);
    // repères du statu quo (calage)
    near("Dette 2030 statu quo (comité d'experts ≈ 130)",sq.debt[y(2030)],126,135);
    near("Dette 2036 statu quo (stabilité du calage ; Commission 144-156 aux taux de 2024, plus hauts depuis)",sq.debt[y(2036)],156,168);
    near("OAT 10 ans 2027",BASE0.mktReal+sq.infl[y(2027)]+sq.spread[y(2027)],4.6,5.4);
    near("Croissance 2026-2028 (Banque de France 0,4/0,9/1,2)",(sq.growth[1]+sq.growth[2]+sq.growth[3])/3,0.7,1.0);
    // efforts retenus publiés (README et Méthode)
    const eff={melenchon:-2.3,lepen:0.3,philippe:-0.3,glucksmann:-1.9,retailleau:-0.1,attal:-0.9};
    for(const id in eff) near("Effort retenu "+id,r[id].progFull,eff[id]-0.1,eff[id]+0.1);
    // conclusions robustes (analyse de sensibilité)
    const pov=ids.filter(i=>i!=="statu").map(i=>[i,r[i].pov[y(2032)]]).sort((a,b)=>a[1]-b[1]);
    ok("Pauvreté 2032 la plus basse : Mélenchon",pov[0][0]==="melenchon");
    ok("Pauvreté 2032 la plus haute : Retailleau",pov[pov.length-1][0]==="retailleau");
    const cr=ids.filter(i=>i!=="statu").map(i=>[i,r[i].crisis||2047]).sort((a,b)=>b[1]-a[1]);
    ok("Crise la plus tardive : Philippe",cr[0][0]==="philippe");
    // règles de méthode
    for(const id of ids) ok("Valeurs finies "+id,["debt","def","unemp","growth","pov","tension"].every(k=>r[id][k].slice(1).every(Number.isFinite)));
    const pc=c=>simulate(Object.assign({},CANDS0.find(p=>p.id==="glucksmann"),{c}),"credible",B()).debt[y(2036)];
    ok("Moins de crédibilité ne réduit jamais la dette (Glucksmann)",pc(0.3)>=pc(0.6)-0.01&&pc(0.6)>=pc(1)-0.01);
    const pl=c=>simulate(Object.assign({},CANDS0.find(p=>p.id==="retailleau"),{c}),"credible",B()).debt[y(2036)];
    ok("Moins de crédibilité ne réduit jamais la dette (Retailleau)",pl(0.3)>=pl(0.6)-0.01&&pl(0.6)>=pl(1)-0.01);
    const lk=l=>simulate(CANDS0.find(p=>p.id==="melenchon"),"credible",B({leak:l})).debt[y(2032)];
    ok("Plus de recettes perdues augmente la dette (Mélenchon)",lk(0.6)>lk(0.2));
    const lr=l=>simulate(CANDS0.find(p=>p.id==="retailleau"),"credible",B({leak:l})).debt[y(2032)];
    // candidat fictif : règles de construction (solde annoncé >= 0, pas de crise avant le statu quo, pauvreté sous le statu quo, tension < 61)
    const ia=CANDS0.find(p=>p.id==="ia"); if(ia){const ri=simulate(ia,"credible",B()); ok("Candidat IA : solde annoncé >= 0",ia.A>=0); ok("Candidat IA : pas de crise avant le statu quo",(ri.crisis||2047)>=(sq.crisis||2047)); ok("Candidat IA : pauvreté 2032 sous le statu quo",ri.pov[y(2032)]<sq.pov[y(2032)]); near("Candidat IA : tension maximale",Math.max(...ri.tension),0,61);}
    ok("Les recettes perdues n'améliorent pas Retailleau",lr(0.9)>=lr(0.1)-0.05);
    // réaction extérieure (marchés, exil fiscal, concurrence) : sans effet sur le statu quo, défavorable à un programme qui empile les impôts sur le capital et relève le coût du travail
    const ex=(id,v)=>simulate(CANDS0.find(p=>p.id===id),"credible",B({extScale:v}));
    ok("Réaction extérieure : statu quo inchangé",Math.abs(ex("statu",0).debt[y(2036)]-ex("statu",1.6).debt[y(2036)])<0.05);
    ok("Réaction extérieure : dette 2036 de Mélenchon plus haute à ×1,6 qu'à ×0",ex("melenchon",1.6).debt[y(2036)]>ex("melenchon",0).debt[y(2036)]-0.01||(ex("melenchon",1.6).crisis||2047)<(ex("melenchon",0).crisis||2047));
    ok("Réaction extérieure : croissance 2027-2032 de Mélenchon plus basse à ×1,6 qu'à ×0",ex("melenchon",1.6).growth.slice(2,8).reduce((a,v)=>a+v,0)<ex("melenchon",0).growth.slice(2,8).reduce((a,v)=>a+v,0));
    // nationalisation : la dette monte l'année de l'achat, les dividendes réduisent ensuite le déficit primaire
    { const st=CANDS0.find(p=>p.id==="statu"), n0=simulate(st,"credible",B()), n1=simulate(Object.assign({},st,{natio:70}),"credible",B());
      ok("Nationalisation : dette 2028 plus haute",n1.debt[y(2028)]>n0.debt[y(2028)]+1.5); ok("Nationalisation : dividendes à partir de 2029",n1.natDiv[y(2029)]>0&&n1.natDiv[y(2028)]===0); ok("Nationalisation : déficit primaire 2032 plus bas",n1.prim[y(2032)]<n0.prim[y(2032)]); }
    const ic=x=>sim("statu",{infl:x,crisisPrem:1e9}).debt[y(2032)];
    ok("Plus d'inflation baisse le ratio de dette 2032 (sans crise)",ic(2.5)<ic(1.5));
    // une crise fait d'abord monter la dette (Portugal, Espagne, Irlande, Grèce)
    const L=sim("statu",{},"credible"), Lc=simulate(CANDS0[0],"credible",B(Object.assign({},PRESETS.liberal))), Ln=simulate(CANDS0[0],"credible",B(Object.assign({},PRESETS.liberal,{crisisPrem:1e9})));
    if(Lc.crisis){const k=Lc.crisis-2025+2; ok("Deux ans après une crise, la dette dépasse la trajectoire sans crise",Lc.debt[k]>Ln.debt[k]);}
    return checks;
  });
  await br.close();
  let fail=0;
  for(const [lab,v,pass,exp] of out){ if(!pass) fail++; console.log((pass?"ok    ":"ÉCHEC ")+lab+(v!==""?" : "+(+v).toFixed(2):"")+" (attendu : "+exp+")"); }
  if(fail){console.error(fail+" contrôle(s) en échec");process.exit(1);} else console.log("Tous les contrôles passent ("+out.length+")");
})();
