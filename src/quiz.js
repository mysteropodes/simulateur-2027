// Quiz « Quel programme me ressemble ? » : 8 thèmes, mêmes règles pour tous les candidats.
// Les positions des programmes viennent des données du simulateur (paramètres des programmes et effets calculés
// sur les revenus). Aucune réponse n'est enregistrée ni envoyée : tout se passe dans la page.
const QZ_PT=36; // 1 point de PIB ≈ 36 Md€ (même conversion que les fiches)
const qzSig=(v,d=0)=>(v>0.0001?"+":v<-0.0001?"−":"")+Math.abs(v).toFixed(d).replace(".",",");
const qzMd=v=>qzSig(Math.round(v),0)+" Md€";
// Chaque thème : valeur d'un programme (fonction), réponses possibles (libellé, valeur visée), étendue pour la distance.
const QZ_AX=[
 {id:"ret",name:"Retraites",q:"Retraites : à quel âge faut-il pouvoir partir ?",hint:"Âge légal de départ.",
  val:(p)=>64+p.ageShift, fmt:v=>(Math.round(v*2)/2).toString().replace(".",",")+" ans", R:5,
  opts:[["À 60 ans",60],["À 62 ans",62],["À 64 ans",64],["À 65 ans ou plus",65]]},
 {id:"mod",name:"Revenus des plus modestes",q:"Revenus des ménages les plus modestes : que doit-il se passer d'ici 2032 ?",hint:"Comparé à une France sans nouvelle mesure (pouvoir d'achat, effet direct des mesures et de l'économie).",
  val:(p,r,sq)=>(r.pa.mod[7]/sq.pa.mod[7]-1)*100, fmt:v=>qzSig(v,1)+" %", R:12,
  opts:[["Ils doivent nettement augmenter",7],["Ils doivent augmenter un peu",3],["Aucun changement particulier",0],["Ils peuvent baisser un peu si c'est le prix pour redresser les comptes",-5]]},
 {id:"top",name:"Impôts des plus riches",q:"Les 10 % de ménages les plus riches : que doit-il se passer pour leurs revenus ?",hint:"Comparé à une France sans nouvelle mesure, après impôts et prestations.",
  val:(p,r,sq)=>(r.pa.top[7]/sq.pa.top[7]-1)*100, fmt:v=>qzSig(v,1)+" %", R:9,
  opts:[["Ils doivent contribuer beaucoup plus",-6],["Ils doivent contribuer un peu plus",-2],["Aucun changement particulier",0],["Ils doivent payer moins d'impôts",3]]},
 {id:"serv",name:"Services publics",q:"Hôpital, école, justice : combien de moyens en plus ou en moins ?",hint:"Dépenses supplémentaires pour les services publics, par an.",
  val:(p)=>p.spServ*QZ_PT, fmt:v=>qzMd(v)+" par an", R:36,
  opts:[["Beaucoup plus de moyens",22],["Un peu plus de moyens",7],["Autant qu'aujourd'hui",0],["Moins de moyens, pour un État plus léger",-15]]},
 {id:"clim",name:"Climat",q:"Climat : combien investir de plus pour la transition ?",hint:"Investissements climat supplémentaires par rapport à la tendance actuelle, par an.",
  val:(p)=>(p.climInv-0.2)*QZ_PT, fmt:v=>qzMd(v)+" par an", R:24,
  opts:[["Beaucoup plus",20],["Plus",11],["Un peu plus",4],["Moins qu'aujourd'hui",-4]]},
 {id:"mig",name:"Immigration",q:"Immigration : quelle orientation ?",hint:"Variation du nombre d'actifs étrangers qui s'installent chaque année (hypothèse du simulateur pour chaque programme).",
  val:(p)=>p.migDelta, fmt:v=>qzSig(v,0)+" 000 par an", R:120,
  opts:[["Accueillir davantage, régulariser",20],["Comme aujourd'hui",0],["Réduire nettement",-40],["Réduire très fortement",-100]]},
 {id:"dette",name:"Dette et déficit",q:"Dette : à quelle vitesse faut-il réduire le déficit ?",hint:"Effort annoncé par le programme sur le déficit, en milliards d'euros par an à terme (un programme qui dépense plus qu'il ne finance l'augmente).",
  val:(p)=>p.A*QZ_PT, fmt:v=>v>=0?Math.round(v)+" Md€ de déficit en moins":Math.round(-v)+" Md€ de déficit en plus", R:110,
  opts:[["Le plus vite possible, quitte à de lourdes économies",110],["Progressivement",55],["Ce n'est pas la priorité : on protège d'abord les dépenses",0]]},
 {id:"def",name:"Défense",q:"Défense : quel budget ?",hint:"Dépenses supplémentaires pour l'armée, par an.",
  val:(p)=>p.defense*QZ_PT, fmt:v=>qzMd(v)+" par an", R:29,
  opts:[["Fortement augmenter",22],["Augmenter un peu",11],["Le laisser stable",0],["Le réduire un peu",-7]]}
];
const QZ_IMP=[["Un peu",1],["Beaucoup",2],["C'est décisif",3]];
const QZ_NOCOMPLETE={glucksmann:"programme pas encore publié, reconstitué à partir de ses déclarations",lepen:"programme 2027 pas encore publié : positions d'après les 22 mesures annoncées"};
let QZ={i:-1,ans:{},imp:{},order:null};
function qzCands(){return LASTRES?LASTRES.filter(({p})=>!p.fictif&&!p.gov&&p.id!=="statu"):[];}
function qzValues(){
  const sq=LASTRES.find(x=>x.p.id==="statu").r, out={};
  for(const {p,r} of qzCands()){out[p.id]={};for(const a of QZ_AX) out[p.id][a.id]=a.val(p,r,sq);}
  return out;
}
// Score d'un programme : moyenne, pondérée par l'importance, de la proximité (1 = même position, 0 = opposé) sur les thèmes répondus.
function qzScore(vals,ans,imp){
  let s=0,w=0; const rows=[];
  for(const a of QZ_AX){const o=ans[a.id]; if(o==null) continue; const wi=imp[a.id]||2; const v=vals[a.id];
    const prox=Math.max(0,1-Math.abs(v-o)/a.R); s+=wi*prox; w+=wi; rows.push({a,v,o,prox,wi});}
  return {score:w?s/w:null,rows,w};
}
function qzRank(vals,ans,imp){
  return Object.keys(vals).map(id=>Object.assign({id},qzScore(vals[id],ans,imp))).filter(x=>x.score!=null).sort((x,y)=>y.score-x.score);
}
function qzShuffle(n){const a=[...Array(n).keys()]; if(window.__qzNoShuffle) return a; for(let i=n-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a;}
function qzEsc(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}
function qzRender(){
  const box=document.getElementById("quizBox"); if(!box) return;
  if(!LASTRES){box.innerHTML='<p class="help">Chargement du simulateur…</p>'; return;}
  const n=QZ_AX.length;
  if(QZ.i<0){
    box.innerHTML=`<div class="qz-intro"><h2>Quel programme vous ressemble ?</h2>
      <p>${n} questions, environ 3 minutes. Pour chaque sujet, vous choisissez ce qui vous paraît juste et l'importance que vous lui donnez. Le quiz vous montre ensuite les trois programmes les plus proches de vos réponses, avec ce que le simulateur projette pour eux.</p>
      <ul class="qz-list">
        <li><strong>Mêmes règles pour tous.</strong> Les positions viennent des mêmes données pour chaque candidat, pas d'un jugement.</li>
        <li><strong>Rien n'est enregistré ni envoyé.</strong> Vos réponses restent dans cette page.</li>
        <li><strong>Ce n'est pas une consigne de vote.</strong> Le quiz ne couvre que ces ${n} sujets chiffrés : ni la sécurité, ni la justice, ni l'Europe, ni la laïcité, ni les institutions.</li>
      </ul><button class="btn-primary" id="qzStart" type="button">Commencer</button></div>`;
    document.getElementById("qzStart").onclick=()=>{QZ={i:0,ans:{},imp:{},order:QZ_AX.map(a=>qzShuffle(a.opts.length))};qzRender();window.scrollTo({top:0});};
    return;
  }
  if(QZ.i>=n) return qzResult(box);
  const a=QZ_AX[QZ.i], vals=qzValues(), cur=QZ.ans[a.id], imp=QZ.imp[a.id]||2, ord=QZ.order[QZ.i];
  const opts=ord.map(k=>a.opts[k]);
  box.innerHTML=`<div class="qz-q"><div class="qz-prog" role="progressbar" aria-valuemin="1" aria-valuemax="${n}" aria-valuenow="${QZ.i+1}" aria-label="Question ${QZ.i+1} sur ${n}"><i style="width:${Math.round((QZ.i+1)/n*100)}%"></i></div>
    <p class="qz-step">Question ${QZ.i+1} sur ${n} · ${qzEsc(a.name)}</p>
    <fieldset class="qz-fs"><legend>${qzEsc(a.q)}</legend><p class="help">${qzEsc(a.hint)}</p>
    ${opts.map(([lab,v],k)=>{const id=`qz-${a.id}-${k}`; const num=a.id==="ret"?"":"≈ "+a.fmt(v); return `<label class="qz-opt" for="${id}"><input type="radio" name="qz-${a.id}" id="${id}" value="${v}"${cur===v?" checked":""}><span><strong>${qzEsc(lab)}</strong>${num?`<small>${qzEsc(num)}</small>`:""}</span></label>`;}).join("")}
    <label class="qz-opt qz-skip" for="qz-${a.id}-none"><input type="radio" name="qz-${a.id}" id="qz-${a.id}-none" value="none"${QZ.ans[a.id]===null?" checked":""}><span><strong>Sans avis sur ce sujet</strong><small>Il ne comptera pas dans le résultat</small></span></label></fieldset>
    <div class="qz-imp" id="qzImp"><span>Ce sujet compte pour moi :</span><div class="seg" role="group" aria-label="Importance du sujet">${QZ_IMP.map(([l,w])=>`<button type="button" data-w="${w}" aria-pressed="${imp===w}">${l}</button>`).join("")}</div></div>
    <div class="qz-nav"><button type="button" class="btn-ghost" id="qzBack">${QZ.i?"Précédent":"Retour"}</button><button type="button" class="btn-primary" id="qzNext"${cur===undefined?" disabled":""}>${QZ.i===n-1?"Voir mon résultat":"Suivant"}</button></div></div>`;
  box.querySelectorAll('input[type=radio]').forEach(r=>r.onchange=()=>{QZ.ans[a.id]=r.value==="none"?null:parseFloat(r.value); document.getElementById("qzNext").disabled=false; document.getElementById("qzImp").hidden=r.value==="none";});
  document.getElementById("qzImp").hidden=QZ.ans[a.id]===null;
  box.querySelectorAll("#qzImp button").forEach(b=>b.onclick=()=>{QZ.imp[a.id]=+b.dataset.w; box.querySelectorAll("#qzImp button").forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));});
  document.getElementById("qzBack").onclick=()=>{QZ.i--; qzRender();};
  document.getElementById("qzNext").onclick=()=>{QZ.i++; qzRender(); window.scrollTo({top:0});};
}
function qzProj(id){
  const m=MC&&MC.rows&&MC.rows.find(x=>x.p.id===id); if(!m) return '<p class="help">Projection en cours de calcul…</p>';
  const f=(a,d=0,u="")=>`${fmt(a[1],d)}${u} <span class="rng">${fmt(a[0],d)} – ${fmt(a[2],d)}</span>`;
  const sq=LASTRES.find(x=>x.p.id==="statu").r, r=LASTRES.find(x=>x.p.id===id).r, g=k=>qzSig((r.pa[k][7]/sq.pa[k][7]-1)*100,1)+" %";
  return `<dl class="qz-proj"><dt>Risque de crise de la dette d'ici 2046</dt><dd>${Math.round(m.cr*100)} %</dd><dt>Pauvreté en 2032</dt><dd>${f(m.pov,1," %")}</dd><dt>Dette publique en 2036</dt><dd>${f(m.debt,0," % du PIB")}</dd><dt>Pouvoir d'achat 2032 : modestes · classes moyennes · aisés</dt><dd>${g("mod")} · ${g("moy")} · ${g("ais")}</dd></dl>`;
}
function qzResult(box){
  const vals=qzValues(), rk=qzRank(vals,QZ.ans,QZ.imp);
  if(!rk.length){box.innerHTML='<p>Vous n\'avez répondu à aucune question : le quiz n\'a rien à comparer.</p><button class="btn-primary" id="qzAgain" type="button">Recommencer</button>'; document.getElementById("qzAgain").onclick=()=>{QZ={i:-1,ans:{},imp:{},order:null};qzRender();}; return;}
  const names=Object.fromEntries(qzCands().map(({p})=>[p.id,p]));
  const card=(x,k)=>{const p=names[x.id]; const nm=p.name.replace(/ \(.*/,""), party=(p.name.match(/\((.*)\)/)||[])[1]||""; const tie=rk[k+1]&&rk[k].score-rk[k+1].score<0.02?"quasi à égalité avec le suivant":"";
    const dots=pr=>"●".repeat(Math.round(pr*4))+"○".repeat(4-Math.round(pr*4));
    return `<article class="qz-card" style="--c:var(${p.color})"><header><span class="qz-rk">${k+1}</span><h3>${qzEsc(nm)} <small>${qzEsc(party)}</small></h3><span class="qz-pct">${Math.round(x.score*100)} %<small>de proximité</small></span></header>
      ${tie?`<p class="help">${tie}</p>`:""}${QZ_NOCOMPLETE[x.id]?`<p class="help qz-warn">Attention : ${QZ_NOCOMPLETE[x.id]}.</p>`:""}
      <table class="qz-tab"><thead><tr><th>Sujet</th><th>Votre choix</th><th>Le programme</th><th>Accord</th></tr></thead><tbody>${x.rows.map(r=>`<tr><td>${qzEsc(r.a.name)}${r.wi===3?" <em>décisif</em>":""}</td><td>${qzEsc(r.a.fmt(r.o))}</td><td>${qzEsc(r.a.fmt(r.v))}</td><td aria-label="${Math.round(r.prox*100)} %"><span class="qz-dots">${dots(r.prox)}</span></td></tr>`).join("")}</tbody></table>
      <h4>Ce que le simulateur projette pour ce programme</h4>${qzProj(x.id)}
      <button type="button" class="btn-ghost qz-fiche" data-id="${x.id}">Voir la fiche détaillée</button></article>`;};
  box.innerHTML=`<div class="qz-res"><h2>Les programmes les plus proches de vos réponses</h2>
    <p class="help">Sur ${rk[0].rows.length} sujet${rk[0].rows.length>1?"s":""} sur ${QZ_AX.length}. Proximité = accord moyen avec votre choix, pondéré par l'importance que vous avez donnée à chaque sujet.</p>
    <div class="qz-cards">${rk.slice(0,3).map((x,k)=>card(x,k)).join("")}</div>
    ${rk.length>3?`<details class="qz-more"><summary>Voir les autres programmes (${rk.length-3})</summary><div class="qz-cards">${rk.slice(3).map((x,k)=>card(x,k+3)).join("")}</div></details>`:""}
    <div class="panel info qz-caveat"><p><strong>À garder en tête.</strong> Ce quiz compare vos choix à des chiffres, sur ${QZ_AX.length} sujets seulement. Il ne couvre ni la sécurité, ni la justice, ni l'Europe, ni la laïcité, ni les institutions, ni les valeurs, ni la personnalité des candidats. Un programme peut vous convenir sur ces sujets et pas sur les autres. Les projections sont des simulations avec leur incertitude, pas des prévisions, et ce n'est pas un conseil de vote.</p>
    <details><summary>Comment c'est calculé</summary><p class="help">Pour chaque sujet, la position d'un programme est une valeur chiffrée tirée de ses mesures (âge de départ, dépenses supplémentaires, effet sur les revenus, etc.). Votre réponse correspond à une valeur sur la même échelle. La proximité vaut 1 moins l'écart entre les deux, divisé par l'étendue de l'échelle. Le score d'un programme est la moyenne de ces proximités, pondérée par l'importance (un peu = 1, beaucoup = 2, décisif = 3). L'ordre des réponses change à chaque passage pour qu'il n'influence pas vos choix. Les effets sur les revenus suivent vos réglages actuels du simulateur (par défaut : chiffrage crédible, lecture centrale).</p></details></div>
    <div class="qz-nav"><button type="button" class="btn-ghost" id="qzAgain">Recommencer</button><button type="button" class="btn-ghost" id="qzEdit">Modifier mes réponses</button></div></div>`;
  document.getElementById("qzAgain").onclick=()=>{QZ={i:-1,ans:{},imp:{},order:null};qzRender();window.scrollTo({top:0});};
  document.getElementById("qzEdit").onclick=()=>{QZ.i=0;qzRender();window.scrollTo({top:0});};
  box.querySelectorAll(".qz-fiche").forEach(b=>b.onclick=()=>{showView("cands"); const d=document.getElementById("fiche-"+b.dataset.id); if(d){d.open=true;setTimeout(()=>d.scrollIntoView({block:"start"}),50);}});
}
document.addEventListener("click",e=>{const g=e.target.closest&&e.target.closest("[data-go=quiz]"); if(g) setTimeout(qzRender,0);});
if(typeof window!=="undefined"){window.addEventListener("hashchange",()=>{});}
// Rendu initial et à chaque recalcul (les valeurs suivent les réglages) ; on ne touche pas aux questions en cours.
function qzRefresh(){const b=document.getElementById("quizBox"); if(b&&(QZ.i<0||QZ.i>=QZ_AX.length)) qzRender();}
document.addEventListener("DOMContentLoaded",qzRender);
setTimeout(qzRender,0);
