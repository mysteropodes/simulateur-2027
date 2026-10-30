// --- Test sur les mandats passés : le simulateur rejoue les programmes des trois derniers élus avec les mêmes règles qu'en 2027,
// en partant de la situation de l'année précédant l'élection, et on compare à ce qui s'est passé.
// L'année d'élection devient « 2026 » pour le modèle, le premier budget du mandat « 2027 ». Les modules propres à 2027
// (défense de la loi de programmation, OTAN, vieillissement après 2030, prime d'instabilité actuelle, IA, climat, conjoncture 2026-2029) sont neutralisés.
// Deux lectures : « à l'aveugle » (ce qu'on savait le jour de l'élection) et « avec le contexte réel » (chocs survenus pendant le mandat, imposés au modèle).
const RETRO=__RETRO_DATA__;
function retroRun(E,ctx,mode){
  const off=2026-E.year;
  const b=Object.assign({},BASE0,PRESETS.central,{calib:0,demog:0,lpm:0,natoGap:0,ageCost:0,pensDef:0,climCost:0,premPol:0,clim:"aucun",ai:"aucune",energy:"tendance",shock:"none",shock2:"none",bceDraw:1},E.base);
  if(ctx){const ext={}; for(const k in E.ext){ext[k]={}; for(const y in E.ext[k]) ext[k][+y+off]=E.ext[k][y];} b.ext=ext;
    E.shocks.forEach(([ty,y],i)=>{ if(i===0){b.shock=ty;b.shockYear=y+off;} else {b.shock2=ty;b.shockYear2=y+off;} });}
  const zero={mod:0,moy:0,ais:0,top:0,ret:0,jeu:0};
  const p=Object.assign({id:"retro",nato:0,famMd:0,migDelta:0,ageShift:0,rtt:0,housing:0,spServ:0,taxMd:0,zan:0,defense:0,A:0,c:1,parl:0.6,adh:0.5,legal:0.8,supply:0,longRun:0,eu:0,bce:0,bceOk:0,inflImp:0,uStruct:0,topTax:0,botGain:0,climInv:0.2,healthSpend:0,aiCushion:0.2,aiAdopt:1,co2Rate:1.5,pensBal:0,retLiv:0,pa:zero,paDec:Array(10).fill(0),rightsPts:0},E.prog);
  const r=simulate(p,mode||"credible",b);
  const yr=i=>E.year-1+i; // indice 0 : année précédant l'élection
  return {r,yr,p};
}
function buildRetro(){
  const el=document.getElementById("retroBody"); if(!el||el.dataset.done) return; el.dataset.done="1";
  const f1=v=>v==null||!isFinite(v)?"–":fmt(v,1);
  let html="";
  for(const E of RETRO){
    const A=retroRun(E,false,"credible"), C=retroRun(E,true,"credible"), N=retroRun(E,false,"annonce");
    const last=Math.min(E.year+5,E.obsLast), yrs=[]; for(let y=E.year+1;y<=last;y++) yrs.push(y);
    const at=(R,k,y)=>R.r[k][y-E.year+1];
    const avg=(R,k)=>yrs.reduce((s,y)=>s+at(R,k,y),0)/yrs.length, oAvg=k=>yrs.reduce((s,y)=>s+E.obs[k][y],0)/yrs.length;
    const rows=[["Dette publique fin "+last+" (% du PIB)",R=>at(R,"debt",last),E.obs.debt[last]],
      ["Déficit public "+last+" (% du PIB)",R=>at(R,"def",last),E.obs.def[last]],
      ["Croissance moyenne "+yrs[0]+"-"+last+" (%)",R=>avg(R,"growth"),oAvg("g")],
      ["Chômage "+last+" (%)",R=>at(R,"unemp",last),E.obs.u[last]],
      ["Inflation moyenne "+yrs[0]+"-"+last+" (%)",R=>avg(R,"infl"),oAvg("pi")]];
    const err=(v,o)=>{const d=v-o;return `<span class="rng">${d>=0?"+":"−"}${fmt(Math.abs(d),1)}</span>`;};
    html+=`<article class="retro"><h3>${E.title}</h3><p class="help">${E.intro}</p>
    <div class="tablewrap"><table class="mini retrot"><thead><tr><th class="txt">Fin ${last}${last<E.year+5?" (mandat en cours)":""}</th><th>Observé</th><th class="sep">Programme tel qu'annoncé</th><th>Simulateur, à l'aveugle</th><th>Simulateur, contexte réel</th></tr></thead><tbody>`+
    rows.map(([lab,fn,o])=>`<tr><td class="txt">${lab}</td><td><strong>${f1(o)}</strong></td><td class="sep">${f1(fn(N))}${err(fn(N),o)}</td><td>${f1(fn(A))}${err(fn(A),o)}</td><td>${f1(fn(C))}${err(fn(C),o)}</td></tr>`).join("")+
    `</tbody></table></div>
    <p class="help"><b>Programme retenu :</b> ${E.progTxt}</p><p class="help"><b>Contexte réel imposé :</b> ${E.ctxTxt}</p><p class="help"><b>Lecture :</b> ${E.verdict}</p>
    <div class="retroch"><canvas id="rc-${E.id}" height="220"></canvas></div></article>`;
  }
  el.innerHTML=html;
  if(typeof Chart==="undefined") return;
  for(const E of RETRO){
    const A=retroRun(E,false,"credible"), C=retroRun(E,true,"credible");
    const ys=[]; for(let y=E.year-1;y<=E.year+5;y++) ys.push(y);
    const ser=R=>ys.map(y=>R.r.debt[y-E.year+1]);
    new Chart(document.getElementById("rc-"+E.id),{type:"line",data:{labels:ys,datasets:[
      {label:"Dette observée",data:ys.map(y=>E.obs.debt[y]??null),borderColor:css("--ink"),backgroundColor:css("--ink"),borderWidth:2.5,spanGaps:false},
      {label:"Simulateur, à l'aveugle",data:ser(A),borderColor:css("--c2"),backgroundColor:css("--c2"),borderDash:[5,4],borderWidth:2},
      {label:"Simulateur, contexte réel",data:ser(C),borderColor:css("--c3"),backgroundColor:css("--c3"),borderWidth:2}]},
      options:{responsive:true,maintainAspectRatio:false,animation:false,plugins:{legend:{position:"bottom",labels:{color:css("--muted"),boxWidth:12}},tooltip:{callbacks:{label:c=>`${c.dataset.label} : ${fmt(c.parsed.y,1)} %`}}},
        scales:{x:{ticks:{color:css("--muted")},grid:{color:css("--line")}},y:{title:{display:true,text:"Dette, % du PIB",color:css("--muted")},ticks:{color:css("--muted")},grid:{color:css("--line")}}}}});
  }
}
