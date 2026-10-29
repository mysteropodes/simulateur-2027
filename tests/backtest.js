// Test historique 2015-2025 des blocs du modèle (chômage, dette, intérêts), avec les données observées.
// Usage : node tests/backtest.js
// Les équations reprennent celles de src/model.js ; les entrées (croissance, déficit, inflation, taux) sont observées.
const D=require('./backtest-data.js');
const rmse=e=>Math.sqrt(e.reduce((a,x)=>a+x*x,0)/e.length);

// 1. Chômage : u += vitesse × (u* − u) − Okun × Δécart ; activité partielle en 2020-2021
function chomage(uStar,okun,speed,mute){
  let u=D.u[0],gap=0; const path=[],err=[];
  for(let k=1;k<D.years.length;k++){
    const gp=gap; gap=0.5*gap+(D.g[k]-1.0); let dg=gap-gp; if(D.years[k]===2020||D.years[k]===2021) dg*=mute;
    u=u+speed*(uStar-u)-okun*dg; path.push(u); err.push(u-D.u[k]);
  }
  return {path,err:rmse(err)};
}
const avant=chomage(7.6,0.5,0.25,1), apres=chomage(7.4,0.3,0.2,0.15);
console.log("Chômage (%)    observé | ancien réglage | nouveau réglage");
for(let k=1;k<D.years.length;k++) console.log(D.years[k], D.u[k].toFixed(1).padStart(9), avant.path[k-1].toFixed(1).padStart(14), apres.path[k-1].toFixed(1).padStart(16));
console.log("Erreur moyenne (points) : ancien", avant.err.toFixed(2), "| nouveau", apres.err.toFixed(2));

// 2. Dette : identité d = d₋₁ / (1 + croissance nominale) + déficit
console.log("\nDette (% du PIB)  observée | identité du modèle | écart");
const e2=[];
for(let k=1;k<D.years.length;k++){
  const ng=D.gdpMd[k]/D.gdpMd[k-1]-1, pred=D.debt[k-1]/(1+ng)+D.def[k]; e2.push(D.debt[k]-pred);
  console.log(D.years[k], D.debt[k].toFixed(1).padStart(10), pred.toFixed(1).padStart(18), (D.debt[k]-pred).toFixed(1).padStart(7));
}
console.log("Écart moyen hors 2020 (points) :", rmse(e2.filter((_,i)=>D.years[i+1]!==2020)).toFixed(2));

// 3. Intérêts : part fixe renouvelée par huitièmes au taux de marché, ~10 % indexés sur l'inflation
if(D.oat){
  const app=k=>D.intMd[k]/(D.debt[k-1]/100*D.gdpMd[k-1])*100;
  for(const [lab,share] of [["sans titres indexés",0],["avec 10 % indexés",0.1]]){
    let k0=2, ieff=(app(k0)-share*(0.5+D.cpi[k0]))/(1-share); const err=[],path=[];
    for(let k=k0+1;k<D.years.length;k++){ ieff+=(D.oat[k]-ieff)/8; const i=(1-share)*ieff+share*(0.5+D.cpi[k]); path.push(i); err.push(i-app(k)); }
    console.log("\nTaux apparent (%), "+lab+" : erreur moyenne", rmse(err).toFixed(2));
    for(let k=k0+1;k<D.years.length;k++) console.log(D.years[k], app(k).toFixed(2).padStart(8), path[k-k0-1].toFixed(2).padStart(8));
  }
}
