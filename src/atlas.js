// Onglet « Changer les règles du jeu » : atlas des systèmes économiques réels, mêmes indicateurs pour tous
const AT_IND={
 pib:["PIB par habitant","indice, France 2019 = 100","Production par habitant en parité de pouvoir d'achat (estimations harmonisées de Fariss et al., 2022, compilées par V-Dem). Indice : France 2019 = 100.",0],
 vie:["Espérance de vie","ans","Espérance de vie à la naissance (V-Dem, d'après Gapminder et la Banque mondiale).",1],
 mort:["Mortalité des enfants","décès avant 5 ans pour 1 000 naissances","Plus c'est bas, mieux c'est (V-Dem, d'après Gapminder et la Banque mondiale).",1],
 dem:["Démocratie libérale","indice 0-100","Élections libres, libertés, contre-pouvoirs, État de droit (V-Dem, indice de démocratie libérale × 100).",0],
 lib:["Libertés civiles","indice 0-100","Liberté d'expression, d'association, absence de violence d'État (V-Dem × 100).",0],
 egal:["Égalité d'accès","indice 0-100","Accès égal à la santé, à l'éducation et au pouvoir selon le groupe social et le revenu (composante égalitaire V-Dem × 100). Ce n'est pas l'inégalité de revenus, absente de cette version.",0],
 corr:["Corruption","indice 0-100","Corruption politique (V-Dem × 100). Plus c'est bas, mieux c'est.",0],
 co2:["CO2 par habitant","tonnes par an","Émissions territoriales de CO2 (Global Carbon Project, via Our World in Data).",1],
 oil:["Rente pétrolière","dollars par habitant et par an","Revenus du pétrole par habitant (Ross et Mahdavi, via V-Dem), jusqu'en 2014 environ : un contexte, pas un système.",0]};
const AT_FAM=[
 ["Social-démocratie",["se","dk","no","fi"]],["Économie sociale de marché",["de","at"]],["Libéralisme",["us","uk","cl"]],
 ["Planification soviétique",["su","ddr","pl","cz"]],["Autogestion",["yu"]],["Capitalisme d'État",["cn","vn","sg"]],
 ["Gauches d'Amérique latine",["ve","bo","uy","cu"]],["Autres repères",["jp","pt","cr","kr","kp","co","ar"]]];
const AT_PAIRS=[
 ["L'Allemagne coupée en deux","de","ddr",[1950,1970,1989],"Même peuple, même langue, même niveau industriel en 1945, deux systèmes pendant quarante ans. En 1989, la RDA produit environ la moitié de la RFA par habitant selon ces estimations (le tiers selon les mesures de productivité faites à la réunification). L'espérance de vie de la RDA n'est pas dans la base ; les études démographiques la placent environ deux ans sous celle de l'Ouest à la fin des années 1980.","Les deux ont reçu de l'aide de leur protecteur, mais l'URSS a prélevé des réparations sur l'Est quand l'Ouest recevait le plan Marshall : une partie de l'écart de départ ne vient pas du système."],
 ["Les deux Corées","kr","kp",[1950,1978,2000,2019],"Le Nord hérite de l'essentiel de l'industrie lourde de la colonisation japonaise ; selon certaines estimations, il est aussi riche que le Sud jusqu'aux années 1960. Celles-ci le placent déjà environ deux fois plus pauvre, et l'écart se creuse après 1978 : en 2019, le Sud produit 20 à 25 fois plus par habitant. La famine des années 1990 fait reculer l'espérance de vie au Nord.","La Corée du Sud n'était pas une démocratie libérale avant 1987 : son décollage s'est fait sous une dictature, avec une planification industrielle forte. Ce qui sépare les deux Corées n'est pas « marché contre État », mais économie ouverte et dirigée contre autarcie totale."],
 ["Autriche et Tchécoslovaquie","at","cz",[1950,1970,1989,2019],"Deux pays de l'ancien empire austro-hongrois, de niveau comparable en 1950. En 1989, l'Autriche produit 1,7 fois plus par habitant ; trente ans après la transition, l'écart s'est réduit de moitié.","La Tchécoslovaquie était déjà industrialisée en 1945 : c'est l'un des tests les plus propres de l'effet du système sur la croissance."],
 ["Cuba et Costa Rica","cu","cr",[1950,1989,2000,2019],"Partis du même niveau de production en 1950, Cuba en 1959 et le Costa Rica en 1948 font deux choix : révolution socialiste d'un côté, démocratie sans armée et sécurité sociale universelle de l'autre. En 2019, le Costa Rica produit presque deux fois plus par habitant, avec une espérance de vie un peu plus haute ; Cuba garde une mortalité infantile plus basse, et l'un des meilleurs systèmes de santé de sa région.","Cuba subit un embargo américain depuis 1962 et a perdu en 1991 les subventions soviétiques (la « période spéciale » : environ un tiers du PIB perdu en quatre ans)."],
 ["Venezuela et Colombie","ve","co",[1978,2000,2013,2019],"Le Venezuela, plus riche que la Colombie pendant tout le XXe siècle grâce au pétrole, passe sous elle après 2014 : effondrement d'environ trois quarts de la production entre 2013 et 2020, hyperinflation, près de 8 millions de personnes parties (ONU). L'espérance de vie recule, la mortalité des enfants remonte.","La chute du pétrole en 2014 et les sanctions américaines à partir de 2017 y ont contribué ; mais la Colombie, autre producteur de pétrole frappé par la même baisse des prix, n'a pas connu d'effondrement."],
 ["La Chine avant et après 1978","cn","cn",[1960,1978,2000,2019],"Avant 1978 : planification et collectivisation, avec la famine du Grand Bond en avant (des dizaines de millions de morts, 1959-1961). Après 1978 : ouverture au marché sous le contrôle du parti. La production par habitant est multipliée par près de dix, 800 millions de personnes sortent de l'extrême pauvreté (Banque mondiale), l'espérance de vie gagne quatorze ans. En même temps, l'égalité d'accès recule et la démocratie reste nulle.","Les progrès de la santé et de l'alphabétisation avant 1978 ont préparé le décollage ; et la Chine part de très bas, ce qui rend la croissance rapide plus facile."]];
let atSel=["fr","se","us","su","cn"], atInd="pib", atChart=null;
const atName=k=>ATLAS.c[k].n;
const atVal=(k,ind,y)=>{const a=ATLAS.c[k][ind]; if(!a) return null; for(let j=y-ATLAS.y0;j>=Math.max(0,y-ATLAS.y0-3);j--){if(a[j]!=null) return a[j];} return null;};
function atDraw(){
  const [lab,unit,help,dec]=AT_IND[atInd], ys=[]; for(let y=ATLAS.y0;y<=2025;y++) ys.push(y);
  const pal=["--ink","--c1","--c2","--c3","--c4","--c5","--c6","--c7","--c0"];
  const ds=atSel.map((k,i)=>({label:atName(k),data:ATLAS.c[k][atInd].map(v=>v),borderColor:css(pal[i%pal.length]),backgroundColor:css(pal[i%pal.length]),borderWidth:k==="fr"?3:2,pointRadius:0,spanGaps:false}));
  if(atChart) atChart.destroy();
  atChart=new Chart(document.getElementById("atChart"),{type:"line",data:{labels:ys,datasets:ds},options:{responsive:true,maintainAspectRatio:false,animation:false,interaction:{mode:"index",intersect:false},plugins:{legend:{position:"bottom",labels:{color:css("--muted"),boxWidth:12}},tooltip:{callbacks:{label:c=>`${c.dataset.label} : ${c.parsed.y==null?"–":fmt(c.parsed.y,dec)} ${unit.startsWith("indice")?"":unit}`}}},scales:{x:{ticks:{color:css("--muted"),maxTicksLimit:10},grid:{color:css("--line")}},y:{title:{display:true,text:lab+" ("+unit+")",color:css("--muted")},ticks:{color:css("--muted")},grid:{color:css("--line")}}}}});
  document.getElementById("atHelp").textContent=help;
}
function atChips(){
  const box=document.getElementById("atChips");
  box.innerHTML=AT_FAM.map(([f,ks])=>`<div class="atfam"><span class="atfl">${f}</span>${ks.map(k=>`<button type="button" class="chip" data-at="${k}" aria-pressed="${atSel.includes(k)}">${atName(k)}</button>`).join("")}</div>`).join("");
  box.querySelectorAll("[data-at]").forEach(b=>b.onclick=()=>{const k=b.dataset.at; if(atSel.includes(k)) atSel=atSel.filter(x=>x!==k); else {if(atSel.length>=8) atSel.splice(1,1); atSel.push(k);} if(!atSel.includes("fr")) atSel.unshift("fr"); atChips(); atDraw();});
}
function atPairs(){
  const ind=["pib","vie","mort","dem","egal"], f=(v,d)=>v==null?"–":fmt(v,d);
  document.getElementById("atPairs").innerHTML=AT_PAIRS.map(([t,a,b,yrs,txt,ctx])=>{
    const rows=ind.map(i=>`<tr><td>${AT_IND[i][0]}</td>${yrs.map(y=>a===b?`<td>${f(atVal(a,i,y),AT_IND[i][3])}</td>`:`<td>${f(atVal(a,i,y),AT_IND[i][3])} <span class="atvs">/</span> ${f(atVal(b,i,y),AT_IND[i][3])}</td>`).join("")}</tr>`).join("");
    return `<article class="atcard"><h3>${t}</h3><p class="help">${a===b?atName(a):atName(a)+" / "+atName(b)}</p><div class="tablewrap"><table class="mini"><thead><tr><th></th>${yrs.map(y=>`<th>${y}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table></div><p>${txt}</p><p class="help"><b>Ce qui ne vient pas du système :</b> ${ctx}</p></article>`;}).join("");
}
let atBuilt=false;
function buildAtlas(){
  if(!atBuilt){atBuilt=true; atChips(); atPairs();
    document.getElementById("atInd").innerHTML=Object.entries(AT_IND).map(([k,v])=>`<button type="button" data-ai="${k}" aria-pressed="${k===atInd}">${v[0]}</button>`).join("");
    document.querySelectorAll("[data-ai]").forEach(b=>b.onclick=()=>{atInd=b.dataset.ai; document.querySelectorAll("[data-ai]").forEach(x=>x.setAttribute("aria-pressed",x.dataset.ai===atInd)); atDraw();});}
  for(const f of [atDraw,buildAnalog,buildPolit,buildPSI,buildUS,buildDef,defDraw]){ try{ f(); }catch(e){ console.error(e); } } // une partie qui échoue (graphique non chargé, par exemple) ne vide pas le reste de la page
}

// Projection par analogies historiques
const AN_OUT={rupture:["Rupture (bascule en autocratie)","worse"],erosion:["Érosion forte (indice −0,10 ou plus)","worse"],recul:["Recul modéré (−0,05 à −0,10)",""],stable:["Démocratie stable",""],renforcement:["Renforcement (+0,05 ou plus)","better"]};
const AN_PROF=[["v2x_libdem","Démocratie libérale (0-1)",2],["v2cacamps","Polarisation politique",2],["pol5","… dont hausse en cinq ans",2],["mob3","Mobilisation de masse (pic sur trois ans)",2],["v2caviol","Violence politique",2],["v2x_civlib","Libertés civiles (0-1)",2],["v2xlg_legcon","Contrôle du Parlement sur l'exécutif (0-1)",2],["v2x_jucon","Contrôle des juges sur l'exécutif (0-1)",2]];
let anBuilt=false;
function buildAnalog(){
  if(anBuilt) return; anBuilt=true; const R=ANALOG, pc=v=>fmt(v*100,0)+" %";
  const bad=R.dist.erosion+R.dist.rupture, bad10=R.dist10.erosion+R.dist10.rupture, sv=Object.values(R.sens), sv10=Object.values(R.sens10);
  document.getElementById("anHead").innerHTML=`<div class="anbig"><b>${fmt(bad10*100,0)} %</b><span><b>Risque d'érosion forte d'ici 2035</b> (deux présidentielles). Fourchette ${fmt(Math.min(...sv10),0)} à ${fmt(Math.max(...sv10),0)} %. Pour une démocratie établie au hasard : ${fmt(R.valid10.base*100,0)} %.</span></div><div class="anbig"><b>${fmt(bad*100,0)} %</b><span><b>Risque d'ici 2030.</b> Fourchette ${fmt(Math.min(...sv),0)} à ${fmt(Math.max(...sv),0)} %. Démocratie établie au hasard : ${fmt(R.valid.base*100,0)} %. Bascule en autocratie : aucun cas à cinq ans, 8 % à dix ans.</span></div>`;
  document.getElementById("anDist").innerHTML=`<tr><th></th><th>5 ans</th><th>10 ans</th></tr>`+Object.entries(AN_OUT).map(([k,[l,c]])=>`<tr><td>${l}</td><td class="${c}">${pc(R.dist[k])}</td><td class="${c}">${pc(R.dist10[k])}</td></tr>`).join("");
  document.getElementById("anProf").innerHTML=AN_PROF.map(([k,l,d])=>`<tr><td>${l}</td><td>${fmt(R.profil[k],d)}</td></tr>`).join("");
  const oc=o=>`<span class="${AN_OUT[o][1]}">${AN_OUT[o][0].split(" (")[0]}</span>`;
  document.getElementById("anList").innerHTML=R.analogs.map(a=>`<tr><td><b>${a.n} ${a.year}</b><span class="rng">${a.note}</span></td><td>${fmt(a.w*100,1)} %</td><td>${oc(a.out)}</td><td>${oc(a.out10)}${a.hor<10?`<span class="rng">${a.hor} ans observés</span>`:""}</td><td>${a.ld_min10<0?"−":"+"}${fmt(Math.abs(a.ld_min10),2)}</td></tr>`).join("");
  document.getElementById("anScen").innerHTML=Object.entries(R.scen).map(([k,[v,,v10]])=>`<tr><td>${k}</td><td>${fmt(v,0)} %</td><td>${fmt(v10,0)} %</td></tr>`).join("");
  document.getElementById("anScen").innerHTML+=Object.entries(R.autumn).map(([k,[v,v10]])=>`<tr><td><i>${k}</i></td><td>${fmt(v,0)} %</td><td>${fmt(v10,0)} %</td></tr>`).join("");
  const sg=v=>(v<0?"−":v>0?"+":"")+fmt(Math.abs(v),2);
  document.getElementById("anCrisis").innerHTML=R.rights.map(([k,c,d,e,a,x,g])=>`<tr><td><b>${k}</b><span class="rng">${g}</span></td><td>${c} %</td><td class="${d<=-0.1?"worse":d>0?"better":""}">${sg(d)}</td><td>${fmt(e,0)} %</td><td class="${a>=99?"worse":""}">${a>=99?"atteinte":fmt(a,0)+" %"}</td><td>${sg(x)}</td></tr>`).join("");
  const GZO={"Népal (2025)":"Gouvernement renversé, Parlement incendié, 77 morts ; élections en mars 2026, gagnées par un nouveau parti, Balendra Shah Premier ministre","Madagascar (2025)":"Président en fuite, l'armée prend le pouvoir","Maroc (2025)":"Promesses de réformes de la santé et de l'école ; plus de 2 400 personnes poursuivies","Kenya (2024)":"Loi de finances retirée ; répression meurtrière","Bangladesh (2024)":"La Première ministre fuit le pays ; gouvernement intérimaire, puis élections en février 2026 (Tarique Rahman, BNP, Premier ministre)","Sri Lanka (2022)":"Faillite de l'État, le président fuit ; plan du FMI","Indonésie (2025)":"Avantages des députés supprimés ; émeutes","Pérou (2025)":"Présidente destituée par le Congrès","Serbie (2024-2025)":"Le Premier ministre démissionne ; mouvement étudiant durable","France (2026)":"En cours"};
  document.getElementById("anGenz").innerHTML=R.genz.map(([k,l,pl,m,v])=>`<tr${k.startsWith("France")?' class="me"':""}><td><b>${k}</b><span class="rng">${GZO[k]||""}</span></td><td>${fmt(l,2)}</td><td>${fmt(pl,1)}</td><td>${fmt(m,1)}</td></tr>`).join("");
  const cal=V=>V.cal.map(([b,n,p,o])=>`<tr><td>${b}</td><td>${n}</td><td>${pc(p)}</td><td>${pc(o)}</td></tr>`).join("");
  document.getElementById("anValid").innerHTML=`<tr><th colspan="4">Horizon 5 ans (${R.valid.n} situations, AUC ${fmt(R.valid.auc,2)})</th></tr>`+cal(R.valid)+`<tr><th colspan="4">Horizon 10 ans (${R.valid10.n} situations, AUC ${fmt(R.valid10.auc,2)})</th></tr>`+cal(R.valid10);
}
// Répercussions politiques : probabilités historiques appliquées aux trajectoires de chaque tirage du simulateur
// Mobilisation : logit estimé sur les démocraties 1900-2015 (V-Dem) ; vote : élections législatives 1906-2020 (ParlGov) ; voir POLIT
function politMC(PD,q){
  const st=PD.statu; if(!st||!st.g5.length) return null;
  const R=rng(1789), gauss=()=>Math.sqrt(-2*Math.log(R()+1e-12))*Math.cos(2*Math.PI*R()), N=st.g5.length, S=POLIT.start, SC=PD._scen||[];
  const z0=m=>m.b[0]+m.X.slice(0,-1).reduce((s,x,i)=>s+m.b[i+1]*S[x],0), bg=m=>m.b[m.b.length-1], sig=z=>1/(1+Math.exp(-z));
  const zm=z0(POLIT.mob), zv=z0(POLIT.viol), cf=[], kPV=POLIT.pv.ols/POLIT.pv.mean; // coupes : +9 % de troubles par point de PIB de baisse des dépenses (Ponticelli et Voth, croissance contrôlée)
  for(let n=0;n<N;n++) cf.push({m:bg(POLIT.mob)+POLIT.mob.seG*gauss(),v:bg(POLIT.viol)+POLIT.viol.seG*gauss(),rg:POLIT.rr.b.gavg+POLIT.rr.se.gavg*gauss(),ri:POLIT.rr.b.isurp+POLIT.rr.se.isurp*gauss(),fg:POLIT.fl.b.gavg+POLIT.fl.se.gavg*gauss(),fi:POLIT.fl.b.isurp+POLIT.fl.se.isurp*gauss(),rb:POLIT.bank.v.b+POLIT.bank.v.se*gauss()}); // incertitude sur les coefficients : un tirage par tirage du simulateur, commun à tous les programmes
  const withCuts=(p5,cuts)=>{const h=1-Math.pow(1-p5,1/5); return 1-cuts.reduce((s,c)=>s*(1-Math.min(1,h*(1+kPV*c))),1);}; // probabilité sur cinq ans → risque annuel, augmenté les années de coupes
  const mob=id=>PD[id].g5.map((g,n)=>withCuts(sig(zm+cf[n].m*g),PD[id].cut[n])), mobG=id=>PD[id].g5.map((g,n)=>sig(zm+cf[n].m*g)), viol=id=>PD[id].g5.map((g,n)=>sig(zv+cf[n].v*g));
  const m0=mob("statu"), av=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:null, Q=a=>[q(a,0.1),q(a,0.5),q(a,0.9)];
  const out={viol0:av(viol("statu")),mob0:av(m0),n:N,rows:{}}, wc=[], nc=[], M={};
  for(const id in PD){ if(id==="_scen") continue; const d=PD[id], m=M[id]=mob(id), mg=mobG(id); if(id!=="ia"&&id!=="gov") m.forEach((v,n)=>(d.cr[n]?wc:nc).push(v));
    const conR=d.ra.filter((_,n)=>SC[n]&&SC[n].energy==="contrainte");
    out.rows[id]={mob:av(m),mobR:Q(m),dmob:Q(m.map((v,n)=>100*(v-m0[n]))),dmobM:100*(av(m)-av(m0)),cutPts:100*(av(m)-av(mg)),cutMax:q(d.cut.map(c=>Math.max(...c)),0.5),
      rr:Q(d.gv.map((g,n)=>cf[n].rg*(g-st.gv[n])+cf[n].ri*(d.iv[n]-st.iv[n])+cf[n].rb*(d.cr[n]-st.cr[n]))), // crise avant 2032 traitée comme une crise financière pendant la législature (Reinhart-Rogoff, Laeven-Valencia)
      fl:Q(d.gv.map((g,n)=>cf[n].fg*(g-st.gv[n])+cf[n].fi*(d.iv[n]-st.iv[n]))),
      g5:q(d.g5,0.5),iv:q(d.iv,0.5),cr:av(d.cr),c36:av(d.c36),viol:av(viol(id)),rec:av(d.rec),hinf:av(d.hinf),bill:av(d.bill),ra5:av(d.ra.map(v=>v>=5?1:0)),raC:conR.length?q(conR,0.5):null};}
  out.withCr=wc.length?av(wc):null; out.noCr=nc.length?av(nc):null; out.nCr=wc.length;
  return out;
}
function polEro(base,pcr){ // risque d'érosion forte d'ici 2035 : mélange sans crise / avec crise (une chute du PIB de 5 % double les chances, OR 2,1), calé pour que la moyenne historique (3,2 % de crises) redonne le risque de base
  const E=POLIT.ero; if(base>=0.999) return 1; const pc=pn=>{const o=E.or*pn/(1-pn);return o/(1+o);};
  let lo=1e-5,hi=0.9999; for(let i=0;i<60;i++){const m=(lo+hi)/2; ((1-E.p0)*m+E.p0*pc(m)>base)?hi=m:lo=m;} const pn=(lo+hi)/2; return pcr*pc(pn)+(1-pcr)*pn;
}
function polMob(r){ // trajectoire d'un programme → probabilité d'une grande mobilisation d'ici 2032 (coefficients centraux, coupes comprises)
  const m=POLIT.mob, S=POLIT.start, k=POLIT.pv.ols/POLIT.pv.mean, yi=y=>y-START, Y=[2027,2028,2029,2030,2031];
  const g5=Y.reduce((s,y)=>s+r.growth[yi(y)],0)/5, z=m.b[0]+m.X.slice(0,-1).reduce((s,x,i)=>s+m.b[i+1]*S[x],0)+m.b[m.b.length-1]*g5, p5=1/(1+Math.exp(-z)), h=1-Math.pow(1-p5,1/5);
  return {g5,p:1-Y.reduce((s,y)=>s*(1-Math.min(1,h*(1+k*Math.max(0,r.dep[yi(y-1)]-r.dep[yi(y)])))),1)};
}
function buildPolit(){
  const tb=document.getElementById("polTab"); if(!tb) return; const P=POLIT, pc=v=>fmt(v*100,0)+" %", sg=(v,d=1)=>{const k=10**d, r=Math.round(v*k)/k; return (r<0?"−":r>0?"+":"")+fmt(Math.abs(r),d);};
  const M=MC&&MC.pol; const W=P.world;
  document.getElementById("polHead").innerHTML=M?`<div class="anbig"><b>${fmt(M.mob0*100,0)} %</b><span><b>Grande mobilisation d'ici 2032</b> (gilets jaunes ou plus), sans changement de politique. Démocratie au hasard : ${pc(P.mob.rate)}. En cause : mobilisation et polarisation déjà très hautes.</span></div><div class="anbig"><b>${fmt(M.viol0*100,0)} %</b><span><b>Violence politique forte d'ici 2032</b> (niveau de 1934 ou de 2021). Démocratie au hasard : ${pc(P.viol.rate)}. Même risque pour tous : depuis 1945, ni l'économie ni la couleur du gouvernement ne l'ont fait varier à point de départ égal.</span></div><div class="anbig"><b>${fmt(W.rrNow,1)} %</b><span><b>Vote moyen pour la droite radicale</b> dans ${W.n} démocraties (dernières législatives, jusqu'en ${W.rrDate.slice(0,4)}), contre ${fmt(W.dec[1950],1)} % dans les années 1950.</span></div>`:`<p class="help">Calcul en cours (200 tirages de chaque programme)…</p>`;
  if(!M){tb.innerHTML=""; return;}
  const rg=(a,d=1,s="")=>`${sg(a[1],d)}${s} <span class="rng">${sg(a[0],d)} à ${sg(a[2],d)}</span>`;
  tb.innerHTML=CANDS.filter(p=>M.rows[p.id]).map(p=>{const x=M.rows[p.id], ref=p.id==="statu";
    return `<tr${ref?' class="me"':""}><td class="name"><span class="sw" style="background:var(${p.color})"></span>${p.name}</td><td>${fmt(x.g5,2)} %</td><td class="${x.cr>=0.25?"worse":""}">${pc(x.cr)}</td><td><b>${fmt(x.mob*100,0)} %</b> <span class="rng">${fmt(x.mobR[0]*100,0)} à ${fmt(x.mobR[2]*100,0)} %</span></td><td class="${ref?"":x.dmobM>=1.5?"worse":x.dmobM<=-1.5?"better":""}">${ref?"réf.":rg(x.dmob,1," pt")}</td><td>${ref?"réf.":rg(x.rr,2," pt")}</td><td>${ref?"réf.":rg(x.fl,2," pt")}</td></tr>`;}).join("");
  const top=CANDS.filter(p=>p.id!=="statu"&&M.rows[p.id]).map(p=>[p,M.rows[p.id]]).sort((a,b)=>b[1].dmobM-a[1].dmobM);
  const hi=top[0], lo=top[top.length-1];
  const vmax=Math.max(...top.map(([,x])=>Math.max(Math.abs(x.rr[1]),Math.abs(x.fl[1]))));
  document.getElementById("polRead").innerHTML=`<b>Lecture.</b> Par l'économie, les programmes déplacent la probabilité d'une grande mobilisation de ${sg(lo[1].dmobM,1)} point (${lo[0].name.replace(/ \(.*/,"")}) à ${sg(hi[1].dmobM,1)} point (${hi[0].name.replace(/ \(.*/,"")}) autour de ${fmt(M.mob0*100,0)} % sans changement de politique. Sur le vote pour les partis radicaux, l'effet de la trajectoire économique reste ${vmax<1?"inférieur à un point dans tous les programmes":"limité, au plus "+fmt(vmax,1)+" point"}. ${M.withCr!=null&&M.nCr>=20?`Ce qui pèse le plus, c'est une crise de la dette : dans les tirages où elle survient avant 2032, la probabilité d'une grande mobilisation est de ${fmt(M.withCr*100,0)} %, contre ${fmt(M.noCr*100,0)} % sans crise. `:""}Les coupes budgétaires ajoutent leur propre effet, en plus de la croissance : jusqu'à ${fmt(Math.max(...top.map(([,x])=>x.cutPts)),1)} point selon les programmes. Le point de départ de la France et le contexte mondial comptent davantage que l'écart entre programmes.`;
  // tableau des probabilités, programme par programme
  const pT=document.getElementById("polProb"); if(pT){ const progs=CANDS.filter(p=>p.id!=="ia"&&p.id!=="gov"&&M.rows[p.id]), mc=id=>MC.rows.find(x=>x.p.id===id), H=P.hist["France 1950-2020"], E=P.ero.app;
    const ero=(id,k)=>{const b=(E[id]||E.statu)[k]; return b>=0.999?null:polEro(b,M.rows[id].c36);};
    const L=[["Économie et dette"],
      ["Récession (une année de baisse du PIB au moins) d'ici 2032",id=>M.rows[id].rec,`France 1950-2020 : ${pc(H.rec)} des périodes de six ans`],
      ["Inflation au-dessus de 5&nbsp;% une année d'ici 2032",id=>M.rows[id].hinf,`France 1950-2020 : ${pc(H.inf5)} (surtout avant 1986, puis 2022)`],
      ["Crise de la dette avant 2032",id=>M.rows[id].cr,"Grèce, Irlande, Portugal 2010-2011 ; Espagne et Italie sous tension en 2012"],
      ["Crise de la dette d'ici 2046",id=>(mc(id)||{}).cr,"Hypothèses : section « Comprendre la dette »"],
      ["Énergie et alimentation"],
      ["Facture énergétique au moins doublée par rapport à 2025, une année d'ici 2040",id=>M.rows[id].bill,"2022 : 116 Md€, deux fois et demie 2025"],
      ["Rationnement du pétrole d'ici 2040 (5&nbsp;% de la demande ou plus non servie)",id=>M.rows[id].ra5,`Pétrole : ${fmt(P.energy.hist.find(x=>x[0]===2024)[1],0)} % de l'énergie primaire en 2024, contre ${fmt(P.energy.hist.find(x=>x[0]===1973)[1],0)} % en 1973. Derniers tickets d'essence : décembre 1949`],
      ["Pénurie alimentaire",()=>null,"Non calculée : voir la note sous le tableau"],
      ["Politique et démocratie"],
      ["Grande mobilisation (gilets jaunes ou plus) d'ici 2032",id=>M.rows[id].mob,`Démocratie au hasard : ${pc(P.mob.rate)} sur cinq ans. En comptant la hausse de la concentration du pouvoir économique relevée par V-Dem en 2020 : environ ${pc(P.ineq.sens[1])} (lecture de sensibilité, voir « Climat, crises, inégalités »)`],
      ["Violence politique forte d'ici 2032",id=>M.rows[id].viol,`Même niveau pour tous : depuis 1945, ni la croissance ni l'arrivée de la droite ou de la gauche radicale au gouvernement ne l'ont fait bouger, à point de départ égal (voir « Qui gouverne »). Démocratie au hasard : ${pc(P.viol.rate)}`],
      ["Érosion forte de la démocratie d'ici 2035, mesures bloquées",id=>ero(id,0),`Démocratie établie au hasard : ${pc(ANALOG.valid10.base)}`],
      ["… mesures appliquées telles qu'annoncées",id=>ero(id,1)===null?1:ero(id,1),"Seuil franchi par les seules mesures : 100 %"]];
    pT.innerHTML=`<thead><tr><th>Risque <span class="rng">et repère historique</span></th>${progs.map(p=>`<th><span class="sw" style="background:var(${p.color})"></span>${p.id==="statu"?"Statu quo":p.name.replace(/ \(.*/,"")}</th>`).join("")}</tr></thead><tbody>`+
      L.map(([l,f,h])=>!f?`<tr><th colspan="${progs.length+1}" style="text-align:left;padding-top:12px">${l}</th></tr>`:`<tr><td>${l}<span class="rng">${h}</span></td>${progs.map(p=>{const v=f(p.id); return `<td class="${v==null?"":v>=0.5?"worse":""}">${v==null?"–":(v>=0.995&&l.startsWith("…")?"atteint":pc(v))}</td>`;}).join("")}</tr>`).join("")+"</tbody>";}
  // section 2 : risque d'érosion recalculé avec le risque de crise du simulateur en cours
  const aC=document.getElementById("anCrisis"); if(aC&&typeof ANALOG!=="undefined"){ const ID={"Statu quo":"statu","Mélenchon":"melenchon","Le Pen":"lepen","Philippe":"philippe","Glucksmann":"glucksmann","Retailleau":"retailleau","Attal":"attal","Candidat IA (fictif)":"ia"}, E=P.ero.app, s2=v=>(v<0?"−":v>0?"+":"")+fmt(Math.abs(v),2), vals=[];
    aC.innerHTML=ANALOG.rights.map(([k,c0,d,e0,a0,x,g])=>{const id=ID[k], x2=M.rows[id]; if(!x2) return ""; const c=x2.c36, e=polEro(E[id][0],c), a=E[id][1]>=0.999?1:polEro(E[id][1],c); vals.push(e);
      return `<tr><td><b>${k}</b><span class="rng">${g}</span></td><td>${fmt(c*100,0)} %</td><td class="${d<=-0.1?"worse":d>0?"better":""}">${s2(d)}</td><td>${fmt(e*100,0)} %</td><td class="${a>=0.99?"worse":""}">${a>=0.99?"atteinte":fmt(a*100,0)+" %"}</td><td>${s2(x)}</td></tr>`;}).join("");
    const rg=document.getElementById("anRng"); if(rg&&vals.length) rg.textContent=fmt(Math.min(...vals)*100,0)+" à "+fmt(Math.max(...vals)*100,0)+" %";}
  const raT=document.getElementById("polRa"); if(raT) raT.innerHTML=CANDS.filter(p=>M.rows[p.id]).map(p=>{const x=M.rows[p.id];
    return `<tr${p.id==="statu"?' class="me"':""}><td class="name"><span class="sw" style="background:var(${p.color})"></span>${p.name}</td><td>${fmt(x.cutMax,1)} pt</td><td class="${x.cutPts>=1.5?"worse":""}">${sg(x.cutPts,1)} pt</td><td>${pc(x.ra5)}</td><td>${x.raC==null?"–":fmt(x.raC,0)+" %"}</td></tr>`;}).join("");
  const gT=document.getElementById("polGeo"); if(gT&&typeof simulate==="function"){ // scénarios imposés : chaque crise déclenchée en 2029, pour tous les programmes
    const md=typeof mode!=="undefined"?mode:"credible", yi=y=>y-START, progs=CANDS.filter(p=>p.id!=="ia"&&p.id!=="gov");
    const SCN=[["Aucun choc, pétrole vers 75 $",{}],["Guerre en Europe en 2029",{shock:"guerre",shockYear:2029}],["Flambée du pétrole en 2029 (+45 $, type 2022)",{shock:"petrole",shockYear:2029}],["Guerre commerciale en 2029",{shock:"commerce",shockYear:2029}],["Blocus de Taïwan en 2029",{shock:"taiwan",shockYear:2029}],["Tensions durables sur le pétrole (100 à 105 $)",{energy:"tensions"}],["Offre de pétrole en déclin",{energy:"contrainte"}]];
    let ref=null; gT.innerHTML=SCN.map(([l,o],k)=>{const B=Object.assign({},BASE,{noCrisis:0,shock:"none",shock2:"none",energy:"tendance"},o);
      const res=progs.map(p=>{const r=simulate(p,md,B), m=polMob(r); return {id:p.id,g5:m.g5,p:m.p,cr:r.crisis!==null&&r.crisis<=2036,ra:r.ration[yi(2040)]};});
      const sq=res.find(x=>x.id==="statu"), ps=res.map(x=>x.p), ra=res.map(x=>x.ra), ncr=res.filter(x=>x.cr&&x.id!=="statu").length; if(k===0) ref=sq.p;
      return `<tr${k===0?' class="me"':""}><td>${l}</td><td>${fmt(sq.g5,2)} %</td><td><b>${pc(sq.p)}</b> <span class="rng">programmes : ${pc(Math.min(...ps))} à ${pc(Math.max(...ps))}</span></td><td class="${k&&100*(sq.p-ref)>=1.5?"worse":""}">${k?sg(100*(sq.p-ref),1)+" pt":"réf."}</td><td class="${ncr>=3?"worse":""}">${ncr} sur ${progs.length-1}${sq.cr?" (et le statu quo)":""}</td><td>${Math.max(...ra)<0.5?"aucun":fmt(sq.ra,0)+" % <span class=\"rng\">programmes : "+fmt(Math.min(...ra),0)+" à "+fmt(Math.max(...ra),0)+" %</span>"}</td></tr>`;}).join("");}
  const gv=document.getElementById("polGov"); if(gv){ const R=P.gov.rates, A=P.gov.adj, row=(per,g)=>{const x=R[per+"|"+g]; return `<td>${pc(x[1])} <span class="rng">${x[0]} situations</span></td><td>${pc(x[2])}</td>`;};
    gv.innerHTML=["1900-1939","1946-2015"].map(per=>["droite radicale","gauche radicale","aucune des deux"].map((g,k)=>`<tr${k===2?' class="me"':""}>${k===0?`<td rowspan="3"><b>${per}</b></td>`:""}<td style="text-align:left">${g==="aucune des deux"?"Ni l'une ni l'autre":g==="droite radicale"?"Droite radicale au gouvernement":"Gauche radicale au gouvernement"}</td>${row(per,g)}</tr>`).join("")).join("");
    const f=(k,c)=>{const [b,p]=A[k][c]; return `${b>=0?"+":"−"}${fmt(Math.abs(b),2)} (p = ${fmt(p,2)})`;};
    document.getElementById("polGovAdj").innerHTML=`À point de départ égal (violence et polarisation déjà présentes, démocratie, croissance), l'effet de la droite radicale au gouvernement sur la violence forte est de ${f("1946-2015|y_viol","rr")} après 1945, contre ${f("avant 1940|y_viol","rr")} avant 1940 (logit) ; celui de la gauche radicale, ${f("1946-2015|y_viol","fl")} après 1945. Sur les grandes mobilisations après 1945 : droite radicale ${f("1946-2015|y_mob","rr")}, gauche radicale ${f("1946-2015|y_mob","fl")}.`;}
  const eH=document.getElementById("polEnH"); if(eH){ const EN=P.energy, f1=v=>fmt(v,0)+" %";
    eH.innerHTML=EN.hist.map(([y,o,fo,lc,tw])=>`<tr${y===2024?' class="me"':""}><td>${y}</td><td>${f1(o)}</td><td>${f1(fo)}</td><td>${f1(lc)}</td><td>${fmt(tw,0)} TWh <span class="rng">${fmt(100*tw/EN.peak.twh,0)} % du pic</span></td></tr>`).join("");
    const k=EN.peers.findIndex(x=>x[0]==="France");
    document.getElementById("polEnPeers").innerHTML=`<b>Par rapport aux voisins (2024).</b> Part des énergies fossiles : ${EN.peers.map(([c,o,fo])=>c==="France"?`<b>France ${f1(fo)}</b>`:`${c} ${f1(fo)}`).join(", ")}. La France est ${k+1}e sur ${EN.peers.length}, grâce au nucléaire. Pour le pétrole seul, l'écart se resserre : ${["Suède","France","Allemagne","Italie","Grèce"].map(c=>{const x=EN.peers.find(z=>z[0]===c); return x?c+" "+f1(x[1]):"";}).filter(Boolean).join(", ")}.`;
    const md=typeof mode!=="undefined"?mode:"credible", yi=y=>y-START, base=EN.hist.find(x=>x[0]===2024)[4];
    document.getElementById("polEnProg").innerHTML=CANDS.map(p=>{const r=simulate(p,md,BASE), c0=r.co2[yi(2025)], v=t=>base*r.co2[yi(t)]/c0;
      return `<tr${p.id==="statu"?' class="me"':""}><td class="name"><span class="sw" style="background:var(${p.color})"></span>${p.name}</td><td>${fmt(v(2032),0)} TWh <span class="rng">${fmt(100*v(2032)/EN.peak.twh,0)} % du pic</span></td><td>${fmt(v(2040),0)} TWh <span class="rng">${fmt(100*v(2040)/EN.peak.twh,0)} % du pic</span></td></tr>`;}).join("");}
  document.getElementById("polBack").innerHTML=[...P.frback].sort((a,b)=>a[0]-b[0]).map(([y,p,o,w])=>`<tr><td>${y}</td><td>${pc(p)}</td><td class="${o?"worse":""}">${o?"oui : "+w:w}</td></tr>`).join("");
  document.getElementById("polCal").innerHTML=P.mob.cal.map(([b,n,p,o])=>`<tr><td>${b}</td><td>${n}</td><td>${pc(p)}</td><td>${pc(o)}</td></tr>`).join("");
  document.getElementById("polDec").innerHTML=Object.entries(W.dec).map(([d,v])=>`<tr><td>années ${d}</td><td>${fmt(v,1)} %</td></tr>`).join("");
}

// Indice de tension structurelle, d'après Turchin (Ages of Discord, 2016) : mobilisation populaire × compétition des élites × détresse budgétaire, à partir des séries du simulateur
let psiChart=null;
function psiSeries(r){const I=(a,i)=>a[i]/a[0]; return r.youth.map((_,i)=>{const mmp=I(r.youth,i)*I(r.rent,i)/(r.pa.mod[i]/100), emp=I(r.w10,i), sfd=I(r.burden,i); return {psi:100*mmp*emp*sfd,mmp:100*mmp,emp:100*emp,sfd:100*sfd};});}
function buildPSI(){
  const B=Object.assign({},BASE0,PRESETS.central), ys=[]; for(let y=2025;y<=2046;y++) ys.push(y);
  const pal=["--ink","--c1","--c2","--c3","--c4","--c5","--c6","--c7"], rows=[];
  const ds=CANDS0.map((c,i)=>{const r=simulate(c,"credible",B), S=psiSeries(r); rows.push([c.name,S[7],S[11],r.youth[7],r.burden[7]]);
    return {label:c.name,data:S.map(x=>+x.psi.toFixed(0)),borderColor:css(pal[i%pal.length]),backgroundColor:css(pal[i%pal.length]),borderWidth:c.id==="statu"?3:2,pointRadius:0,borderDash:c.fictif?[2,3]:[]};});
  if(psiChart) psiChart.destroy();
  psiChart=new Chart(document.getElementById("psiChart"),{type:"line",data:{labels:ys,datasets:ds},options:{responsive:true,maintainAspectRatio:false,animation:false,interaction:{mode:"index",intersect:false},plugins:{legend:{position:"bottom",labels:{color:css("--muted"),boxWidth:12}}},scales:{x:{ticks:{color:css("--muted")},grid:{color:css("--line")}},y:{title:{display:true,text:"Indice, 2025 = 100",color:css("--muted")},ticks:{color:css("--muted")},grid:{color:css("--line")}}}}});
  document.getElementById("psiTab").innerHTML=rows.map(([n,a,b,yu,bu])=>`<tr><td>${n}</td><td>${fmt(a.mmp,0)}</td><td>${fmt(a.emp,0)}</td><td>${fmt(a.sfd,0)}</td><td><b>${fmt(a.psi,0)}</b></td><td><b>${fmt(b.psi,0)}</b></td></tr>`).join("");
}

// Programme fictif « modèle américain », recalculé avec les réglages courants
function buildUS(){
  const tb=document.getElementById("usTab"); if(!tb||typeof simulate!=="function") return;
  const st=CANDS0.find(c=>c.id==="statu");
  const pm=[["Minima sociaux et APL réduits",-40,"minima","x","sim"],["Assurance chômage : six mois au plus",-25,"chomage","x","sim"],["Retraites : 67 ans, indexation réduite",-60,"retraites","x","sim"],["Fonction publique : −15 % d'effectifs",-40,"fonction","x","sim"],["Allocations familiales réduites",-10,"tete","x","sim"],["Fin de l'impôt sur la fortune immobilière, revenus du capital à 15 %",40,"capital","x","sim"],["Impôt sur les sociétés à 15 %",40,"entreprises","x","sim"],["Impôt sur le revenu à taux unique",40,"ir","x","sim"]];
  const ms=microsim(pm);
  const us=Object.assign({},st,{id:"usa",paMeasures:pm,pa:ms.pa,paDec:ms.deciles,A:4.5,taxMd:-120,spServ:-2,healthSpend:-1,ageShift:3,uStruct:-0.6,topTax:-1.5,botGain:-3,c:0.5,parl:0.4,adh:0.3,legal:0.6},topFlows(pm));
  const B=Object.assign({},BASE,{noCrisis:0}), md=typeof mode!=="undefined"?mode:"credible";
  const s=simulate(st,md,B), r=simulate(us,md,B), y=t=>t-2025, g=a=>a.slice(2,8).reduce((x,v)=>x+v,0)/6;
  const rows=[["Pauvreté 2032",v=>fmt(v.pov[y(2032)])+" %"],["Inégalités 2032 (indice de Gini)",v=>fmt(v.gini[y(2032)],3)],["Espérance de vie 2032 (écart à 2025)",v=>(v.health[y(2032)]>=0?"+":"−")+fmt(Math.abs(v.health[y(2032)]))+" an"],["Chômage 2032",v=>fmt(v.unemp[y(2032)])+" %"],["Croissance moyenne 2027-2032",v=>fmt(g(v.growth),2)+" %"],["Tension sociale (maximum à partir de 2027)",v=>fmt(Math.max(...v.tension.slice(2)),0)],["Services publics 2032 (% du PIB)",v=>fmt(v.sp[y(2032)])],["Dette 2036",v=>fmt(v.debt[y(2036)],0)+" %"],["Crise de la dette",v=>v.crisis||"aucune avant 2046"]];
  tb.innerHTML=rows.map(([l,f])=>`<tr><td>${l}</td><td style="text-align:right">${f(s)}</td><td style="text-align:right">${f(r)}</td></tr>`).join("");
  const G=[["mod","Ménages modestes"],["jeu","Jeunes 18-29 ans"],["moy","Classes moyennes"],["ret","Retraités"],["ais","Ménages aisés"],["top","10 % les plus riches"]];
  document.getElementById("usPa").innerHTML=G.map(([k,l])=>{const v=(r.pa[k][y(2032)]/s.pa[k][y(2032)]-1)*100;return `<tr><td>${l}</td><td class="${v>=0?"better":"worse"}">${v>=0?"+":"−"}${fmt(Math.abs(v))} %</td></tr>`}).join("");
  document.getElementById("usRead").textContent="Calcul avec les réglages en cours (lecture, hypothèses). Recul du gouvernement face à la contestation : jusqu'à "+fmt(Math.max(...r.retreat),0)+" % des mesures.";
}

// Défaut unilatéral appliqué au programme de Mélenchon
function buildDef(){
  const tb=document.getElementById("defTab"); if(!tb||typeof simulate!=="function") return;
  const st=CANDS0.find(c=>c.id==="statu"), ml=CANDS.find(c=>c.id==="melenchon")||CANDS0.find(c=>c.id==="melenchon");
  const B=Object.assign({},BASE,{noCrisis:0}), md=typeof mode!=="undefined"?mode:"credible", y=t=>t-2025;
  const s0=simulate(st,md,B), a=simulate(Object.assign({},ml,{defaut:0}),md,B), d=simulate(Object.assign({},ml,{defaut:0.3}),md,B);
  const pa=(r,g,t)=>{const v=(r.pa[g][y(t)]/s0.pa[g][y(t)]-1)*100;return (v>=0?"+":"−")+fmt(Math.abs(v))+" %";};
  const rows=[["Crise de la dette",r=>r.crisis||"aucune avant 2046"],["Inflation maximale",r=>fmt(Math.max(...r.infl))+" %"],["Tension sociale maximale",r=>fmt(Math.max(...r.tension),0)],
   ["Dette 2036",r=>fmt(r.debt[y(2036)],0)+" %"],["Dette 2046",r=>fmt(r.debt[y(2046)],0)+" %"],
   ["Pauvreté 2030",r=>fmt(r.pov[y(2030)])+" %"],["Pauvreté 2040",r=>fmt(r.pov[y(2040)])+" %"],
   ["Ménages modestes 2030 (écart à rien ne change)",r=>pa(r,"mod",2030)],["Ménages modestes 2046",r=>pa(r,"mod",2046)],
   ["Retraités 2030",r=>pa(r,"ret",2030)],["10 % les plus riches 2030",r=>pa(r,"top",2030)]];
  tb.innerHTML=rows.map(([l,f])=>`<tr><td>${l}</td><td style="text-align:right">${f(a)}</td><td style="text-align:right">${f(d)}</td></tr>`).join("");
  document.getElementById("defRead").textContent="Calcul avec les réglages en cours (lecture, hypothèses). 30 % de la dette détenue hors banque centrale annulés en 2028.";
}

let defChart=null, defInd="pov", defRd="central", defWired=false;
function defDraw(){
  const cv=document.getElementById("defChart"); if(!cv||typeof simulate!=="function") return;
  if(!defWired){defWired=true;
    document.querySelectorAll("[data-di]").forEach(x=>x.onclick=()=>{defInd=x.dataset.di;document.querySelectorAll("[data-di]").forEach(y=>y.setAttribute("aria-pressed",y.dataset.di===defInd));defDraw();});
    document.querySelectorAll("[data-dr]").forEach(x=>x.onclick=()=>{defRd=x.dataset.dr;document.querySelectorAll("[data-dr]").forEach(y=>y.setAttribute("aria-pressed",y.dataset.dr===defRd));defDraw();});}
  const B=Object.assign({},BASE0,PRESETS[defRd],{noCrisis:0}), ys=[]; // ici, la crise est le sujet : elle est affichée for(let y=2025;y<=2046;y++) ys.push(y);
  const st=CANDS0.find(c=>c.id==="statu"), ml=CANDS0.find(c=>c.id==="melenchon"), ia=CANDS0.find(c=>c.id==="ia");
  const s0=simulate(st,"credible",B);
  const ser=r=>defInd==="pov"?r.pov.map(v=>+v.toFixed(1)):defInd==="debt"?r.debt.map(v=>+v.toFixed(0)):r.pa.mod.map((v,i)=>+((v/s0.pa.mod[i]-1)*100).toFixed(1));
  const L=[["Statu quo",st,"--ink",[],3],["Mélenchon",ml,"--c1",[],2],["Mélenchon avec défaut en 2028",Object.assign({},ml,{defaut:0.3}),"--c1",[7,4],2],["Candidat IA (fictif)",ia,"--c7",[2,3],2]];
  const ds=L.map(([n,c,col,dash,w])=>({label:n,data:ser(simulate(c,"credible",B)),borderColor:css(col),backgroundColor:css(col),borderWidth:w,pointRadius:0,borderDash:dash}));
  const yt={pov:"Pauvreté (% de la population)",mod:"Revenu des ménages modestes, écart au statu quo (%)",debt:"Dette publique (% du PIB)"}[defInd];
  if(defChart) defChart.destroy();
  defChart=new Chart(cv,{type:"line",data:{labels:ys,datasets:ds},options:{responsive:true,maintainAspectRatio:false,animation:false,interaction:{mode:"index",intersect:false},plugins:{legend:{position:"bottom",labels:{color:css("--muted"),boxWidth:12}}},scales:{x:{ticks:{color:css("--muted")},grid:{color:css("--line")}},y:{title:{display:true,text:yt,color:css("--muted")},ticks:{color:css("--muted")},grid:{color:css("--line")}}}}});
}
