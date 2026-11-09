// « Quelles solutions pour la dette ? » : chaque stratégie est appliquée seule au statu quo, avec les mêmes règles et les
// mêmes tirages que le reste du site. Mesures supposées appliquées en entier (crédibilité 1) : on compare des stratégies,
// pas des programmes. Le risque de crise est donné avec une fourchette (marchés indulgents / sévères), parce que ce chiffre
// dépend beaucoup de deux réglages : la sensibilité des taux à la dette et le seuil de crise.
const SOL_Q="solutions";
const solL=(m,net,p)=>({p:p||{},m:m.map(x=>[x[0],x[1],x[2],"",SOL_Q]),net});
const SOL_LV={
  top:solL([["Impôt sur les hauts revenus et le patrimoine",-20,"capital"]],-20),
  her:solL([["Héritages et revenus du capital",-15,"capital"]],-15),
  ent:solL([["Aides aux entreprises réduites",-13,"entreprises"]],-13),
  soc:solL([["Aides sociales réduites",-10,"social"]],-10),
  cho:solL([["Assurance chômage durcie",-5,"chomage"]],-5),
  fon:solL([["Gel de la fonction publique",-8,"fonction"]],-8),
  srv:solL([],-28.8,{spServ:-0.8}),
  cm:solL([["Impôt sur le revenu et TVA pour tous",-17,"conso"]],-17),
  hosp:solL([["Dépenses de santé évitables",-4,"social"]],-4),
  rel:solL([],30,{spServ:0.83})
};
// b : hypothèses communes changées (inflation, financement) ; pf : réglages de scénario du programme
const SOL=[
  {id:"rien",n:"Ne rien changer",who:"Personne tout de suite ; tout le monde si la crise arrive",ls:[]},
  {id:"eco",n:"Économies seules",who:"Usagers des services publics, allocataires, fonctionnaires",ls:["srv","soc","cho","fon"]},
  {id:"imp",n:"Impôts sur tous",who:"Tous les ménages, par l'impôt et la TVA",ls:["top","her","cm"]},
  {id:"riches",n:"Impôts sur les plus aisés et le capital",who:"Les 10 % les plus aisés (une partie de la recette s'évade)",ls:["top","her"]},
  {id:"mixte",n:"Mixte ciblé",who:"Entreprises aidées et ménages les plus aisés",ls:["ent","top","her","hosp"]},
  {id:"mixte2",n:"Mixte ciblé doublé",who:"Tout le monde, les plus aisés davantage",ls:["ent","top","her","hosp","srv","cm","fon"]},
  {id:"infl",n:"Laisser filer l'inflation (+2 points)",who:"Épargnants, et salariés si les salaires ne suivent pas",ls:[],b:B=>({infl:B.infl+2})},
  {id:"relance",n:"Relance par la dépense (+30 Md€ par an)",who:"Personne au départ ; pari sur la croissance",ls:["rel"]},
  {id:"repr1",n:"Taux maintenus sous l'inflation (léger)",who:"Épargnants et retraités",ls:[],b:()=>({repr:1})},
  {id:"repr2",n:"Taux maintenus sous l'inflation (fort)",who:"Épargnants et retraités, nettement",ls:[],b:()=>({repr:2})},
  {id:"epargne",n:"Emprunter davantage à l'épargne nationale",who:"Personne directement ; dette plus exposée aux taux courts",ls:[],b:()=>({stShare:0.3})},
  {id:"bce",n:"La BCE achète la dette directement",who:"Suppose de réécrire les traités européens",ls:[],pf:{ecbDirect:1},hyp:1},
  {id:"combo",n:"Mixte ciblé + épargne nationale + BCE",who:"Entreprises aidées, plus aisés ; suppose l'accord européen",ls:["ent","top","her","hosp"],b:()=>({stShare:0.3}),pf:{ecbDirect:1},hyp:1}
];
const SOL_GR={mod:[0,2],moy:[3,6],top:[9,9]}; // déciles de chaque groupe, pour traduire les points en euros
const solLevel=g=>{const [a,b]=SOL_GR[g]; let s=0; for(let i=a;i<=b;i++) s+=LEVELS[i]; return s/(b-a+1);};
const solMed=a=>{const s=a.filter(x=>x!=null&&!isNaN(x)).sort((x,y)=>x-y); return s.length?s[s.length>>1]:null;};
let SOL_RES=null, SOL_KEY="", SOL_BUSY=false;
function solKey(){return JSON.stringify([mode,BASE]);}
function solOne(s){
  const B=Object.assign({},BASE,{noCrisis:0},s.b?s.b(BASE):{});
  const L=s.ls.length?s.ls.map(k=>SOL_LV[k]):[{p:{},m:[],net:0}], Q=qzBuild(L); Q.p.c=1; Object.assign(Q.p,s.pf||{});
  const risk=(over,n)=>{const d=makeDraws(Object.assign({},B,over)).slice(0,n), R=d.map(x=>simDraw(Q.p,x)); return {R,cr:R.filter(x=>x.crisis!==null).length/R.length};};
  const c=risk({},NMC), lo=risk({kDebt:B.kDebt*0.65,crisisPrem:B.crisisPrem+1},100), hi=risk({kDebt:B.kDebt*1.3,crisisPrem:B.crisisPrem-1},100), R=c.R, yi=y=>y-START;
  const o={id:s.id,net:Q.net,cr:c.cr,crLo:Math.min(lo.cr,c.cr,hi.cr),crHi:Math.max(lo.cr,c.cr,hi.cr),cr32:R.filter(x=>x.crisis!==null&&x.crisis<=2032).length/R.length,
    debt:solMed(R.map(x=>x.debt[yi(2036)])),burden:solMed(R.map(x=>x.burden[yi(2036)])),pov:solMed(R.map(x=>x.pov[yi(2032)])),infl:solMed(R.map(x=>x.infl[yi(2032)])),pa:{}};
  for(const g of ["mod","moy","top","ret"]) o.pa[g]=solMed(R.map(x=>x.pa[g][yi(2032)]));
  return o;
}
function solRun(){
  if(SOL_BUSY) return; const box=document.getElementById("solBox"); if(!box) return;
  SOL_BUSY=true; const key=solKey(), res=[]; let i=0;
  const step=()=>{
    if(i<SOL.length){ box.innerHTML=`<p class="help" role="status">Calcul en cours : ${i+1} sur ${SOL.length} (${SOL[i].n})…</p>`;
      setTimeout(()=>{res.push(solOne(SOL[i])); i++; step();},15); return; }
    if(typeof setSocialKey==="function") setSocialKey(0.2);
    SOL_RES=res; SOL_KEY=key; SOL_BUSY=false; solRender();
  };
  step();
}
function solEur(o,ref,g){const d=o.pa[g]/ref.pa[g]-1; return d*solLevel(g)/12;}
function solRender(){
  const box=document.getElementById("solBox"); if(!box) return;
  if(!SOL_RES||SOL_KEY!==solKey()){ SOL_RES=null;
    box.innerHTML=`<p><button class="btn-primary" type="button" id="solGo">Comparer les ${SOL.length} solutions</button></p><p class="help">Le calcul prend quelques secondes : chaque solution est rejouée dans 200 tirages, puis dans deux séries de 100 tirages où les marchés sont plus indulgents ou plus sévères. Il reprend vos hypothèses et votre mode d'application.</p>`;
    document.getElementById("solGo").onclick=solRun; return; }
  const ref=SOL_RES[0], pc=v=>fmt(v*100,0)+" %", sg=(v,d=0)=>(v>0.5*Math.pow(10,-d)?"+":v<-0.5*Math.pow(10,-d)?"−":"")+fmt(Math.abs(v),d);
  const eur=(o,g)=>{if(o===ref) return "référence"; const e=solEur(o,ref,g); return `<span class="${e<-2?"worse":e>2?"better":""}">${sg(e)} €</span>`;};
  const rows=SOL_RES.map((o,k)=>{const s=SOL[k], cls=o.crHi<0.5?"better":o.crLo>=0.5?"worse":"";
    const ret=o===ref?"référence":`<span class="${o.pa.ret/ref.pa.ret-1<-0.002?"worse":o.pa.ret/ref.pa.ret-1>0.002?"better":""}">${sg((o.pa.ret/ref.pa.ret-1)*100,1)} %</span>`;
    return `<tr><td class="txt name"><b>${s.n}</b><span class="solwho">${s.who}</span></td>
      <td class="sep">${o.net?(o.net<0?"−":"+")+fmt(Math.abs(o.net),0)+" Md€":"0"}</td>
      <td class="sep ${cls}"><b>${pc(o.cr)}</b><span class="solrng">${pc(o.crLo)} à ${pc(o.crHi)}${s.hyp?" (par hypothèse)":""}</span></td>
      <td>${fmt(o.debt,0)} %</td><td>${fmt(o.burden,1)} %</td>
      <td class="sep">${eur(o,"mod")}</td><td>${eur(o,"moy")}</td><td>${eur(o,"top")}</td><td>${ret}</td>
      <td class="sep">${fmt(o.pov,1)} %</td><td>${fmt(o.infl,1)} %</td></tr>`;}).join("");
  const solid=SOL_RES.filter((o,k)=>k&&o.crHi<0.5).map(o=>SOL.find(s=>s.id===o.id)), fail=SOL_RES.filter(o=>o.crLo>=0.5).map(o=>SOL.find(s=>s.id===o.id)), list=a=>a.map(s=>"« "+s.n+" »").join(", ");
  const real=solid.filter(s=>!s.hyp), hyp=solid.filter(s=>s.hyp);
  box.innerHTML=`<div class="tablewrap"><table id="tblsol">
    <thead><tr><th rowspan="2">Solution, et qui paie</th><th rowspan="2" class="sep" title="Effet annuel sur le déficit : − = déficit réduit, + = dépense en plus">Effort<br>par an</th><th rowspan="2" class="sep" title="Part des tirages avec une crise de financement d'ici 2046. Dessous : la fourchette quand les marchés sont plus indulgents ou plus sévères.">Risque de crise<br>d'ici 2046</th><th rowspan="2">Dette<br>2036</th><th rowspan="2" title="Intérêts de la dette en 2036, en part des recettes publiques">Intérêts<br>2036</th><th colspan="4" class="sep" title="Écart avec « ne rien changer », en 2032, par personne">Pouvoir d'achat en 2032, par mois et par personne</th><th rowspan="2" class="sep">Pauvreté<br>2032</th><th rowspan="2">Inflation<br>2032</th></tr>
    <tr><th class="sep">Modestes</th><th>Classes moyennes</th><th>10 % les plus aisés</th><th>Retraités</th></tr></thead>
    <tbody>${rows}</tbody></table></div>
    <p class="help"><b>Lecture.</b> Valeurs médianes sur 200 tirages. Le pouvoir d'achat est l'écart avec « ne rien changer » en 2032 : en euros par mois pour une personne du groupe (niveau de vie moyen Insee 2024 : ${fmt(solLevel("mod"),0)} € par an pour les trois premiers dixièmes de la population, ${fmt(solLevel("moy"),0)} € pour les quatre suivants, ${fmt(solLevel("top"),0)} € pour le dernier), en pourcentage pour les retraités. Fourchette du risque : la même solution rejouée avec des marchés plus indulgents (taux moins sensibles à la dette, seuil de crise plus haut) et plus sévères.</p>
    <div class="notice"><strong>Ce qui résiste au changement d'hypothèses.</strong> ${real.length?`Le risque de crise reste sous 50 % même avec des marchés sévères pour : ${list(real)}.`:"Aucune solution budgétaire ou monétaire testée seule ne garde le risque de crise sous 50 % quand les marchés sont sévères."}${hyp.length?` ${list(hyp)} y ${hyp.length>1?"arrivent":"arrive"} aussi, mais par hypothèse : le simulateur plafonne alors les taux, ce qui suppose un accord européen que personne ne garantit.`:""} ${fail.length?`Le risque dépasse 50 % même avec des marchés indulgents pour : ${list(fail)}.`:""} Aucune solution n'est gratuite : chacune déplace la facture vers un groupe différent, indiqué sous son nom.</div>
    <p class="help">Limites. Les mesures sont supposées appliquées en entier, sans recul ni blocage. « Laisser filer l'inflation » suppose que la BCE laisse faire et que les salaires suivent en partie : c'est une hypothèse favorable. L'épargne nationale est représentée par des titres courts au taux des dépôts. Le défaut sur la dette n'est pas dans ce tableau (voir <a href="https://github.com/mysteropodes/simulateur-2027/blob/main/tests/defcmp.js" target="_blank" rel="noopener">tests/defcmp.js</a>). Comparez la dette de 2036 avec le risque de crise : une crise impose des économies qui font baisser la dette ensuite. <button class="lnk" type="button" id="solAgain">Recalculer</button></p>`;
  document.getElementById("solAgain").onclick=()=>{SOL_RES=null;solRun();};
}
