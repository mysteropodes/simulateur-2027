// Onglet « Changer les règles du jeu », section 12 : qui pourrait gouverner ?
// Modèle de sièges sans sondage : premier tour réel de 2024, hypothèses réglées par le visiteur,
// second tour (qualification, retraits, reports) calé sur les vrais seconds tours de 2022 et de 2024.
const PB=["L","G","C","D","R","A"];
const PBN={L:"LFI",G:"PS, écologistes, PCF",C:"Centre (Ensemble)",D:"LR et divers droite",R:"RN et alliés",A:"Autres (régionalistes, divers)"};
const PBC={L:"--c1",G:"--c4",C:"--c3",D:"--c5",R:"--c2",A:"--c0"};
const PCAND=[["melenchon","Mélenchon","L"],["glucksmann","Glucksmann","G"],["attal","Attal","C"],["philippe","Philippe","C"],["retailleau","Retailleau","D"],["lepen","Le Pen","R"]];
const PSD1=[0.1,0.1,0.12,0.15,0.08,0.15]; // écart local au glissement uniforme (log) : la moitié ou moins de l'écart mesuré entre 2022 et 2024 (0,17 à 0,50), qui inclut les changements de candidats
const P_MAJ=289;
function pRng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function pGauss(r){return Math.sqrt(-2*Math.log(r()+1e-12))*Math.cos(2*Math.PI*r());}
// retraits au second tour : taux observés en 2024 quand le RN est qualifié, multipliés par l'intensité du barrage
function pW(b,top,fr){
  if(top.includes(4)){
    const w=b===2?(top.includes(0)?0.68:top.includes(1)?0.92:0.5):[0.92,0.99,0,0.14,0,0.9][b];
    return w*fr;
  }
  return b===4?0.06:0.5*fr;
}
function pAff(fr){const A=[];for(let i=0;i<6;i++){A.push([]);for(let j=0;j<6;j++)A[i].push((1-fr)*PARL.A22[i][j]+fr*PARL.A24[i][j]);}return A;}
function pTarget(st){
  const u=st.gauche!=="divisee";
  return {melenchon:u?[0,1]:[0],glucksmann:u?[0,1]:[1],attal:[2],philippe:[2],retailleau:[3],lepen:[4]}[st.pres]||null;
}
function pMax(cs,b){let m=-1;cs.forEach((c,i)=>{if(c.b===b&&(m<0||c.v>cs[m].v))m=i;});return m;}
// premier tour du scénario : 2024 réel, puis gauche divisée, bonus du camp présidentiel, alliances
function pPrep(st){
  const k=Math.min(0.97,Math.max(0.03,st.k/100)), out=[];
  for(const row of PARL.c){
    const cs=[]; for(let i=1;i<row.length;i+=2) cs.push({b:row[i],v:row[i+1]});
    out.push({ins:row[0],cs});
  }
  if(st.gauche==="divisee"){
    // part de LFI dans la gauche, circonscription par circonscription : les écarts locaux de la présidentielle 2022
    // (Mélenchon parmi Mélenchon, Jadot, Roussel, Hidalgo), recalés pour que la moyenne nationale vaille la part choisie
    const lg=x=>Math.log(x/(1-x)), sg=x=>1/(1+Math.exp(-x)), M=[], W=[];
    out.forEach((o,c)=>{let m=-1;o.cs.forEach((x,i)=>{if((x.b===0||x.b===1)&&(m<0||x.v>o.cs[m].v))m=i;});M.push(m);W.push(m>=0?o.cs[m].v:0);});
    const avg=d=>{let s=0,w=0;out.forEach((o,c)=>{s+=W[c]*sg(lg(PARL.mel[c])+d);w+=W[c];});return s/w;};
    let lo=-12,hi=12; for(let it=0;it<40;it++){const mid=(lo+hi)/2; if(avg(mid)<k) lo=mid; else hi=mid;}
    const d=(lo+hi)/2;
    out.forEach((o,c)=>{const m=M[c]; if(m<0) return; const kc=sg(lg(PARL.mel[c])+d), v=o.cs[m].v; o.cs.splice(m,1,{b:0,v:v*kc},{b:1,v:v*(1-kc)});});
  }
  const T=pTarget(st);
  if(T&&st.bonus){
    let S=0,N=0; for(const o of out) for(const c of o.cs){N+=c.v; if(T.includes(c.b)) S+=c.v;}
    S/=N; const b=Math.min(0.95-S,Math.max(-S+0.01,st.bonus/100)), fT=(S+b)/S, fO=(1-S-b)/(1-S);
    for(const o of out) for(const c of o.cs) c.v*=T.includes(c.b)?fT:fO;
  }
  if(st.lr==="centre"||st.lr==="rn"){
    const p=st.lr==="centre"?[2,3]:[3,4];
    for(const o of out){const i=pMax(o.cs,p[0]),j=pMax(o.cs,p[1]); if(i<0||j<0) continue;
      const a=o.cs[i],c=o.cs[j],big=a.v>=c.v?a:c,sm=big===a?c:a; big.v+=0.85*sm.v; o.cs.splice(o.cs.indexOf(sm),1);}
  }
  for(const o of out) o.cs.sort((a,b)=>b.v-a.v);
  return out;
}
function pRun2(stay,el,A,noise,r){
  const v=stay.map(s=>s.v);
  for(const e of el){let s=0;for(const t of stay)s+=A[e.b][t.b];const d=Math.max(1,s);stay.forEach((t,j)=>{v[j]+=e.v*A[e.b][t.b]/d;});}
  if(noise){const tot=v.reduce((a,x)=>a+x,0);for(let j=0;j<v.length;j++)v[j]=v[j]/tot+noise*pGauss(r);}
  let w=0;for(let j=1;j<v.length;j++)if(v[j]>v[w])w=j;return stay[w].b;
}
// une circonscription : sans r, probabilité de victoire de chaque bloc ; avec r, un tirage
function pCirc(o,fr,A,r){
  let cs=o.cs; const res=[0,0,0,0,0,0];
  if(r) cs=cs.map(c=>({b:c.b,v:c.v*Math.exp(PSD1[c.b]*pGauss(r)-PSD1[c.b]*PSD1[c.b]/2)})).sort((a,b)=>b.v-a.v); // bruit de moyenne nulle
  if(cs.length<2){res[cs[0].b]=1;return res;}
  const ex=cs.reduce((a,c)=>a+c.v,0);
  if(cs[0].v>0.5*ex&&cs[0].v>=0.25*o.ins){res[cs[0].b]=1;return res;}
  const q=cs.filter((c,i)=>i<2||c.v>=0.125*o.ins), top=[q[0].b,q[1].b], extra=q.slice(2);
  if(r){const stay=[q[0],q[1]];for(const e of extra) if(r()>=pW(e.b,top,fr)) stay.push(e);
    res[pRun2(stay,cs.filter(c=>!stay.includes(c)),A,PARL.sd2,r)]=1;return res;}
  for(let m=0;m<(1<<extra.length);m++){
    let pr=1;const stay=[q[0],q[1]];
    extra.forEach((e,i)=>{const w=pW(e.b,top,fr),gone=(m>>i)&1;pr*=gone?w:1-w;if(!gone)stay.push(e);});
    if(pr===0) continue;
    res[pRun2(stay,cs.filter(c=>!stay.includes(c)),A,0)]+=pr;
  }
  return res;
}
// sièges attendus par bloc et, si draws>0, tirages pour les fourchettes
function pSeats(st,draws){
  const P=pPrep(st),fr=st.fr/100,A=pAff(fr),mean=[0,0,0,0,0,0],D=[];
  for(const o of P){const x=pCirc(o,fr,A);for(let b=0;b<6;b++)mean[b]+=x[b];}
  if(draws){const r=pRng(2027);for(let d=0;d<draws;d++){const s=[0,0,0,0,0,0];for(const o of P){const x=pCirc(o,fr,A,r);for(let b=0;b<6;b++)s[b]+=x[b];}D.push(s);}}
  return {mean,D};
}
function pQ(D,idx,q){const v=D.map(s=>idx.reduce((a,i)=>a+s[i],0)).sort((a,b)=>a-b);return v[Math.min(v.length-1,Math.floor(q*v.length))];}
// fourchette à 80 % centrée sur le résultat attendu : la largeur vient des tirages, le centre du calcul sans bruit
function pRange(r,idx){const c=idx.reduce((a,i)=>a+r.mean[i],0),md=pQ(r.D,idx,0.5);return [Math.max(0,Math.round(c+pQ(r.D,idx,0.1)-md)),Math.min(577,Math.round(c+pQ(r.D,idx,0.9)-md))];}
// camp du président : ses blocs, plus l'allié choisi
function pCamp(st,b){
  let c=[PB.indexOf(b)];
  if(st.gauche!=="divisee"&&(b==="L"||b==="G")) c=[0,1];
  if(st.lr==="centre"&&(b==="C"||b==="D")) c=[2,3];
  if(st.lr==="rn"&&(b==="D"||b==="R")) c=[3,4];
  return c;
}
function pRound(v){const f=v.map(Math.floor);let r=577-f.reduce((a,x)=>a+x,0);const o=v.map((x,i)=>[x-f[i],i]).sort((a,b)=>b[0]-a[0]);for(let i=0;i<r;i++)f[o[i%6][1]]++;return f;}

// ---------- affichage ----------
let pSt={pres:"",bonus:0,gauche:"unie",k:31,lr:"seul",fr:100}, pBuilt=false, pCharts={}, pHistMode="v", pTimer=null;
function pChart(id,cfg){const cv=document.getElementById(id);if(!cv||typeof Chart==="undefined")return;if(pCharts[id])pCharts[id].destroy();pCharts[id]=new Chart(cv,cfg);}
const pAlpha=(c,a)=>{const h=c.replace("#","");if(h.length!==6)return c;return `rgba(${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)},${a})`;};
function pHemi(id,labels,data,cols,title){
  pChart(id,{type:"doughnut",data:{labels,datasets:[{data,backgroundColor:cols,borderColor:css("--bg")||"#000",borderWidth:1}]},
    options:{rotation:-90,circumference:180,cutout:"52%",responsive:true,maintainAspectRatio:false,animation:false,
      plugins:{legend:{position:"bottom",labels:{color:css("--muted"),boxWidth:12}},title:{display:!!title,text:title,color:css("--ink")},
        tooltip:{callbacks:{label:c=>` ${c.label} : ${c.raw} siège${c.raw>1?"s":""}`}}}}});
}
function pPie(id,labels,data,cols,title,unit){
  pChart(id,{type:"pie",data:{labels,datasets:[{data,backgroundColor:cols,borderColor:css("--bg")||"#000",borderWidth:1}]},
    options:{responsive:true,maintainAspectRatio:false,animation:false,plugins:{legend:{position:"bottom",labels:{color:css("--muted"),boxWidth:12}},
      title:{display:true,text:title,color:css("--ink")},tooltip:{callbacks:{label:c=>` ${c.label} : ${fmt(c.raw,unit==="%"?1:0)}${unit==="%"?" %":" sièges"}`}}}}});
}
function buildParl(){
  if(typeof PARL==="undefined"||!document.getElementById("pAss")) return;
  if(!pBuilt){pBuilt=true;pWire();}
  pAssembly(); pHist(); pVS(); pDraw();
}
function pWire(){
  const seg=(at,key,cb)=>document.querySelectorAll(`[data-${at}]`).forEach(b=>b.onclick=()=>{pSt[key]=b.dataset[at];document.querySelectorAll(`[data-${at}]`).forEach(x=>x.setAttribute("aria-pressed",x.dataset[at]===pSt[key]));if(cb)cb();pLater();});
  seg("ppres","pres"); seg("pg","gauche",()=>{document.getElementById("pKbox").hidden=pSt.gauche!=="divisee";}); seg("plr","lr");
  const sl=(id,key,out,f)=>{const e=document.getElementById(id);e.oninput=()=>{pSt[key]=+e.value;document.getElementById(out).textContent=f(+e.value);pLater();};};
  sl("pBonus","bonus","pBonusV",v=>(v>0?"+":v<0?"−":"")+Math.abs(v)+" pt"+(Math.abs(v)>1?"s":""));
  sl("pK","k","pKV",v=>v+" %"); sl("pFr","fr","pFrV",v=>v===100?"comme en 2024":v===0?"comme en 2022":v+" % de 2024");
  document.querySelectorAll("[data-pk]").forEach(b=>b.onclick=()=>{pSt.k=+b.dataset.pk;document.getElementById("pK").value=pSt.k;document.getElementById("pKV").textContent=pSt.k+" %";pLater();});
  document.querySelectorAll("[data-ph]").forEach(b=>b.onclick=()=>{pHistMode=b.dataset.ph;document.querySelectorAll("[data-ph]").forEach(x=>x.setAttribute("aria-pressed",x.dataset.ph===pHistMode));pHist();});
}
function pLater(){clearTimeout(pTimer);document.getElementById("pRead").textContent="Calcul en cours…";pTimer=setTimeout(pDraw,60);}
// L'Assemblée telle qu'elle est
function pAssembly(){
  const a=PARL.ass, grp={}; for(const [n,s,b] of a) grp[b]=(grp[b]||0)+s;
  const shade=[1,0.85,0.7,0.55]; const seen={};
  pHemi("pAss",a.map(x=>x[0]),a.map(x=>x[1]),a.map(([n,s,b])=>{seen[b]=(seen[b]||0)+1;return pAlpha(css(PBC[b]),shade[(seen[b]-1)%4]);}),"");
  const L=grp.L||0,G=grp.G||0,C=grp.C||0,D=grp.D||0,R=grp.R||0,Aa=grp.A||0, liot=a.find(x=>x[0]==="LIOT")[1];
  const row=(n,camp,cd,cens)=>`<tr><td>${n}</td><td style="white-space:normal;text-align:left">${camp}</td><td style="white-space:normal;text-align:left">${cd}</td><td style="white-space:normal;text-align:left">${cens}</td></tr>`;
  const manq=x=>Math.max(0,P_MAJ-x);
  const rows=[
    row("Mélenchon",`gauche ${L+G}`,manq(L+G),`centre + LR + RN = ${C+D+R}${C+D+R>=P_MAJ?" (suffit)":""}`),
    row("Glucksmann",`gauche sans LFI ${G} ; avec tout le centre ${G+C} ; avec LIOT en plus ${G+C+liot}`,`${manq(G)} seul, ${manq(G+C)} avec le centre`,`si le centre le soutient, les autres réunis font ${577-G-C-liot}${577-G-C-liot>=P_MAJ?" (suffit)":" : pas de censure possible"}`),
    row("Attal, Philippe",`centre + LR ${C+D}`,manq(C+D),`gauche + RN = ${L+G+R}${L+G+R>=P_MAJ?" (suffit)":""}`),
    row("Retailleau",`centre + LR ${C+D}, ou LR + RN ${D+R}`,`${manq(C+D)} à ${manq(D+R)}`,`avec le centre : gauche + RN = ${L+G+R} ; avec le RN : gauche + centre = ${L+G+C}`),
    row("Le Pen",`RN et alliés ${R} ; avec LR ${R+D}`,`${manq(R+D)} à ${manq(R)}`,`gauche + centre = ${L+G+C}${L+G+C>=P_MAJ?" (suffit)":""}`),
    row("Candidat IA (fictif)","aucun député",P_MAJ,"tout dépendrait des législatives")];
  document.getElementById("pAssTab").innerHTML=rows.join("");
}
// 66 ans de législatives
function pHist(){
  const H=PARL.hist, ys=H.y, mode=pHistMode, src=mode==="v"?H.v:H.s;
  const names={G:"Gauche",C:"Centre (depuis 2007)",D:"Droite et centre-droit",R:"Extrême droite",A:"Autres"};
  pChart("pHistC",{type:"bar",data:{labels:ys,datasets:["G","C","D","R","A"].map(b=>({label:names[b],data:src[b],backgroundColor:css(b==="G"?"--c1":b==="A"?"--c0":PBC[b]),stack:"s"}))},
    options:{responsive:true,maintainAspectRatio:false,animation:false,plugins:{legend:{position:"bottom",labels:{color:css("--muted"),boxWidth:12}},tooltip:{callbacks:{label:c=>` ${c.dataset.label} : ${fmt(c.raw)} %`}}},
      scales:{x:{stacked:true,ticks:{color:css("--muted")},grid:{display:false}},y:{stacked:true,max:100,title:{display:true,text:mode==="v"?"% des voix au premier tour":"% des sièges",color:css("--muted")},ticks:{color:css("--muted")},grid:{color:css("--line")}}}}});
  pChart("pGovC",{type:"bar",data:{labels:ys,datasets:[{label:"Partis du gouvernement formé après l'élection",data:H.gov,backgroundColor:H.y.map(y=>["1988","2022","2024"].includes(y)?css("--c1"):css("--c5"))},
      {type:"line",label:"Majorité absolue (50 %)",data:ys.map(()=>50),borderColor:css("--muted"),borderDash:[5,4],pointRadius:0,borderWidth:1.5}]},
    options:{responsive:true,maintainAspectRatio:false,animation:false,plugins:{legend:{position:"bottom",labels:{color:css("--muted"),boxWidth:12}},tooltip:{callbacks:{label:c=>` ${c.dataset.label} : ${fmt(c.raw)} %`,afterLabel:c=>c.datasetIndex===0&&["1967","1986"].includes(c.label)?" majorité absolue avec des élus apparentés ou d'outre-mer":c.datasetIndex===0&&["1988","2022","2024"].includes(c.label)?" pas de majorité absolue":""}}},
      scales:{x:{ticks:{color:css("--muted")},grid:{display:false}},y:{min:0,max:100,title:{display:true,text:"% des sièges",color:css("--muted")},ticks:{color:css("--muted")},grid:{color:css("--line")}}}}});
  pChart("pEffC",{type:"line",data:{labels:ys,datasets:[{label:"Dans les voix",data:H.nv,borderColor:css("--c3"),backgroundColor:css("--c3"),pointRadius:2},{label:"Dans les sièges",data:H.ns,borderColor:css("--c2"),backgroundColor:css("--c2"),pointRadius:2}]},
    options:{responsive:true,maintainAspectRatio:false,animation:false,plugins:{legend:{position:"bottom",labels:{color:css("--muted"),boxWidth:12}},tooltip:{callbacks:{label:c=>` ${c.dataset.label} : ${fmt(c.raw)}`}}},
      scales:{x:{ticks:{color:css("--muted")},grid:{display:false}},y:{min:1,max:4.5,title:{display:true,text:"Nombre effectif de blocs",color:css("--muted")},ticks:{color:css("--muted")},grid:{color:css("--line")}}}}});
}
// voix contre sièges en 2024
function pVS(){
  const H=PARL.hist, i=H.y.indexOf("2024"), lab=["Gauche (NFP et divers)","Centre (Ensemble)","LR et divers droite","RN et alliés","Autres"], bl=["G","C","D","R","A"];
  const cols=bl.map(b=>css(b==="G"?"--c1":PBC[b]));
  pPie("pVot",lab,bl.map(b=>H.v[b][i]),cols,"Voix au premier tour","%");
  const s=PARL.res24; pPie("pSea",lab,[s.L+s.G,s.C,s.D,s.R,s.A],cols,"Sièges","s");
}
function pDraw(){
  const st=pSt, r=pSeats(st,120), m=pRound(r.mean);
  const order=[0,1,5,2,3,4];
  pHemi("pSim",order.map(b=>PBN[PB[b]]),order.map(b=>m[b]),order.map(b=>css(PBC[PB[b]])),"");
  const q=(idx)=>{const x=pRange(r,idx);return `${x[0]} à ${x[1]}`;};
  const rows=order.map(b=>`<tr><td><span class="dot" style="background:${css(PBC[PB[b]])}"></span> ${PBN[PB[b]]}</td><td style="text-align:right">${m[b]}</td><td style="text-align:right">${q([b])}</td></tr>`);
  rows.push(`<tr><td><b>Gauche (LFI + PS, écologistes, PCF)</b></td><td style="text-align:right"><b>${m[0]+m[1]}</b></td><td style="text-align:right">${q([0,1])}</td></tr>`);
  if(st.lr==="centre") rows.push(`<tr><td><b>Centre + LR</b></td><td style="text-align:right"><b>${m[2]+m[3]}</b></td><td style="text-align:right">${q([2,3])}</td></tr>`);
  if(st.lr==="rn") rows.push(`<tr><td><b>LR + RN</b></td><td style="text-align:right"><b>${m[3]+m[4]}</b></td><td style="text-align:right">${q([3,4])}</td></tr>`);
  document.getElementById("pSimTab").innerHTML=rows.join("");
  // lecture
  const camps=[["la gauche unie",[0,1]],["le centre",[2]],["LR",[3]],["le RN et ses alliés",[4]]];
  if(st.gauche==="divisee") camps.splice(0,1,["LFI",[0]],["le PS, les écologistes et le PCF",[1]]);
  if(st.lr==="centre") camps.push(["le centre et LR alliés",[2,3]]); if(st.lr==="rn") camps.push(["LR et le RN alliés",[3,4]]);
  const best=camps.map(([n,idx])=>[n,idx.reduce((a,i)=>a+m[i],0),pRange(r,idx)[1]]).sort((a,b)=>b[1]-a[1])[0];
  document.getElementById("pRead").textContent=best[1]>=P_MAJ?`Avec ces hypothèses, ${best[0]} obtient la majorité absolue (${best[1]} sièges sur 577).`:
    `Avec ces hypothèses, aucun camp n'a la majorité absolue : le premier, ${best[0]}, a ${best[1]} sièges, il lui en manque ${P_MAJ-best[1]}${best[2]>=P_MAJ?" (la majorité reste possible dans les tirages les plus favorables)":""}.`;
  pCands();
}
function pCands(){
  const rows=[];
  for(const [id,n,b] of PCAND){
    const st=Object.assign({},pSt,{pres:id}), r=pSeats(st,60), m=pRound(r.mean), camp=pCamp(st,b);
    const cs=camp.reduce((a,i)=>a+m[i],0), [lo,hi]=pRange(r,camp), oth=577-cs;
    const ok=cs>=P_MAJ?"oui":hi>=P_MAJ?"possible (tirages favorables)":"non";
    // un partenaire suffirait-il ?
    const others=[[0,1],[2],[3],[4]].filter(g=>!g.some(i=>camp.includes(i)));
    if(pSt.gauche==="divisee"){others.splice(0,1); if(!camp.includes(0)) others.push([0]); if(!camp.includes(1)) others.push([1]);}
    const nm=g=>g.length===2&&g[0]===0?"la gauche":{L:"LFI",G:"le PS, les écologistes et le PCF",C:"le centre",D:"LR",R:"le RN et ses alliés"}[PB[g[0]]];
    const part=cs>=P_MAJ?"—":others.filter(g=>cs+g.reduce((a,i)=>a+m[i],0)>=P_MAJ).map(nm).join(", ")||"aucun seul";
    rows.push(`<tr><td>${n}</td><td style="text-align:right">${cs}</td><td style="text-align:right">${lo} à ${hi}</td><td style="white-space:normal;text-align:left">${ok}</td><td style="white-space:normal;text-align:left">${part}</td><td style="white-space:normal;text-align:left">${oth}${oth>=P_MAJ?" : peuvent censurer":""}</td></tr>`);
  }
  rows.push(`<tr><td>Candidat IA (fictif)</td><td colspan="5" style="white-space:normal;text-align:left">Pas de parti ni de voix en 2024 : comme Emmanuel Macron en 2017, il devrait créer un mouvement. Sans sondage, impossible de le chiffrer.</td></tr>`);
  document.getElementById("pCandTab").innerHTML=rows.join("");
}
if(typeof module!=="undefined") module.exports={pPrep,pSeats,pCirc,pAff,pRound,pQ,pRange,pCamp};
