// Test du bloc « effets des mesures sur l'activité » sur la consolidation de 2010-2016.
// On rejoue les efforts budgétaires observés avec les multiplicateurs du modèle (MULT, multAt) et on compare à la croissance observée.
// Données (ordres de grandeur, à ±0,2 point) : croissance Insee (base 2020) ; mesures nouvelles de prélèvements et effort en dépense
// d'après la Cour des comptes, le Sénat (effort 2013 : 1,5 point en recettes) et Fipeco (+3,8 points de mesures nouvelles sur 2010-2014,
// 2016 : −0,2 en recettes, +0,4 en dépense). Écart de production de 2009 : −2,6 % (Commission européenne).
const M=require('../src/model.js');
const years=[2010,2011,2012,2013,2014,2015,2016];
const gObs=[2.0,2.2,0.3,0.6,1.0,1.1,1.1];
const tax=[0.1,0.9,1.1,1.4,0.3,-0.1,-0.2];   // hausses d'impôts (points de PIB, + = consolidation)
const spend=[0.3,0.3,0.1,0.1,0.4,0.5,0.4];  // effort en dépense
// Contexte hors budget, en option : demande des partenaires de la zone euro (croissance hors France, Eurostat, arrondie ;
// effet 0,15 point par point d'écart à 1,5 %, part des exportations vers la zone euro dans le PIB) et CICE (baisse d'impôt des entreprises, ≈ 0,7 pt de PIB en 2014-2016).
const gEA=[2.1,1.6,-0.8,-0.2,1.4,2.2,1.9];
const cice=[0,0,0,0,-0.4,-0.2,-0.1];
const TAXMIX={taxLarge:0.5,taxAis:0.25,entr:0.25}; // hausses 2011-2013 : CSG, TVA, IR, plus-values, impôt sur les sociétés
const gap09=-2.6, gpot=1.1;
function run(scale,withFiscal,ctx){
  const out=[]; let gap=gap09, Fprev=0;
  for(let i=0;i<years.length;i++){
    let F=0;
    for(let s=0;s<=i;s++){const h=i-s+1;
      for(const k in TAXMIX) F-=tax[s]*TAXMIX[k]*M.multAt(k,h)*scale;
      if(ctx) F-=cice[s]*M.multAt("entr",h)*scale;
      F-=spend[s]*M.multAt("fonct",h)*scale;}
    const gapN=0.5*gap; const g=gpot+(gapN-gap)+(withFiscal?F-Fprev:0)+(ctx?0.15*(gEA[i]-1.5):0); gap=gapN; Fprev=F; out.push(g);
  }
  return out;
}
const rmse=(a)=>Math.sqrt(a.reduce((s,v,i)=>s+(v-gObs[i])**2,0)/a.length);
const f=a=>a.map(v=>v.toFixed(1).padStart(5)).join("");
console.log("année      "+years.map(y=>String(y).padStart(5)).join(""));
console.log("observé    "+f(gObs));
const res={};
const sub=(a,i0,i1)=>Math.sqrt(a.slice(i0,i1).reduce((s,v,j)=>s+(v-gObs[i0+j])**2,0)/(i1-i0));
for(const ctx of [false,true]){
  console.log(ctx?"\navec le contexte (zone euro, CICE)":"\nsans le contexte");
  for(const [lab,sc,wf] of [["sans mesures",1,false],["libérale",0.7,true],["centrale",1,true],["keynésienne",1.25,true]]){
    const g=run(sc,wf,ctx); res[lab+ctx]=g; console.log(lab.padEnd(11)+f(g)+"   erreur 2010-2013 "+sub(g,0,4).toFixed(2)+"  2014-2016 "+sub(g,4,7).toFixed(2)+"  ensemble "+rmse(g).toFixed(2));
  }
}
const slow=(a)=>(a[0]+a[1])/2-(a[2]+a[3])/2;
console.log("\nralentissement 2010-2011 → 2012-2013 : observé "+slow(gObs).toFixed(2)+" pt ; dû aux mesures selon le modèle (centrale) "+(slow(run(1,true,true))-slow(run(1,false,true))).toFixed(2)+", au contexte européen "+(slow(run(1,false,true))-slow(run(1,false,false))).toFixed(2));
if(Object.values(res).some(a=>a.some(v=>!isFinite(v)))){console.error("valeur non finie");process.exit(1);}
