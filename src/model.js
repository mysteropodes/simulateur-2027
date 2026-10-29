// Modèle v5 — même règle pour tous. Climat, IA, santé, tension sociale, financement, pouvoir d'achat, retraites, CO2, pollution.
const BASE0={d0:115.6,pd0:2.9,realg:1.0,infl:1.7,mktReal:1.7,ieff0:1.9,mult:0.7,prem:0.15,okun:0.5,u0:8.3,uStar:7.6,gini0:0.302,pov0:15.4,redistEff:0.85,stab:0.5,
  shock:"none",shockYear:2029,clim:"forte",climNeed:1.0,heatBase:2000,ai:"moyenne",kDebt:0.25,crisisPrem:3.0,rev:52.1,co2_0:364,co2Base:1.5,pm0:40000,pensBal0:-0.2,retLiv0:100.2,
  leak:0.25,seniorKeep:0.55,multScale:1,hyst:0.05,povElast:0.35,rtt:0.5,calib:1,forcedMax:6,tensionRights:1,spRet:0.1,invRet:0.1,fiscalReact:0.04,reactMax:4,nw0:23.5,premPol:1.1,premPolDecay:0.8,def0:2.05,lpm:0.55,aiCost:0.4,cons0:265,rateSens:0.08,sp0:17.5,po0:43.6,dep0:57.2,int0:2.2,youth0:21.6,energy0:45.8,artif0:19000,emp55_0:62.1,w10_0:48,gdpMd:2991,wealthMd:11700};
const START=2025, END=2046;
const CLIM={moderee:{dmg:0.03,heat:0.02},forte:{dmg:0.07,heat:0.04},tresforte:{dmg:0.12,heat:0.06}};
const AI={lente:{prod:0.1,disp:0.5,gini:0.005,tax:0.1},moyenne:{prod:0.3,disp:1.2,gini:0.012,tax:0.2},rapide:{prod:0.6,disp:2.5,gini:0.025,tax:0.4}};
const feas=p=>0.5*p.parl+0.25*p.adh+0.25*p.legal;
const ramp=(t,a,b)=>t<=a?0:t>=b?1:(t-a)/(b-a);
const GROUPS=[["mod","Ménages modestes (D1-D3)",1.5,2.0,0.6],["moy","Classes moyennes (D4-D7)",0.8,1.2,0.4],["ais","Aisés (D8-D9)",0.4,0.8,0.2],["top","10 % les plus riches",0.2,0.6,0.1],["ret","Retraités",0.1,1.5,0.3],["jeu","Jeunes 18-29 ans",2.0,1.0,0.5]];
// [clé, nom, sensibilité au chômage, à l'ajustement imposé, aux chocs d'inflation] en % de revenu par point
function shockAt(type,Y,t){
  const k=t-Y, z={real:0,infl:0,spread:0,euMult:1,pd:0,deaths:0,tension:0};
  if(type==="recession"){ if(k===0){z.real=-3;z.infl=-0.8;z.tension=8;} if(k===1) z.real=0.8; if(k===2) z.real=0.4; }
  if(type==="financial"){ if(k===0){z.real=-2;z.spread=2;z.tension=10;} if(k===1){z.real=-0.5;z.spread=1.5;z.tension=5;} if(k===2) z.spread=1; if(k>=0&&k<=2) z.euMult=2; }
  if(type==="inflation"){ if(k===0){z.infl=3;z.real=-1;z.spread=0.5;z.tension=10;} if(k===1){z.infl=1.5;z.tension=5;} }
  if(type==="climat"){ if(k===0){z.real=-1.5;z.pd=1.0;z.infl=1.0;z.deaths=10000;z.tension=6;} if(k===1) z.pd=0.5; }
  if(type==="pandemie"){ if(k===0){z.real=-7;z.pd=5;z.deaths=60000;z.tension=12;} if(k===1){z.real=5;z.pd=2;z.deaths=15000;z.tension=6;} if(k===2) z.real=1.5; }
  return z;
}
const SHOCKTXT={recession:"Récession mondiale : −3 points de croissance cette année-là.",financial:"Crise financière : récession et hausse des taux pour tous, plus forte pour les pays en conflit avec l'UE.",inflation:"Choc d'inflation : +3 points, les taux montent.",climat:"Catastrophe climatique : pertes économiques, décès, dépenses de reconstruction.",pandemie:"Épidémie : −7 points de croissance, dépenses publiques massives, décès."};
const LEV=[9960,15890,19400,22430,25310,28290,31670,36040,43010,76970]; // niveau de vie moyen par décile, Insee 2024
const SU_D=[2,1.5,1.2,1,0.8,0.7,0.6,0.5,0.4,0.2], SF_D=[2.2,2,1.8,1.4,1.2,1.1,1,0.9,0.7,0.6]; // sensibilité au chômage et à l'ajustement imposé
function giniDec(x){let s=0,mu=0;for(const a of x){mu+=a;for(const b of x)s+=Math.abs(a-b);}mu/=x.length;return s/(2*x.length*x.length*mu);}
const G_DEC0=giniDec(LEV);
const IK=[13400,12000,11300,10900,10600,10400,10300,10200,9400,7900]; // transferts en nature par unité de consommation et par décile (Insee 2023, D1 et D10 ; intermédiaires interpolés)
// Multiplicateurs par type de mesure (effet sur le PIB d'1 € de mesure permanente) à 1-2 ans, 5 ans et 10 ans :
// valeurs centrales de la synthèse de Déchiffrer 2027 (Mésange, OFCE, HCFP, FMI, Commission européenne, octobre 2026).
// Investissement public plafonné à 0,9 à 10 ans : son effet d'offre passe déjà par le rendement du capital public (invRet).
// « ext » (versements hors de France, ex. contribution à l'UE) : hypothèse propre au simulateur, 0,1.
const MULT={inv:[1.3,0.9,0.9],log:[1.3,0.9,0.8],fonct:[0.9,0.9,0.6],trMod:[0.8,0.8,0.6],trAutres:[0.6,0.6,0.6],taxMod:[0.8,0.8,0.9],taxLarge:[0.5,0.9,0.9],taxAis:[0.3,0.3,0.3],entr:[0.3,0.8,1.0],ext:[0.1,0.1,0.1],fin:[0,0,0]};
const MULTLABEL={inv:"Investissement public",log:"Aides à l'investissement logement",fonct:"Dépenses de fonctionnement (salaires publics, achats, services) et économies non détaillées",trMod:"Transferts aux ménages modestes",trAutres:"Autres transferts (retraites, santé, famille)",taxMod:"Baisses d'impôts ciblées sur les modestes",taxLarge:"Impôts larges sur les ménages (TVA, CSG, IR)",taxAis:"Impôts sur les ménages aisés (capital, patrimoine, héritages)",entr:"Prélèvements sur les entreprises",ext:"Versements hors de France (contribution à l'UE)",fin:"Opérations financières (placement des réserves, capitalisation)"};
const KEYCAT={minima:"trMod",chomage:"trMod",jeunes:"trMod",fonction:"fonct",retraites:"trAutres",tete:"trAutres",capital:"taxAis",conso:"taxLarge",heuressup:"taxLarge",entreprises:"entr",bassal:"taxMod"};
const TAXCAT={taxAis:1,taxLarge:1,taxMod:1,entr:1};
const IR_TOP=0.57; // impôt sur le revenu : part payée par les 10 % les plus aisés (clé d'incidence « ir »), classée en impôts sur les aisés
function multAt(c,h){const m=MULT[c];return h<=2?m[0]:h<=5?m[0]+(m[1]-m[0])*(h-2)/3:h<=10?m[1]+(m[2]-m[1])*(h-5)/5:m[2];}
// Répartition de l'effort du programme par type de mesure, en points de PIB à application complète (+ = soutien à l'activité).
// Mêmes règles pour tous : mesures ménages de la microsimulation (catégorie selon la clé d'incidence, ou précisée sur la mesure),
// postes du plan sans effet direct sur le revenu des ménages (compItems), investissement climat et logement, services publics,
// défense quand elle est comprise dans l'effort annoncé, reste des impôts annoncés ; le solde jusqu'à l'effort A est « non détaillé »
// et classé en dépenses de fonctionnement.
function fiscalCompDetail(p,b){
  const c={}; for(const k in MULT) c[k]=0; const pt=md=>md/b.gdpMd*100; let taxList=0;
  const add=(cat,md)=>{c[cat]+=pt(md); if(TAXCAT[cat]) taxList+=-md;};
  for(const [,md,key,,,cat] of (p.paMeasures||[])){
    if(cat==="none") continue; // hausse du Smic : payée par les employeurs, pas par l'État
    if(cat) add(cat,md); else if(key==="ir"){add("taxAis",md*IR_TOP);add("taxLarge",md*(1-IR_TOP));} else if(KEYCAT[key]) add(KEYCAT[key],md);
  }
  for(const [cat,md] of (p.compItems||[])) add(cat,md);
  c.inv+=(p.climInv||0)-0.2; c.log+=p.housingInv||0; c.fonct+=p.spServ||0;
  const def=p.defInA?(b.lpm+(p.defense||0)):0; c.fonct+=def; // défense comprise dans l'effort annoncé
  const rest=(p.taxMd||0)-taxList, sh=p.taxRestEntr==null?0.5:p.taxRestEntr; // impôts annoncés non détaillés : moitié entreprises, moitié ménages par défaut
  c.entr+=-pt(rest)*sh; c.taxLarge+=-pt(rest)*(1-sh);
  let sum=0; for(const k in c) sum+=c[k]; const resid=-(p.A||0)-sum; c.fonct+=resid;
  return {c,resid,def};
}
function fiscalComp(p,b){return fiscalCompDetail(p,b).c;}
const NEAR={2026:{g:-0.55,pi:-0.5},2027:{g:-0.25,pi:-0.2}};
function simulate(p,mode,b){
  const f=feas(p);
  const real= mode==="annonce"?1 : mode==="credible"?p.c : p.c*f; // part des montants budgétaires qui se réalise (crédibilité du chiffrage)
  const pol= mode==="pondere"?f:1; // réformes non budgétaires (âge de départ, temps de travail, marché du travail, ZAN) : appliquées si élu, pondérées par la faisabilité en mode « pondéré »
  const bceProb= mode==="annonce"?1 : p.bceOk*(mode==="pondere"?f:1);
  const bceOn= mode==="annonce"?1 : (b.bceDraw!=null&&b.bceDraw<bceProb?1:0); // la BCE accepte ou refuse, pas de moyenne
  const euW= mode==="pondere"?f:1;
  const C=CLIM[b.clim], I=AI[b.ai];
  let uSenLast=0, ageRealLast=0, empPrev=0, ratingPrev=0, retreatSaid=false; const ev=[]; const E=(t,k,txt)=>ev.push({t,k,txt});
  const leakM=mode==="annonce"?0:b.leak; const topLeak=((p.topRev||0)-(p.topCut||0))*leakM/b.gdpMd*100; // recettes perdues sur les hausses visant les plus riches, récupérées en partie sur les baisses // recettes perdues sur les plus riches (pt de PIB)
  let d=b.d0, ieff=b.ieff0, sPrev=b.pd0, gap=0, u=b.u0, lastDef=5.1, tension=40, retreat=1, burden=2.2/b.rev*100, crisis=null, tpi=null, forcedCum=0, co2=b.co2_0, inflCum=0, gdp=1;
  const consolid=(p.A-((p.topRev||0)-(p.topCut||0))*(mode==="annonce"?0:b.leak)/b.gdpMd*100)*real; // effort crédible : condition du filet BCE
  let emp55=b.emp55_0, w10=b.w10_0, premRef=null, artifS=b.artif0, KS=0, KI=0, dRef=null, reactSaid=false; const spHist=[], invHist=[];
  const comp=fiscalComp(p,b); comp.taxAis+=topLeak; // recettes évaporées : moins de prélèvement effectif sur les plus aisés
  const xPrev={}, imp=[]; for(const k in comp) xPrev[k]=0; let gapO=0, struct=0, sOtherPrev=b.pd0;
  const o={nw:[b.nw0],react:[0],spread:[0.75],rating:[0],defense:[b.def0],growth:[b.realg],infl:[b.infl],youth:[b.youth0],po:[b.po0],dep:[b.dep0],energy:[b.energy0],artif:[b.artif0],cons:[b.cons0],sp:[b.sp0],ratioEl:[(LEV[9]+IK[9])/(LEV[0]+IK[0])],ratioMon:[LEV[9]/LEV[0]],emp55:[emp55],w10:[w10],snow:[0],prim:[0],debt:[d],def:[null],unemp:[u],gini:[b.gini0],pov:[b.pov0],health:[0],heat:[b.heatBase],tension:[40],burden:[burden],co2:[co2],pm:[b.pm0],pens:[b.pensBal0],retliv:[b.retLiv0-0.42],pa:{}};
  for(const [g] of GROUPS) o.pa[g]=[100];
  for(let t=START+1;t<=END;t++){
    const z=shockAt(b.shock,b.shockYear,t);
    if(mode!=="annonce" && tension>65){ retreat=Math.max(0.6,retreat-0.1); if(!retreatSaid&&p.id!=="statu"){retreatSaid=true;E(t,"retreat","Tension sociale au-dessus de 65 : le gouvernement recule sur une partie du programme (jusqu'à 40 %).");} } // recul face à la contestation
    if(t===2027&&p.id!=="statu") E(t,"start","Entrée en vigueur du programme, montée en charge sur cinq ans.");
    if(t===b.shockYear&&b.shock!=="none") E(t,"shock",SHOCKTXT[b.shock]);
    if(t===2027&&p.bce>0) E(t,"bce",bceOn?"Gel de la dette détenue par la BCE accepté : charge d'intérêts allégée.":"Gel de la dette détenue par la BCE refusé (probabilité d'acceptation retenue : "+Math.round(bceProb*100)+" %) : pas d'allègement des intérêts.");
    const phase=t<2027?0:Math.min((t-2026)/5,1);
    // seniors : report ou avancée de l'âge de départ
    const sh0=p.ageShift||0, agePh=sh0>0?ramp(t,2026,2027+4*sh0):ramp(t,2026,2027+1.5*Math.abs(sh0));
    const sh=sh0*pol*retreat*agePh, keep=sh>0?b.seniorKeep:0.85;
    uSenLast=sh>0?sh*0.3*(1-keep):sh*0.05; ageRealLast=sh;
    const empEff=sh*10*0.35*keep, uSen=sh>0?sh*0.3*(1-keep):sh*0.05, benefitCost=sh>0?sh*(1-keep)*0.12:0;
    if(sh0!==0&&agePh>=1&&ramp(t-1,2026,sh0>0?2027+4*sh0:2027+1.5*Math.abs(sh0))<1) E(t,"age","Changement d'âge de départ achevé : effet complet sur l'emploi des seniors et sur les retraites.");
    const defSp=b.def0+b.lpm*ramp(t,2025,2030)+(p.defense||0)*real*retreat*ramp(t,2027,2035); // défense : loi de programmation militaire pour tous, plus l'écart propre au programme
    let s=b.pd0-(p.A-topLeak)*real*retreat*phase+benefitCost+(p.defInA?0:defSp-b.def0); // défense déjà financée dans l'objectif de déficit des programmes construits à partir d'une cible
    // règle de réaction des gouvernements suivants (après le mandat 2027-2032) : ils corrigent le déficit quand la dette continue de monter
    if(t===2032) dRef=b.d0; // référence : la dette de 2025
    const react=t>=2032&&dRef!==null?Math.min(b.reactMax,b.fiscalReact*Math.max(0,d-dRef))*ramp(t,2031,2034):0;
    s-=react;
    if(react>0.3&&!reactSaid){reactSaid=true;E(t,"react","Après 2031, les gouvernements suivants corrigent une partie du déficit en fonction du niveau de la dette (règle de réaction budgétaire).");}
    if(crisis!==null&&t-crisis<=5){ const s0=s; s=lastDef>3?Math.min(s,sPrev-1.5):Math.min(s,sPrev); s=Math.max(s,s0-b.forcedMax); forcedCum=Math.max(0,s0-s); } // ajustement imposé pendant cinq ans
    else if(crisis!==null){ s=s-forcedCum; } // ensuite, les économies imposées restent acquises
    // climat
    const adapt=Math.min(1,Math.max(0,p.climInv*real)/b.climNeed)*ramp(t,2027,2035);
    const climDrag=t>=2027?C.dmg*(1-0.5*adapt):0;
    // IA
    const cushion=Math.min(1,0.2+(p.aiCushion-0.2)*real), adopt=1+(p.aiAdopt-1)*real;
    const aiRamp=ramp(t,2026,2032), aiProd=I.prod*adopt*aiRamp;
    const hump=t<=2034?ramp(t,2026,2032):Math.pow(0.85,t-2034);
    const aiDisp=I.disp*hump*(1-cushion);
    // croissance
    const lr=t>=2032?p.longRun*pol*ramp(t,2031,2039):0;
    const scar=(crisis!==null&&t-crisis>=1&&t-crisis<=5)?0.3:0; // séquelles durables d'une crise
    const rttPh=p.rtt?pol*retreat*ramp(t,2026,2031):0, rttSupply=p.rtt&&t>=2027&&t<=2031?-0.12*(1-b.rtt)*pol*retreat:0;
    // rendement des services publics (éducation, santé : effet après 5 ans) et de l'investissement public (après 3 ans)
    spHist.push((p.spServ||0)*real*retreat*phase); invHist.push((Math.max(0,p.climInv)-0.2)*real*retreat*phase);
    const KSp=KS, KIp=KI; KS=KS*0.95+(spHist.length>5?spHist[spHist.length-6]:0); KI=KI*0.97+(invHist.length>3?invHist[invHist.length-4]:0);
    const pubRet=b.spRet*(KS-KSp)+b.invRet*(KI-KIp);
    const supply=(t>=2027?p.supply*pol:0)+lr+aiProd-climDrag-scar+0.17*(empEff-empPrev)+rttSupply+pubRet; empPrev=empEff;
    if(t===2032&&Math.abs(p.longRun*pol)>=0.03) E(t,"lr",(p.longRun>0?"Les réformes commencent à relever":"Les réformes commencent à freiner")+" la croissance de long terme ("+(p.longRun>0?"+":"")+(p.longRun*pol).toFixed(2)+" pt par an à terme).");
    const gapPrev=gap, structPrev=struct;
    const dec0=p.paDec||[0,0,0,0,0,0,0,0,0,0];
    // effet des mesures du programme sur l'activité : multiplicateur propre à chaque type de mesure, selon le temps écoulé
    const progBal=(p.A-topLeak)*real*retreat*phase, dx={}; let dxAny=false;
    const defOut=p.defInA?0:defSp-b.def0; // défense hors effort annoncé (loi de programmation pour tous) : traitée comme une dépense de fonctionnement
    for(const k in comp){const x=comp[k]*real*retreat*phase+(k==="fonct"?defOut:0); dx[k]=x-xPrev[k]; xPrev[k]=x; if(Math.abs(dx[k])>1e-9) dxAny=true;}
    if(dxAny) imp.push({t,dx});
    let cyc=0; struct=0;
    for(const q of imp){const h=t-q.t+1, w=ramp(h,3,10); for(const k in q.dx){const e=q.dx[k]*multAt(k,h)*b.multScale; cyc+=e*(1-w); struct+=e*w;}} // la part durable devient un effet sur le niveau du PIB potentiel
    // autres variations du solde (ajustement imposé, règle de réaction, défense hors programme…) : multiplicateur moyen, plus fort en crise
    const sOther=s+progBal-defOut;
    const gapOPrev=gapO; gapO=0.5*gapO-(crisis!==null&&t-crisis<=5?Math.max(b.mult,1.5):b.mult)*(sOtherPrev-sOther)+z.real+(crisis===t-1?-2:0); sOtherPrev=sOther; // choc de la crise l'année suivant son déclenchement
    const hystLoss=(crisis!==null&&t-crisis>=1&&t-crisis<=5)?0:b.hyst*Math.max(0,-gapOPrev); // séquelles durables des récessions et ajustements hors programme (les effets durables des mesures sont déjà dans les multiplicateurs ; en crise, ils sont comptés à part)
    gap=gapO+cyc;
    const near=t===2026?NEAR[2026]:t===2027?NEAR[2027]:{g:0,pi:0}; // conjoncture : prévisions officielles 2026-2027 (HCFP, consensus)
    const realg=b.realg+supply+(gap-gapPrev)+(struct-structPrev)-hystLoss+(b.calib?near.g:0);
    const pi=b.infl+(b.calib?near.pi:0)+z.infl+(t===2027||t===2028?p.inflImp*real:0);
    const pd=s-b.stab*gap+z.pd+I.tax*hump*(1-0.5*cushion)+b.aiCost*Math.max(0,cushion-0.2)/0.8*hump*I.disp/1.2; // l'amortisseur IA (formation, accompagnement) a un coût
    const rating=burden>14?1.4:burden>11?0.6:burden>8?0.2:0;   // dégradations de note par paliers
    const polPrem=b.premPol*(t<=2027?1:Math.pow(b.premPolDecay,t-2027)); // prime d'instabilité politique actuelle, qui se résorbe après l'élection
    let prem=b.prem*Math.max(0,lastDef-3)+b.kDebt*Math.max(0,d-120)/10+rating+polPrem+(t>=2027?p.eu*euW*z.euMult:0)+z.spread;
    if(t>=2027 && crisis===null && tpi===null && prem>b.crisisPrem){
      if(consolid>=1 && p.eu*euW<0.2) tpi=t; else crisis=t;
    }
    if(tpi===t) E(t,"tpi","Primes de risque au-delà du seuil, mais l'effort est crédible et les règles européennes respectées : la BCE active son filet (TPI) et plafonne les taux.");
    if(crisis===t) E(t,"crisis","Crise de financement : la prime de risque dépasse "+b.crisisPrem.toFixed(1).replace('.',',')+" points. Prêts d'urgence sous condition, économies imposées de 1,5 pt de PIB par an, récession et chômage.");
    if(rating>ratingPrev&&t>=2027) E(t,"rating","La charge d'intérêts dépasse "+(rating>1?14:rating>0.5?11:8)+" % des recettes : dégradation de la note, les taux montent."); ratingPrev=rating;
    if(tpi!==null) prem=Math.min(prem,1.0);
    if(premRef===null) premRef=prem;
    const premMkt=prem; if(crisis!==null&&t-crisis<5) prem=prem*0.5; // prêts d'urgence à taux réduit pendant cinq ans
    ieff+=(b.mktReal+pi+prem-ieff)/8;
    const i=ieff*(1-(t>=2027?p.bce*bceOn:0));
    const ng=(1+realg/100)*(1+pi/100)-1;
    const interest=d*i/100;
    const dOld=d; d=Math.max(0,d*(1+i/100)/(1+ng)+pd); o.snow.push(d-dOld-pd); o.prim.push(pd);
    lastDef=pd+interest; burden=interest/b.rev*100;
    u=u+0.25*(b.uStar+(t>=2027?p.uStruct*pol:0)+aiDisp+uSen-1.1*b.rtt*rttPh-u)-b.okun*(gap-gapPrev);
    // CO2 : tendance actuelle (−1,5 %/an) remplacée par le rythme du programme, l'activité module à la marge
    const rate=b.co2Base+(p.co2Rate-b.co2Base)*real*retreat*ramp(t,2026,2030);
    co2=co2*(1-rate/100)*(1+0.5*(gap-gapPrev)/100);
    // pollution de l'air (PM2.5) : suit les émissions de combustion, plus un progrès technique de 1 %/an
    const pm=b.pm0*Math.pow(co2/b.co2_0,0.8)*Math.pow(0.99,t-START);
    // retraites : trajectoire COR (−0,2 % du PIB jusqu'en 2030, −0,9 % en 2045) + effet du programme (déjà compris dans le déficit)
    const pens=(t<=2030?-0.2:-0.2-0.7*(t-2030)/15)+p.pensBal*real*retreat*phase-0.15*Math.max(0,u-b.u0);
    const retliv=b.retLiv0-0.21*(t-2023)+p.retLiv*real*retreat*phase-1.5*forcedCum;
    // pouvoir d'achat : croissance commune + mesures du programme + chômage + ajustement imposé + chocs d'inflation
    gdp*=1+realg/100; inflCum+=Math.max(0,z.infl);
    for(const [g,,su,sf,si] of GROUPS){
      o.pa[g].push(100*gdp*(1+(p.pa?p.pa[g]:0)*b.redistEff*real*retreat*phase/100)*(1-su*(u-b.u0)/100)*(1-sf*forcedCum/100)*(1-si*inflCum/100));
    }
    // revenus par décile : effet direct des mesures (microsimulation), chômage, ajustement imposé
    const k=b.redistEff*real*retreat*phase;
    const inc=LEV.map((L,i)=>L*(1+dec0[i]/100*k)*(1-SU_D[i]*(u-b.u0)/100)*(1-SF_D[i]*forcedCum/100));
    const chg=inc.map((v,i)=>100*(v/LEV[i]-1));
    const gini=b.gini0+(giniDec(inc)-G_DEC0)+I.gini*aiRamp*(1-0.5*cushion);
    const rel=0.4*chg[0]+0.6*chg[1]-chg[4]; // gain des ménages autour du seuil de pauvreté, relatif au revenu médian
    const pov=Math.max(5,b.pov0-b.povElast*rel); // le chômage agit déjà via les revenus des déciles
    const hs=p.healthSpend*real*retreat*phase;
    const heat=b.heatBase*Math.pow(1+C.heat,t-START)*(1-0.4*adapt)+(b.shock==="climat"?z.deaths*(1-0.4*adapt):0);
    const epid=b.shock==="pandemie"?z.deaths*(1-0.5*hs):0;
    const health=-0.6*(u-b.u0)-0.8*(pov-b.pov0)+6*hs*ramp(t,2027,2036)-epid/20000; // mois d'espérance de vie
    const unpop=Math.max(0.15,Math.min(1,Math.abs(p.A)/3));
    const rightsReal=mode==="annonce"?1:mode==="pondere"?f:(p.legal==null?1:p.legal); // part des mesures sur les droits qui passe : solidité juridique (pas la crédibilité du chiffrage budgétaire)
    const rightsT=t>=2027?b.tensionRights*(p.rightsPts||0)*rightsReal*(t===2027?1.5:retreat):0; // mobilisations contre les mesures touchant aux droits (grille qualitative)
    if(t===2027&&rightsT>=8) E(t,"rights","Fortes mobilisations contre les mesures touchant à l'égalité de traitement, aux libertés ou aux contre-pouvoirs.");
    tension=Math.max(0,Math.min(100,40+rightsT+4*(u-b.u0)+5*(pov-b.pov0)+25*(1-p.adh)*real*retreat*phase*unpop+3*Math.max(0,pi-3)+z.tension+(crisis===null?0:crisis===t?20:Math.max(0,12-2*(t-crisis)))));
    emp55=Math.min(75,b.emp55_0+(t<=2032?0.6*(t-START):0.6*7+0.2*(t-2032))+empEff);
    const wf=(p.wealthFlow||0), wEff=wf<0?wf*(1-leakM):wf;
    w10=w10+0.05+wEff*real*retreat*phase/b.wealthMd*100*0.52;
    o.emp55.push(emp55);o.w10.push(w10);
    // logement : tendance +1 %/an, sensible aux taux (prime de risque) et à la conjoncture, plus l'effet du programme (milliers par an)
    const cons=Math.max(120,b.cons0*Math.pow(1.01,t-START)*Math.max(0.6,1-b.rateSens*(premMkt-premRef))*(1+0.03*gap)+(p.housing||0)*real*retreat*phase);
    // services publics individualisables (santé, école, logement, action sociale), % du PIB ; une partie de l'ajustement imposé les touche
    const sp=b.sp0+(p.spServ||0)*real*retreat*phase-0.4*forcedCum;
    const ik=IK.map(v=>v*sp/b.sp0);
    o.cons.push(cons);o.nw.push(b.nw0-(d-b.d0)+KI);o.react.push(react);
    // croissance, inflation, chômage des jeunes (2,6 fois le taux global), prélèvements et dépense publique, facture énergétique, artificialisation
    const taxEff=((p.taxMd||0)-((p.topRev||0)-(p.topCut||0))*leakM)/b.gdpMd*100*real*retreat*phase;
    const po=b.po0+taxEff+0.3*forcedCum; const dep=po+(b.rev-b.po0)+lastDef; // dépense = prélèvements + autres recettes + déficit
    const zBase=t<=2031?0.04:0.03, zanRate=p.zan?zBase+(0.01-zBase)*pol*retreat*phase:zBase;
    artifS*=1-zanRate; const artif=artifS*Math.pow(cons/(b.cons0*Math.pow(1.01,t-START)),0.6);
    o.growth.push(realg);o.infl.push(pi);o.youth.push(b.youth0*u/b.u0);o.po.push(po);o.dep.push(dep);o.energy.push(b.energy0*co2/b.co2_0*(1+Math.max(0,z.infl)/10));o.artif.push(artif);o.sp.push(sp);o.ratioEl.push((inc[9]+ik[9])/(inc[0]+ik[0]));o.ratioMon.push(inc[9]/inc[0]);
    o.spread.push(premMkt);o.rating.push((rating>=0.2?1:0)+(rating>=0.6?1:0)+(rating>=1.4?1:0)+(crisis!==null?2:0)+(tpi!==null?1:0));o.defense.push(defSp);
    o.debt.push(d);o.def.push(lastDef);o.unemp.push(u);o.gini.push(gini);o.pov.push(pov);o.health.push(health);o.heat.push(heat+epid);o.tension.push(tension);o.burden.push(burden);o.co2.push(co2);o.pm.push(pm);o.pens.push(pens);o.retliv.push(retliv);
    sPrev=s;
  }
  o.comp=comp;o.ev=ev;o.uSen=uSenLast;o.ageReal=ageRealLast;o.topLeak=topLeak;o.real=real;o.f=f;o.crisis=crisis;o.tpi=tpi;return o;
}
if(typeof module!=="undefined") module.exports={BASE0,SHOCKTXT,simulate,feas,START,END,GROUPS,MULT,MULTLABEL,fiscalComp,fiscalCompDetail,multAt};
