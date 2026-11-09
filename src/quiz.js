// Quiz « Quel programme me ressemble ? », sur le modèle du Wahl-O-Mat : des affirmations, on répond d'accord / neutre /
// pas d'accord, on peut compter une réponse double ou passer. Chaque affirmation vient avec ses conséquences calculées par
// le simulateur, puis le résultat compare thèse par thèse, et chiffre « votre programme ». Mêmes règles pour tous les
// candidats : une position est une valeur chiffrée tirée des mesures du programme, jamais un jugement. Rien n'est enregistré.
const QZ_GP=36; // 1 point de PIB ≈ 36 Md€
const QZ_TAXK=["capital","ir","entreprises","conso","heuressup","bassal","resSec","capitalNet"];
const qzSig=(v,d=0)=>(v>0.00001?"+":v<-0.00001?"−":"")+Math.abs(v).toFixed(d).replace(".",",");
const qzMd=(v,s=true)=>(s?qzSig(Math.round(v),0):Math.round(Math.abs(v)).toString())+" Md€";
const qzMs=(p,keys,f)=>(p.paMeasures||[]).filter(m=>keys.includes(m[2])&&m[3]!=="calc"&&(!f||f(m)));
const qzSumM=(p,keys,f)=>{const a=qzMs(p,keys,f); return a.length?a.reduce((s,m)=>s+m[1],0):null;};
const qzLab=(p,keys,f)=>qzMs(p,keys,f).slice(0,2).map(m=>m[0].replace(/\s*\(.*$/,"")).join(" ; ");
// Une affirmation : position d'un programme (stance : +1 d'accord, 0 neutre, −1 pas d'accord, null = pas de position publiée),
// texte chiffré de cette position, et levier pour calculer les conséquences et « votre programme ».
const QZ_T=[
 {id:"ret",theme:"Retraites",text:"L'âge légal de départ à la retraite doit revenir à 62 ans.",
  val:p=>p.ageShift, st:v=>v<=-2?1:v>0.1?-1:0, fmt:v=>"départ à ≈ "+(Math.round((64+v)*2)/2).toString().replace(".",",")+" ans", rng:v=>(Math.round((64+v)*2)/2).toString().replace(".",",")+" ans",
  lever:{p:{ageShift:-2},m:[["Retour à 62 ans (coût chiffré par LFI, contre-budget 2027)",9,"retraites","","lfi"]],net:9},
  ctx:"Âge de départ dans les programmes. Le coût d'un retour à 62 ans est chiffré à 9 Md€ par an par LFI ; les plans à 63 ou 65 ans économisent de 9 à 15 Md€ par an à l'horizon 2032."},
 {id:"serv",theme:"Services publics",text:"L'État doit consacrer environ 20 Md€ de plus par an à l'hôpital, à l'école et à la justice.",
  val:p=>p.spServ*QZ_GP, st:v=>v>=11?1:v<=-4?-1:0, fmt:v=>qzMd(v)+" par an", rng:v=>qzMd(v),
  lever:{p:{spServ:0.55},m:[],net:19.8},ctx:"Dépenses supplémentaires (ou économies) sur les services publics, par an, par rapport à aujourd'hui."},
 {id:"clim",theme:"Climat",text:"L'État doit investir environ 20 Md€ de plus par an dans la transition écologique.",
  val:p=>(p.climInv-0.2)*QZ_GP, st:v=>v>=10?1:v<=-2?-1:0, fmt:v=>qzMd(v)+" par an", rng:v=>qzMd(v),
  lever:{p:{climInv:0.75},m:[],net:19.8},ctx:"Investissements climat (rénovation, transports, adaptation) en plus ou en moins par rapport à la tendance actuelle."},
 {id:"mig",theme:"Immigration",text:"L'immigration de travail doit être nettement réduite (environ 40 000 actifs de moins par an).",
  val:p=>p.migDelta, st:v=>v<=-40?1:v>=10?-1:0, fmt:v=>qzSig(v)+" 000 actifs par an", rng:v=>(v?qzSig(v):"0")+" 000",
  lever:{p:{migDelta:-40},m:[],net:0},ctx:"Variation du nombre d'actifs étrangers qui s'installent chaque année (hypothèse du simulateur pour chaque programme).",
  lim:"Le simulateur ne chiffre ici que l'emploi, les finances publiques et les revenus d'ici 2032 : pas la démographie à long terme, ni la cohésion sociale, ni les effets sur les services."},
 {id:"def",theme:"Défense",text:"Le budget de la défense doit augmenter d'environ 20 Md€ par an.",
  val:p=>p.defense*QZ_GP, st:v=>v>=11?1:v<=-4?-1:0, fmt:v=>qzMd(v)+" par an", rng:v=>qzMd(v),
  lever:{p:{defense:0.55},m:[],net:19.8},ctx:"Dépenses militaires supplémentaires (ou en moins), par an."},
 {id:"dette",theme:"Dette et déficit",text:"Le déficit doit être réduit d'environ 100 Md€ par an, même au prix de lourdes économies.",
  val:p=>p.A*QZ_GP, st:v=>v>=80?1:v<=40?-1:0, fmt:v=>v>=0?"déficit réduit de ≈ "+Math.round(v)+" Md€":"déficit accru de ≈ "+Math.round(-v)+" Md€", rng:v=>qzMd(v),
  lever:{p:{},m:[],net:-100},ctx:"Effort annoncé par chaque programme sur le déficit, en Md€ par an à terme (négatif : le programme dépense plus qu'il ne finance).",
  lim:"Les économies ne sont pas détaillées ici : le simulateur applique la même règle de crédibilité à tous les programmes."},
 {id:"top",theme:"Impôts des plus riches",text:"Les 10 % de ménages les plus riches doivent payer nettement plus d'impôts (environ 20 Md€ par an).",
  val:(p,r,sq)=>(r.pa.top[7]/sq.pa.top[7]-1)*100, st:v=>v<=-2?1:v>=1?-1:0, fmt:v=>"revenu des 10 % les plus riches en 2032 : "+qzSig(v,1)+" %", rng:v=>qzSig(v,1)+" %",
  lever:{p:{},m:[["Impôt supplémentaire sur les 10 % les plus riches (hypothèse du quiz)",-20,"capital","","quiz"]],net:-20},ctx:"Effet du programme sur le revenu des 10 % les plus riches en 2032, comparé à une France sans mesure nouvelle."},
 {id:"mod",theme:"Revenus des plus modestes",text:"Les revenus des ménages les plus modestes doivent nettement augmenter (Smic, aides : environ 10 Md€ par an).",
  val:(p,r,sq)=>(r.pa.mod[7]/sq.pa.mod[7]-1)*100, st:v=>v>=3?1:v<=-2?-1:0, fmt:v=>"revenu des plus modestes en 2032 : "+qzSig(v,1)+" %", rng:v=>qzSig(v,1)+" %",
  lever:{p:{},m:[["Hausse des bas revenus : Smic et aides (hypothèse du quiz)",10,"bassal","","quiz"]],net:10},ctx:"Effet du programme sur le revenu des ménages les plus modestes en 2032, comparé à une France sans mesure nouvelle."},
 {id:"soc",theme:"Aides sociales",text:"Les aides et allocations sociales doivent être recentrées pour économiser environ 10 Md€ par an.",
  val:p=>qzSumM(p,["social","minima"]), st:v=>v<=-5?1:v>=1?-1:0, fmt:v=>v<0?"économies ≈ "+Math.round(-v)+" Md€":"dépenses en plus ≈ "+Math.round(v)+" Md€", rng:v=>qzMd(-v),
  lab:p=>qzLab(p,["social","minima"]),
  lever:{p:{},m:[["Aides sociales recentrées (hypothèse du quiz)",-10,"social","","quiz"]],net:-10},ctx:"Somme des mesures sur les aides sociales, minima et allocations de chaque programme (économies positives, dépenses en plus négatives)."},
 {id:"cho",theme:"Assurance chômage",text:"L'assurance chômage doit être durcie (indemnisation plus courte ou conditions plus strictes) : environ 5 Md€ d'économies par an.",
  val:p=>qzSumM(p,["chomage"]), st:v=>v<=-2?1:v>=1?-1:0, fmt:v=>v<0?"économies ≈ "+Math.round(-v*10)/10+" Md€":"assurance chômage plus généreuse ≈ "+Math.round(v*10)/10+" Md€", rng:v=>qzMd(-v),
  lab:p=>qzLab(p,["chomage"]),
  lever:{p:{},m:[["Assurance chômage durcie (hypothèse du quiz)",-5,"chomage","","quiz"]],net:-5},ctx:"Somme des mesures sur l'assurance chômage de chaque programme."},
 {id:"ent",theme:"Impôts des entreprises",text:"Les impôts des entreprises doivent baisser d'environ 20 Md€ par an.",
  val:p=>qzSumM(p,["entreprises"]), st:v=>v>=10?1:v<=-2?-1:0, fmt:v=>v>0?"baisse d'impôts ≈ "+Math.round(v)+" Md€":v<0?"hausse d'impôts ≈ "+Math.round(-v)+" Md€":"à enveloppe constante", rng:v=>qzMd(v),
  lab:p=>qzLab(p,["entreprises"]),
  lever:{p:{},m:[["Baisse des impôts des entreprises (hypothèse du quiz)",20,"entreprises","","quiz"]],net:20},ctx:"Somme des mesures sur l'impôt des entreprises de chaque programme (positif : baisse d'impôts)."},
 {id:"her",theme:"Héritages",text:"Les très gros héritages doivent être taxés davantage (environ 15 Md€ de plus par an).",
  val:p=>qzSumM(p,["capital"],m=>/hérit/i.test(m[0])), st:v=>v<=-10?1:0, fmt:v=>"recettes ≈ "+Math.round(-v)+" Md€", rng:v=>qzMd(-v),
  lab:p=>qzLab(p,["capital"],m=>/hérit/i.test(m[0])),
  lever:{p:{},m:[["Taxe sur les très gros héritages (hypothèse du quiz)",-15,"capital","","quiz"]],net:-15},ctx:"Recettes prévues sur les héritages par chaque programme. Un programme sans mesure à ce sujet n'a pas de position publiée ici."}
];
const QZ_ANS=[[1,"D'accord"],[0,"Neutre"],[-1,"Pas d'accord"]];
const QZ_NOCOMPLETE={glucksmann:"programme pas encore publié, reconstitué à partir de ses déclarations",lepen:"programme 2027 pas encore publié : positions d'après les 22 mesures annoncées"};
let QZ={i:-1,ans:{},dbl:{}};
let QZ_FX={};
function qzCands(){return LASTRES?LASTRES.filter(({p})=>!p.fictif&&!p.gov&&p.id!=="statu"):[];}
// Position de chaque programme sur chaque affirmation.
function qzPositions(){
  const sq=LASTRES.find(x=>x.p.id==="statu").r, out={};
  for(const {p,r} of qzCands()){out[p.id]={};
    for(const t of QZ_T){const v=t.val(p,r,sq); if(v==null||!isFinite(v)){out[p.id][t.id]={s:null,txt:"Pas de position publiée dans le programme retenu"};continue;}
      const lab=t.lab?t.lab(p):""; out[p.id][t.id]={s:t.st(v),v,txt:t.fmt(v)+(lab?" · "+lab:"")};}}
  return out;
}
// Score façon Wahl-O-Mat : 2 points si même position, 1 si l'un est neutre, 0 si opposées ; réponse comptée double = poids 2.
// Un sujet sans position publiée pour un programme est exclu de son calcul (on ne récompense pas le silence).
function qzRank(pos,ans,dbl){
  const answered=QZ_T.filter(t=>ans[t.id]!=null);
  return Object.keys(pos).map(id=>{let pts=0,max=0,n=0; const rows=[];
    for(const t of answered){const s=pos[id][t.id].s, a=ans[t.id]; if(s==null){rows.push({t,a,s:null});continue;} const w=dbl[t.id]?2:1; pts+=w*(2-Math.abs(a-s)); max+=w*2; n++; rows.push({t,a,s});}
    return {id,score:max?pts/max:null,n,of:answered.length,rows};}).filter(x=>x.score!=null).sort((x,y)=>y.score-x.score);
}
// Conséquences d'une affirmation (ou de plusieurs) : un candidat « France sans mesure » + le levier, calculé comme les programmes.
function qzBuild(levers){
  const sq0=CANDS0[0], cs=qzCands().map(x=>x.p.c), cm=cs.length?cs.reduce((a,b)=>a+b,0)/cs.length:0.6;
  const over={}, pm=[]; let net=0;
  for(const L of levers){Object.assign(over,L.p); for(const m of L.m) pm.push(m); net+=L.net;}
  let tm=0; for(const m of pm) if(QZ_TAXK.includes(m[2])) tm+=-m[1];
  const p=Object.assign({},sq0,over,{paMeasures:pm,taxMd:+tm.toFixed(1),A:+(-net/QZ_GP).toFixed(3),c:cm});
  if(pm.length) Object.assign(p,topFlows(pm));
  return {p,net,cm};
}
function qzSim(p,b){if(typeof setSocialKey==="function") setSocialKey(0.2); const ms=microsim(p.paMeasures||[],mode==="annonce"?0:b.leak); return simulate(Object.assign({},p,{pa:ms.pa,paDec:ms.deciles}),mode,b);}
function qzEffects(t){
  if(QZ_FX[t.id]) return QZ_FX[t.id];
  const b=Object.assign({},BASE,{noCrisis:1}), L=qzBuild([t.lever]), ref=qzBuild([{p:{},m:[],net:0}]);
  const r=qzSim(L.p,b), q=qzSim(ref.p,b), g=k=>(r.pa[k][7]/q.pa[k][7]-1)*100;
  const fx={net:L.net,dDebt:r.debt[11]-q.debt[11],dPov:r.pov[7]-q.pov[7],dUn:r.unemp[7]-q.unemp[7],dCo2:r.co2[7]-q.co2[7],mod:g("mod"),moy:g("moy"),ais:g("ais"),top:g("top")};
  return QZ_FX[t.id]=fx;
}
function qzEsc(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}
function qzFxHtml(t){
  let f; try{f=qzEffects(t);}catch(e){return "";}
  const line=(k,v)=>`<li><span>${k}</span><strong>${v}</strong></li>`, big=(v,th)=>Math.abs(v)>=th;
  const cost=f.net>0.05?`Coûte environ ${qzMd(f.net,false)} par an`:f.net<-0.05?`Rapporte ou économise environ ${qzMd(f.net,false)} par an`:"Pas de coût budgétaire direct";
  const rows=[line("Budget de l'État",cost),
   line("Dette publique en 2036 (sans crise)",qzSig(f.dDebt,1)+" point"+(Math.abs(f.dDebt)>=2?"s":"")+" de PIB"),
   line("Pauvreté en 2032",big(f.dPov,0.005)?qzSig(f.dPov,2)+" point":"inchangée"),
   line("Pouvoir d'achat 2032 : plus modestes · plus aisés",qzSig(f.mod,1)+" % · "+qzSig(f.ais,1)+" %")];
  if(big(f.dUn,0.03)) rows.push(line("Chômage en 2032",qzSig(f.dUn,2)+" point"));
  if(big(f.dCo2,3)) rows.push(line("Émissions de CO₂ en 2032",qzSig(f.dCo2,0)+" Mt"));
  return `<div class="qz-fx"><h4>Ce que ça changerait, d'après le simulateur</h4><ul>${rows.join("")}</ul><p class="help">Ce sujet seul, par rapport à une France sans mesure nouvelle, lecture centrale. Un ordre de grandeur, pas une prévision : les effets dépendent aussi de la façon de financer.${t.lim?" "+qzEsc(t.lim):""}</p></div>`;
}
function qzRange(t,pos){
  const vs=Object.keys(pos).map(id=>pos[id][t.id].v).filter(v=>v!=null); if(!vs.length) return "";
  return `Dans les programmes : de ${t.rng(Math.min(...vs))} à ${t.rng(Math.max(...vs))}.`;
}
const QZ_IC={1:["✓","d'accord"],0:["~","neutre"],"-1":["✗","pas d'accord"],n:["–","pas de position"]};
const qzIc=(s,cls="")=>{const k=s==null?"n":String(s); return `<span class="qz-ic qz-ic${k.replace("-","m")} ${cls}" role="img" aria-label="${QZ_IC[k][1]}">${QZ_IC[k][0]}</span>`;};
function qzRender(){
  const box=document.getElementById("quizBox"); if(!box) return;
  if(!LASTRES){box.innerHTML='<p class="help">Chargement du simulateur…</p>'; return;}
  const n=QZ_T.length;
  if(QZ.i<0){
    box.innerHTML=`<div class="qz-intro"><h2>Quel programme vous ressemble ?</h2>
      <p>${n} affirmations, environ 5 minutes. Pour chacune, répondez « d'accord », « neutre » ou « pas d'accord », comptez-la double si elle est essentielle pour vous, ou passez-la. Le simulateur vous montre ce que chaque affirmation changerait. À la fin : les programmes comparés thèse par thèse, et ce que donnerait <em>votre</em> programme.</p>
      <ul class="qz-list">
        <li><strong>Mêmes règles pour tous.</strong> La position d'un programme est un chiffre tiré de ses mesures, jamais un jugement. Un sujet absent d'un programme n'est pas compté pour ce programme.</li>
        <li><strong>Rien n'est enregistré ni envoyé.</strong> Vos réponses restent dans cette page.</li>
        <li><strong>Ce n'est pas une consigne de vote.</strong> Le quiz ne couvre que ces ${n} sujets chiffrés : ni la sécurité, ni la justice, ni l'Europe, ni la laïcité, ni les institutions.</li>
      </ul><button class="btn-primary" id="qzStart" type="button">Commencer</button></div>`;
    document.getElementById("qzStart").onclick=()=>{QZ={i:0,ans:{},dbl:{}};QZ_FX={};qzRender();window.scrollTo({top:0});};
    return;
  }
  if(QZ.i>=n) return qzResult(box);
  const t=QZ_T[QZ.i], pos=qzPositions(), cur=QZ.ans[t.id], has=Object.prototype.hasOwnProperty.call(QZ.ans,t.id);
  box.innerHTML=`<div class="qz-q"><div class="qz-prog" role="progressbar" aria-valuemin="1" aria-valuemax="${n}" aria-valuenow="${QZ.i+1}" aria-label="Affirmation ${QZ.i+1} sur ${n}"><i style="width:${Math.round((QZ.i+1)/n*100)}%"></i></div>
    <p class="qz-step">Affirmation ${QZ.i+1} sur ${n} · ${qzEsc(t.theme)}</p>
    <fieldset class="qz-fs"><legend>${qzEsc(t.text)}</legend><p class="help">${qzEsc(t.ctx)} ${qzRange(t,pos)}</p>
    <div class="qz-answers">${QZ_ANS.map(([v,l])=>`<label class="qz-opt" for="qz-${t.id}-${v}"><input type="radio" name="qz-${t.id}" id="qz-${t.id}-${v}" value="${v}"${cur===v?" checked":""}><span>${qzIc(v)}<strong>${l}</strong></span></label>`).join("")}</div>
    <label class="qz-dbl"><input type="checkbox" id="qzDbl"${QZ.dbl[t.id]?" checked":""}> Cette affirmation compte double pour moi</label></fieldset>
    <div id="qzFx">${has&&cur!=null?qzFxHtml(t):""}</div>
    <div class="qz-nav"><button type="button" class="btn-ghost" id="qzBack">${QZ.i?"Précédent":"Retour"}</button><span><button type="button" class="btn-ghost" id="qzSkip">Passer</button> <button type="button" class="btn-primary" id="qzNext"${has?"":" disabled"}>${QZ.i===n-1?"Voir mon résultat":"Suivant"}</button></span></div></div>`;
  box.querySelectorAll('input[type=radio]').forEach(r=>r.onchange=()=>{QZ.ans[t.id]=parseInt(r.value,10); document.getElementById("qzNext").disabled=false; document.getElementById("qzFx").innerHTML=qzFxHtml(t);});
  document.getElementById("qzDbl").onchange=e=>{QZ.dbl[t.id]=e.target.checked;};
  document.getElementById("qzBack").onclick=()=>{QZ.i--; qzRender();};
  document.getElementById("qzSkip").onclick=()=>{QZ.ans[t.id]=null; delete QZ.dbl[t.id]; QZ.i++; qzRender(); window.scrollTo({top:0});};
  document.getElementById("qzNext").onclick=()=>{QZ.i++; qzRender(); window.scrollTo({top:0});};
}
// « Votre programme » : les affirmations auxquelles vous avez répondu « d'accord », appliquées ensemble au simulateur.
function qzMine(box){
  const agreed=QZ_T.filter(t=>QZ.ans[t.id]===1);
  if(!agreed.length) return '<p class="help">Vous n\'avez répondu « d\'accord » à aucune affirmation : il n\'y a pas de programme à chiffrer.</p>';
  const B=qzBuild(agreed.map(t=>t.lever)), ref=qzBuild([{p:{},m:[],net:0}]);
  const draws=makeDraws(BASE).slice(0,100), run=p=>draws.map(d=>simDraw(p,d));
  const R=run(B.p), Q=run(ref.p), med=a=>{const s=[...a].sort((x,y)=>x-y);return s[s.length>>1];};
  const m=(R_,f)=>med(R_.map(f)), cr=R_=>Math.round(100*R_.filter(x=>x.crisis).length/R_.length);
  const spend=agreed.filter(t=>t.lever.net>0).reduce((s,t)=>s+t.lever.net,0), save=agreed.filter(t=>t.lever.net<0).reduce((s,t)=>s-t.lever.net,0);
  const cands=MC&&MC.rows?MC.rows.filter(x=>!x.p.fictif&&!x.p.gov&&x.p.id!=="statu").map(x=>Math.round(x.cr*100)):[];
  if(typeof setSocialKey==="function") setSocialKey(0.2);
  return `<div class="qz-mine"><h3>Votre programme, chiffré</h3>
    <p class="help">Le simulateur applique ensemble les ${agreed.length} affirmation${agreed.length>1?"s":""} auxquelles vous avez répondu « d'accord » (100 tirages des hypothèses, crédibilité des programmes à leur moyenne : ${fmt(B.cm,2)}).</p>
    <ul class="qz-mlist">${agreed.map(t=>`<li><span>${qzEsc(t.theme)}</span><strong>${t.lever.net>0.05?"coûte "+qzMd(t.lever.net,false):t.lever.net<-0.05?"rapporte "+qzMd(t.lever.net,false):"sans coût direct"}</strong></li>`).join("")}</ul>
    <p>Dépenses en plus : <strong>${qzMd(spend,false)}</strong> par an. Économies et recettes : <strong>${qzMd(save,false)}</strong> par an. Solde : <strong>${B.net>0.05?qzMd(B.net,false)+" de déficit en plus":B.net<-0.05?qzMd(B.net,false)+" de déficit en moins":"équilibré"}</strong>${B.net>0.05?". Il faudrait trouver ce financement ailleurs, ou accepter plus de dette.":"."}</p>
    <table class="qz-tab"><thead><tr><th></th><th>Votre programme</th><th>Sans mesure nouvelle</th></tr></thead><tbody>
     <tr><td>Risque de crise de la dette d'ici 2046</td><td>${cr(R)} %</td><td>${cr(Q)} %</td></tr>
     <tr><td>Dette publique en 2036 (% du PIB)</td><td>${fmt(m(R,x=>x.debt[11]),0)}</td><td>${fmt(m(Q,x=>x.debt[11]),0)}</td></tr>
     <tr><td>Pauvreté en 2032</td><td>${fmt(m(R,x=>x.pov[7]),1)} %</td><td>${fmt(m(Q,x=>x.pov[7]),1)} %</td></tr>
     <tr><td>Chômage en 2032</td><td>${fmt(m(R,x=>x.unemp[7]),1)} %</td><td>${fmt(m(Q,x=>x.unemp[7]),1)} %</td></tr></tbody></table>
    ${cands.length?`<p class="help">Pour comparaison, le risque de crise va de ${Math.min(...cands)} % à ${Math.max(...cands)} % selon les six programmes. Valeurs médianes sur les tirages ; ce n'est pas une prévision.</p>`:""}</div>`;
}
function qzResult(box){
  const pos=qzPositions(), rk=qzRank(pos,QZ.ans,QZ.dbl), answered=QZ_T.filter(t=>QZ.ans[t.id]!=null);
  const again=()=>{QZ={i:-1,ans:{},dbl:{}};QZ_FX={};qzRender();window.scrollTo({top:0});};
  if(!rk.length){box.innerHTML='<p>Aucune comparaison possible : vous avez passé toutes les affirmations, ou aucun programme n\'a de position sur celles que vous avez traitées.</p><button class="btn-primary" id="qzAgain" type="button">Recommencer</button>'; document.getElementById("qzAgain").onclick=again; return;}
  const names=Object.fromEntries(qzCands().map(({p})=>[p.id,p])), nm=id=>names[id].name.replace(/ \(.*/,""), party=id=>(names[id].name.match(/\((.*)\)/)||[])[1]||"";
  const tie=(k)=>rk[k+1]&&rk[k].score-rk[k+1].score<0.02;
  const bar=(x,k)=>`<li class="qz-rowc" style="--c:var(${names[x.id].color})"><span class="qz-rk">${k+1}</span><span class="qz-nm">${qzEsc(nm(x.id))} <small>${qzEsc(party(x.id))}</small></span><span class="qz-barw"><i style="width:${Math.round(x.score*100)}%"></i></span><strong class="qz-pct">${Math.round(x.score*100)} %</strong>
    <small class="qz-cov">positions publiées sur ${x.n} des ${x.of} sujets traités${x.n<x.of*0.6?" : score à prendre avec précaution":""}${tie(k)?" · quasi à égalité avec le suivant":""}${QZ_NOCOMPLETE[x.id]?" · "+QZ_NOCOMPLETE[x.id]:""}</small></li>`;
  const ids=rk.map(x=>x.id);
  const matrix=`<div class="qz-mwrap"><table class="qz-mx"><thead><tr><th>Affirmation</th><th>Vous</th>${ids.map(id=>`<th title="${qzEsc(nm(id))}">${qzEsc(nm(id).split(" ")[0])}</th>`).join("")}</tr></thead><tbody>${answered.map(t=>`<tr><td>${qzEsc(t.text)}</td><td>${qzIc(QZ.ans[t.id])}${QZ.dbl[t.id]?'<sup>×2</sup>':""}</td>${ids.map(id=>`<td>${qzIc(pos[id][t.id].s)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  const details=answered.map(t=>`<details class="qz-det"><summary>${qzIc(QZ.ans[t.id])} ${qzEsc(t.text)}</summary>
     <ul class="qz-plist">${ids.map(id=>`<li>${qzIc(pos[id][t.id].s)}<span><strong>${qzEsc(nm(id))}</strong> : ${qzEsc(pos[id][t.id].txt)}</span></li>`).join("")}</ul>${qzFxHtml(t)}</details>`).join("");
  box.innerHTML=`<div class="qz-res"><h2>Vos résultats</h2>
    <p class="help">Sur ${answered.length} affirmation${answered.length>1?"s":""} traitée${answered.length>1?"s":""} sur ${QZ_T.length}. Points : 2 si même position, 1 si l'un est neutre, 0 si opposées ; une affirmation comptée double pèse deux fois plus.</p>
    <ol class="qz-ranking">${rk.map((x,k)=>bar(x,k)).join("")}</ol>
    <h3>Affirmation par affirmation</h3>
    <p class="help">✓ d'accord · ~ neutre · ✗ pas d'accord · – pas de position publiée. Ouvrez une ligne ci-dessous pour voir la position chiffrée de chaque programme et les conséquences.</p>
    ${matrix}<div class="qz-dets">${details}</div>
    ${qzMine(box)}
    <div class="panel info qz-caveat"><p><strong>À garder en tête.</strong> Ce quiz compare vos réponses à des chiffres, sur ${QZ_T.length} sujets seulement. Il ne couvre ni la sécurité, ni la justice, ni l'Europe, ni la laïcité, ni les institutions, ni les valeurs, ni la personnalité des candidats. Un programme peut vous convenir sur ces sujets et pas sur les autres. Les conséquences sont des simulations avec leur incertitude, pas des prévisions ; ce n'est pas un conseil de vote.</p>
    <details><summary>Comment c'est calculé</summary><p class="help">Pour chaque affirmation, la position d'un programme (d'accord, neutre, pas d'accord) vient d'une valeur chiffrée tirée de ses mesures ou de leurs effets (âge de départ, dépenses supplémentaires, effet sur les revenus, mesures sur le chômage ou les aides…), avec les mêmes seuils pour tous. Un programme sans mesure sur un sujet n'a pas de position publiée : ce sujet est retiré de son calcul au lieu de lui donner des points. Les conséquences d'une affirmation sont calculées par le simulateur en l'appliquant seule à une France sans mesure nouvelle, avec le coût indiqué ; les coûts viennent des chiffrages des programmes quand ils existent, sinon ce sont des ordres de grandeur du quiz, signalés comme tels. Les effets suivent vos réglages actuels (par défaut : chiffrage crédible, lecture centrale).</p></details></div>
    <div class="qz-nav"><button type="button" class="btn-ghost" id="qzAgain">Recommencer</button><button type="button" class="btn-ghost" id="qzEdit">Modifier mes réponses</button></div></div>`;
  document.getElementById("qzAgain").onclick=again;
  document.getElementById("qzEdit").onclick=()=>{QZ.i=0;qzRender();window.scrollTo({top:0});};
}
document.addEventListener("click",e=>{const g=e.target.closest&&e.target.closest("[data-go=quiz]"); if(g) setTimeout(qzRender,0);});
// Rendu initial et à chaque recalcul ; on ne touche pas aux questions en cours.
function qzRefresh(){QZ_FX={}; const b=document.getElementById("quizBox"); if(b&&(QZ.i<0||QZ.i>=QZ_T.length)) qzRender();}
document.addEventListener("DOMContentLoaded",qzRender);
setTimeout(qzRender,0);
