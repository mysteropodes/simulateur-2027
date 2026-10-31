// Modèle v5 — même règle pour tous. Climat, IA, santé, tension sociale, financement, pouvoir d'achat, retraites, CO2, pollution.
const BASE0={d0:115.6,pd0:2.9,realg:1.0,infl:2.0,mktReal:1.5,ieff0:1.9,idxShare:0.1,idxReal:0.5,mult:0.7,prem:0.15,okun:0.3,u0:8.3,uStar:7.4,uSpeed:0.2,gini0:0.302,pov0:15.4,redistEff:0.85,stab:0.6,
  shock:"none",shockYear:2029,clim:"forte",climNeed:1.0,heatBase:2000,ai:"moyenne",kDebt:0.25,crisisPrem:3.0,rev:52.1,co2_0:364,co2Base:1.5,pm0:40000,pensBal0:-0.2,retLiv0:100.2,
  leak:0.4,tensCost:0.01,seniorKeep:0.55,tpiDef:4,demog:1,ecb:0.25,climCost:1,shock2:"none",shockYear2:2035,uGdp:0.5,uDef:0.2,bankCrisis:3,crowd:0.02,ratingW:0.5,roll:0.09,gdpProg:3600,exit:"programme",povSave:1.35,ageCost:0.8,natoGap:0.45,pensDef:1,phil:0.15,smicEl:0.35,ageEff:0.7,aiFade:2040,multScale:1,hyst:0.05,ineqGrowth:0.06,energy:"tendance",importSub:0.5,transDrag:0.06,oilGdp:0.02,oilPi:0.04,oilCoupling:0.2,bouclier:0.4,migWork:0.35,migGdp:0.5,emp0:30500,migFisc:0,icf0:1.56,icfRef:1.45,births0:645,famElast:0.01,povElast:0.35,rtt:0.5,calib:1,forcedMax:6,tensionRights:1,spRet:0.1,invRet:0,fiscalReact:0.04,reactMax:4,nw0:23.5,premPol:1.3,premPolDecay:0.8,def0:2.05,lpm:0.55,aiCost:0.4,cons0:265,rateSens:0.08,sp0:17.5,po0:43.6,dep0:57.2,int0:2.2,youth0:21.6,energy0:45.8,artif0:19000,emp55_0:62.1,w10_0:48,gdpMd:2991,wealthMd:11700};
const START=2025, END=2046;
const CLIM={aucun:{dmg:0,heat:0},moderee:{dmg:0.03,heat:0.02},forte:{dmg:0.07,heat:0.04},tresforte:{dmg:0.12,heat:0.06}};
const AI={aucune:{prod:0,disp:0,gini:0,tax:0},lente:{prod:0.1,disp:0.5,gini:0.005,tax:0.1},moyenne:{prod:0.3,disp:1.2,gini:0.012,tax:0.2},rapide:{prod:0.6,disp:2.5,gini:0.025,tax:0.4}};
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
  if(type==="petrole"){ if(k===0) z.tension=6; if(k===1) z.tension=3; } // prix et facture : module énergie
  if(type==="commerce"){ if(k===0){z.real=-0.2;z.infl=0.1;z.tension=3;} if(k===1) z.real=-0.15; if(k===2) z.real=-0.05; } // guerre commerciale : −0,4 pt de PIB cumulé (Banque de France, droits de douane américains 2025)
  if(type==="taiwan"){ if(k===0){z.real=-3;z.infl=1.5;z.spread=0.5;z.tension=8;} if(k===1){z.real=1;z.infl=0.5;} if(k===2) z.real=0.5; } // blocus de Taïwan : semi-conducteurs, commerce mondial (−5 % de PIB mondial selon Chatham House ; très incertain)
  if(type==="guerre"){ if(k===0){z.real=-1.0;z.infl=1.0;z.spread=0.3;z.pd=0.5;z.tension=6;} if(k===1){z.real=-0.3;z.pd=0.8;} if(k>=2&&k<=4) z.pd=0.8; } // guerre en Europe : énergie, confiance, effort de défense de près d'un point de PIB pendant cinq ans (ordre de grandeur de 2022 et des engagements de l'OTAN)
  if(type==="pandemie"){ if(k===0){z.real=-8.5;z.pd=3;z.deaths=60000;z.tension=12;} if(k===1){z.real=1.5;z.pd=2;z.deaths=15000;z.tension=6;} if(k===2) z.real=0.5; } // calé sur 2020-2022 (test sur le mandat 2017-2022) : PIB −7,4 % puis +6,9 % (l'écart de production se referme aussi de lui-même) ; mesures d'urgence ≈ 3 points de PIB, le reste du déficit vient des stabilisateurs automatiques
  return z;
}
const SHOCKTXT={guerre:"Guerre en Europe : choc d'énergie et de confiance, effort de défense supplémentaire de près d'un point de PIB pendant cinq ans.",recession:"Récession mondiale : −3 points de croissance cette année-là.",financial:"Crise financière : récession et hausse des taux pour tous, plus forte pour les pays en conflit avec l'UE.",inflation:"Choc d'inflation : +3 points, les taux montent.",climat:"Catastrophe climatique : pertes économiques, décès, dépenses de reconstruction.",pandemie:"Épidémie : récession d'environ 7 %, rebond l'année suivante, mesures d'urgence massives, décès (type 2020).",petrole:"Flambée du pétrole : +45 $ le baril pendant un an, +25 $ l'année suivante.",commerce:"Guerre commerciale : droits de douane, −0,4 point de PIB sur trois ans.",taiwan:"Blocus de Taïwan : pénurie de semi-conducteurs et choc sur le commerce mondial."};
const LEV=[9960,15890,19400,22430,25310,28290,31670,36040,43010,76970]; // niveau de vie moyen par décile, Insee 2024
const SU_D=[2,1.5,1.2,1,0.8,0.7,0.6,0.5,0.4,0.2], SF_D=[2.2,2,1.8,1.4,1.2,1.1,1,0.9,0.7,0.6]; // sensibilité au chômage et à l'ajustement imposé
function giniDec(x){let s=0,mu=0;for(const a of x){mu+=a;for(const b of x)s+=Math.abs(a-b);}mu/=x.length;return s/(2*x.length*x.length*mu);}
const G_DEC0=giniDec(LEV);
const IK=[13400,12000,11300,10900,10600,10400,10300,10200,9400,7900]; // transferts en nature par unité de consommation et par décile (Insee 2023, D1 et D10 ; intermédiaires interpolés)
// Multiplicateurs par type de mesure (effet sur le PIB d'1 € de mesure permanente) à 1-2 ans, 5 ans et 10 ans :
// valeurs centrales de la synthèse de Déchiffrer 2027 (Mésange, OFCE, HCFP, FMI, Commission européenne, octobre 2026).
// Investissement public plafonné à 0,9 à 10 ans : son effet d'offre passe déjà par le rendement du capital public (invRet).
// « ext » (versements hors de France, ex. contribution à l'UE) : hypothèse propre au simulateur, 0,1.
const MULT={inv:[1.3,0.9,0.9],log:[1.3,0.9,0.8],fonct:[0.9,0.8,0.5],trMod:[0.8,0.7,0.5],trAutres:[0.6,0.6,0.5],taxMod:[0.8,0.8,0.6],taxLarge:[0.5,0.8,0.6],taxAis:[0.3,0.3,0.3],entr:[0.3,0.7,0.7],ext:[0.1,0.1,0.1],fin:[0,0,0]};
// effets à dix ans ramenés entre la synthèse de Déchiffrer 2027 (effets durables) et la pratique de l'OBR britannique (effets de demande qui s'éteignent en cinq ans) : le test sur 2010-2016 montrait des effets durables trop forts
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
  const c={},cP={},cN={}; for(const k in MULT){c[k]=0;cP[k]=0;cN[k]=0;} const pt=md=>md/(p.gdpRef||b.gdpProg||b.gdpMd)*100; let taxList=0; // Md€ de fin de mandat rapportés au PIB nominal de fin de mandat
  const put=(cat,v)=>{c[cat]+=v; if(v>=0) cP[cat]+=v; else cN[cat]+=v;}; // cP : dépenses et baisses d'impôts ; cN : recettes et économies
  const add=(cat,md)=>{put(cat,pt(md)); if(TAXCAT[cat]) taxList+=-md;};
  for(const [,md,key,,,cat] of (p.paMeasures||[])){
    if(cat==="none") continue; // hausse du Smic : payée par les employeurs, pas par l'État
    if(cat) add(cat,md); else if(key==="ir"){add("taxAis",md*IR_TOP);add("taxLarge",md*(1-IR_TOP));} else if(KEYCAT[key]) add(KEYCAT[key],md);
  }
  for(const [cat,md] of (p.compItems||[])) add(cat,md);
  put("inv",(p.climInv||0)-0.2); put("log",p.housingInv||0); put("fonct",p.spServ||0);
  const def=p.defInA?(b.lpm+(p.defense||0)):0; put("fonct",def); // défense comprise dans l'effort annoncé
  const rest=(p.taxMd||0)-taxList, sh=p.taxRestEntr==null?0.5:p.taxRestEntr; // impôts annoncés non détaillés : moitié entreprises, moitié ménages par défaut
  put("entr",-pt(rest)*sh); put("taxLarge",-pt(rest)*(1-sh));
  let sum=0; for(const k in c) sum+=c[k]; const resid=-(p.A||0)-sum;
  if(p.itemized){c.fonct+=resid; cP.fonct+=resid;} else put("fonct",resid); // programme entièrement chiffré (recettes et dépenses) : l'écart avec la somme des postes du simulateur est un rapprochement comptable, pas une promesse d'économies, donc sans décote
  return {c,cP,cN,resid,def};
}
function fiscalComp(p,b){return fiscalCompDetail(p,b).c;}
// population active (Insee, projections 2022, scénario central) : +20 000 par an jusqu'en 2040, puis −50 000 par an ; croissance annuelle, en %, au-delà de l'effet de la réforme de 2023 sur les seniors
const LF={2026:0.15,2030:0.07,2039:0.05,2041:-0.16,2046:-0.16};
const NEAR={2026:{g:-0.8,pi:0.6,du:0.2,prem:-1.0,sf:1.0},2027:{g:-0.28,pi:0.3,du:0.15},2028:{g:0,pi:-0.2},2029:{g:0,pi:-0.2}}; // Banque de France (septembre 2026 : PIB 0,4 % ; 0,9 % ; 1,2 % — IPCH 2,3 % ; 1,9 % ; 1,6 %), mise à jour avec l'Insee du 30 octobre 2026 : PIB du 3e trimestre −0,1 %, acquis de croissance 0,2 % pour 2026 ; inflation d'octobre 3,4 % (IPCH 3,8 %). Retenu : PIB 0,3 % ; 0,8 % ; 1,1 % — inflation 2,6 % ; 2,3 % ; 1,8 % (estimation du simulateur, en attendant la projection de décembre). Dette 2026 : +1 point d'ajustement de trésorerie (dette de 119,0 % fin juin selon l'Insee ; 119,3 % prévus fin 2026 dans le projet de loi de finances)
// Énergie : prix du Brent ($ constants) selon le scénario. « tendance » : EIA (octobre 2026) puis retour vers 75 $ (AIE : surplus de l'offre) ;
// « tensions » : perturbations au Moyen-Orient durables ; « contrainte » : baisse de l'offre de pétrole disponible pour l'Europe (The Shift Project, 2021).
const ENERGY={
  tendance:{p:{2025:69,2026:96,2027:84,2028:78,2029:75,2046:75},supply:null},
  tensions:{p:{2025:69,2026:96,2027:100,2028:105,2032:105,2036:95,2046:95},supply:null},
  contrainte:{p:{2025:69,2026:96,2027:90,2030:105,2035:130,2040:160,2046:190},supply:{2025:1,2030:0.95,2040:0.73,2046:0.62}}
};
const ENERGYTXT={tendance:"Pétrole : retour progressif vers 75 $ le baril après le choc d'Ormuz de 2026 (EIA, AIE).",tensions:"Pétrole : tensions durables au Moyen-Orient, Brent autour de 100 à 105 $ jusqu'au milieu des années 2030.",contrainte:"Pétrole : l'offre disponible pour l'Europe baisse (The Shift Project) ; le prix monte et, au-delà de ce que la baisse de consommation absorbe, l'économie est rationnée."};
function interpYear(tab,t){const ks=Object.keys(tab).map(Number).sort((a,b)=>a-b); if(t<=ks[0]) return tab[ks[0]]; for(let i=1;i<ks.length;i++) if(t<=ks[i]) return tab[ks[i-1]]+(tab[ks[i]]-tab[ks[i-1]])*(t-ks[i-1])/(ks[i]-ks[i-1]); return tab[ks[ks.length-1]];}

function simulate(p,mode,b){
  const f=feas(p);
  const real= mode==="annonce"?1 : mode==="credible"?p.c : p.c*f; // part des montants budgétaires qui se réalise (crédibilité du chiffrage)
  const realSp= mode==="pondere"?f:1; // dépenses et baisses d'impôts : réalisées en entier (seule la faisabilité les réduit, en mode « pondéré »)
  const pol= mode==="pondere"?f:1; // réformes non budgétaires (âge de départ, temps de travail, marché du travail, ZAN) : appliquées si élu, pondérées par la faisabilité en mode « pondéré »
  const bceProb= mode==="annonce"?1 : p.bceOk*(mode==="pondere"?f:1);
  const bceOn= mode==="annonce"?1 : (b.bceDraw!=null&&b.bceDraw<bceProb?1:0); // la BCE accepte ou refuse, pas de moyenne
  const euW= mode==="pondere"?f:1;
  const C=CLIM[b.clim], I=AI[b.ai];
  let uSenLast=0, ageRealLast=0, empPrev=0, ratingPrev=0, retreatSaid=false; const ev=[]; const E=(t,k,txt)=>ev.push({t,k,txt});
  const GP=p.gdpRef||b.gdpProg||b.gdpMd; // PIB de l'année à laquelle se rapportent les montants du programme (fin de mandat, ou 2027 pour un contre-budget annuel)
  const leakM=mode==="annonce"?0:b.leak; const topLeak=((p.topRev||0)-(p.topCut||0))*leakM/GP*100; // recettes perdues sur les hausses visant les plus riches, récupérées en partie sur les baisses // recettes perdues sur les plus riches (pt de PIB)
  let d=b.d0, ieff=(b.ieff0-b.idxShare*(b.idxReal+b.infl))/(1-b.idxShare), sPrev=b.pd0, gap=0, u=b.u0, lastDef=5.1, tension=40, retreat=1, burden=2.2/b.rev*100, crisis=null, tpi=null, forcedCum=0, co2=b.co2_0, inflCum=0, gdp=1;
  let emp55=b.emp55_0, w10=b.w10_0, premRef=null, artifS=b.artif0, KS=0, KI=0, dRef=null, reactSaid=false, relSaid=false, crisisN=0, crisisFirst=null, rf=0, rMortPrev=null, dRprev=0, hpI=100, rentI=100, hpGprev=0, povS=0, crowdPrev=0, cumProg=0, uLevPrev=0, smicUprev=0, uProgPrev=0, tpiFirst=null, tensLevPrev=0; const spHist=[], invHist=[];
  const CD=fiscalCompDetail(p,b), comp=CD.c; comp.taxAis+=topLeak; // recettes évaporées : moins de prélèvement effectif sur les plus aisés
  // crédibilité appliquée par sens : recettes et économies réduites par la crédibilité du chiffrage, sauf les impôts sur les plus aisés
  // (déjà réduits par la fuite fiscale) ; dépenses et baisses d'impôts réalisées en entier
  const compEff={}; let progFull=0; for(const k in comp){compEff[k]=CD.cP[k]*realSp+CD.cN[k]*(k==="taxAis"?realSp:real)+(k==="taxAis"?topLeak*realSp:0); progFull-=compEff[k];}
  // dépenses chiffrées au-dessus de l'annonce par un chiffrage indépendant : retenues hors du mode « tel qu'annoncé » (même règle pour tous)
  const over=mode==="annonce"?0:(p.spendOver||0)/GP*100*realSp; compEff.fonct+=over; comp.fonct+=mode==="annonce"?0:(p.spendOver||0)/GP*100; progFull-=over;
  // revenus des ménages : gains (dépenses, baisses d'impôts) en entier, pertes sur les plus aisés réduites par la fuite seulement, autres pertes × crédibilité ; Md€ de fin de mandat rapportés aux revenus de fin de mandat
  const uS=(b.gdpMd/GP); let paEff=null, decEff=null;
  if(p.paMeasures&&typeof microsimSplit==="function"){const S=microsimSplit(p.paMeasures,leakM); paEff={}; for(const g in S.pos.pa) paEff[g]=uS*(S.pos.pa[g]*realSp+S.top.pa[g]*realSp+S.neg.pa[g]*real); decEff=S.pos.deciles.map((v,i)=>uS*(v*realSp+S.top.deciles[i]*realSp+S.neg.deciles[i]*real));}
  else {paEff={}; for(const [g] of GROUPS) paEff[g]=(p.pa?p.pa[g]:0)*real; decEff=(p.paDec||Array(10).fill(0)).map(v=>v*real);}
  // économies non détaillées : la moitié retombe sur les ménages (prestations, services payants), répartie à parts égales par personne, l'autre moitié sur les services publics
  const inhMd=(p.paMeasures||[]).filter(m=>/h[ée]ritage|succession/i.test(m[0])&&m[1]<0).reduce((a,m)=>a-m[1],0); // Md€ de hausse des droits sur les héritages
  const ndSav=Math.max(0,-(CD.resid||0)); if(ndSav>0&&typeof microsim==="function"){const M=microsim([["nd",-ndSav*0.5*GP/100,"tete"]],0); for(const g in paEff) paEff[g]+=uS*M.pa[g]*real; decEff=decEff.map((v,i)=>v+uS*M.deciles[i]*real);}
  const xPrev={}, imp=[]; for(const k in comp) xPrev[k]=0; gap=b.gap0||0; let gapO=b.gap0||0, struct=0, sOtherPrev=b.pd0, migN=0, migW=0, migLevelPrev=0, oilLevPrev=0, pDevPrev=0, depPrev=1, subLevPrev=0; const billHist=[];
  const o={retreat:[0],tensGdp:[0],house:[100],rent:[100],ca:[-0.4],defEtat:[4.4],defSecu:[0.2],defLoc:[0.5],inh:[10],succ:[0.5],brent:[69],icf:[b.icf0],births:[b.births0],mig:[0],nw:[b.nw0],react:[0],spread:[0.75],rating:[0],defense:[b.def0],growth:[b.realg],infl:[b.infl],youth:[b.youth0],po:[b.po0],dep:[b.dep0],energy:[b.energy0],artif:[b.artif0],cons:[b.cons0],sp:[b.sp0],ratioEl:[(LEV[9]+IK[9])/(LEV[0]+IK[0])],ratioMon:[LEV[9]/LEV[0]],emp55:[emp55],w10:[w10],snow:[0],prim:[0],debt:[d],def:[null],unemp:[u],gini:[b.gini0],pov:[b.pov0],health:[0],heat:[b.heatBase],tension:[40],burden:[burden],co2:[co2],pm:[b.pm0],pens:[b.pensBal0],retliv:[b.retLiv0-0.42],pa:{}};
  for(const [g] of GROUPS) o.pa[g]=[100];
  for(let t=START+1;t<=END;t++){
    const SH=[[b.shock,b.shockYear],[b.shock2||"none",b.shockYear2||0]], hasS=(ty,k)=>SH.some(([x,Y])=>x===ty&&t-Y===k), z={real:0,infl:0,spread:0,euMult:1,pd:0,deaths:0,tension:0}; let deathsClim=0, deathsEpid=0;
    const EX=b.ext||null, exAt=k=>EX&&EX[k]&&EX[k][t]||0; z.real+=exAt("g"); z.infl+=exAt("pi"); z.pd+=exAt("pd"); z.tension+=exAt("ten"); // contexte imposé, année par année (test sur les mandats passés)
    for(const [ty,Y] of SH){ if(ty==="none") continue; const q=shockAt(ty,Y,t); for(const kk of ["real","infl","spread","pd","tension"]) z[kk]+=q[kk]; z.euMult=Math.max(z.euMult,q.euMult); if(ty==="climat") deathsClim+=q.deaths; if(ty==="pandemie") deathsEpid+=q.deaths; } // deux chocs possibles sur vingt ans
    if(mode!=="annonce"){ const tgt=1-0.4*Math.max(0,Math.min(1,(tension-60)/20)); retreat=tgt<retreat?Math.max(tgt,retreat-0.1):Math.min(tgt,retreat+0.03); } // recul progressif au-delà de 60 de tension (jusqu'à 40 % du programme à 80), et retour lent quand la tension retombe
    if(mode!=="annonce" && retreat<0.97){ if(!retreatSaid&&p.id!=="statu"){retreatSaid=true;E(t,"retreat","Tension sociale au-dessus de 60 : le gouvernement recule progressivement sur une partie du programme (jusqu'à 40 % quand la tension atteint 80).");} } // recul face à la contestation
    if(t===2027&&p.id!=="statu") E(t,"start","Entrée en vigueur du programme, montée en charge sur cinq ans.");
    for(const [ty,Y] of SH) if(t===Y&&ty!=="none") E(t,"shock",SHOCKTXT[ty]);
    if(t===2027&&p.bce>0) E(t,"bce",bceOn?"Gel de la dette détenue par la BCE accepté : charge d'intérêts allégée.":"Gel de la dette détenue par la BCE refusé (probabilité d'acceptation retenue : "+Math.round(bceProb*100)+" %) : pas d'allègement des intérêts.");
    const phase=t<2027?0:Math.min((t-2026)/5,1);
    // seniors : report ou avancée de l'âge de départ
    const sh0=p.ageShift||0, agePh=sh0>0?ramp(t,2026,2027+4*sh0):ramp(t,2026,2027+1.5*Math.abs(sh0));
    const sh=sh0*b.ageEff*pol*retreat*agePh, keep=sh>0?b.seniorKeep:0.85;
    uSenLast=sh>0?sh*0.3*(1-keep):sh*0.05; ageRealLast=sh;
    const empEff=sh*10*0.35*keep, uSen=sh>0?sh*0.3*(1-keep):sh*0.05, benefitCost=sh>0?sh*(1-keep)*0.12:0;
    if(sh0!==0&&agePh>=1&&ramp(t-1,2026,sh0>0?2027+4*sh0:2027+1.5*Math.abs(sh0))<1) E(t,"age","Changement d'âge de départ achevé : effet complet sur l'emploi des seniors et sur les retraites.");
    const defSp=b.def0+b.lpm*ramp(t,2025,2030)+(p.defense||0)*(p.defense>0?realSp:real)*retreat*ramp(t,2027,2035); // défense : loi de programmation militaire pour tous, plus l'écart propre au programme
    // vieillissement hors retraites (santé, dépendance) et dégradation des retraites selon le COR, après 2030 (jusqu'en 2030, la tendance du comité d'experts les comprend déjà)
    const icfE=b.icf0+(b.icfRef-b.icf0)*ramp(t,2025,2028)+b.famElast*(p.famMd||0)*((p.famMd||0)>0?realSp:real)*retreat*ramp(t,2027,2032);
    const ageing=b.ageCost*ramp(t,2030,2046)+b.pensDef*(0.7*ramp(t,2030,2045)-(icfE-1.45)/0.25*ramp(t,2045,2070));
    // engagement OTAN (La Haye, 2025 : 3,5 % du PIB en 2035) au-delà de la loi de programmation, sauf pour les programmes qui le rejettent ; un renfort de défense propre au programme en tient lieu
    const natoX=p.nato===0?0:Math.max(0,b.natoGap-Math.max(0,p.defense||0))*ramp(t,2030,2035);
    let s=b.pd0-progFull*retreat*phase+benefitCost+(p.defInA?0:defSp-b.def0)+ageing+natoX; // défense déjà financée dans l'objectif de déficit des programmes construits à partir d'une cible
    // règle de réaction des gouvernements suivants (après le mandat 2027-2032) : ils corrigent le déficit quand la dette continue de monter
    if(t===2032) dRef=b.d0; // référence : la dette de 2025
    const react=t>=2032&&dRef!==null?Math.min(b.reactMax,b.fiscalReact*Math.max(0,d-dRef))*ramp(t,2031,2040):0; // montée progressive sur huit ans, pour éviter un à-coup de croissance
    s-=react;
    if(react>0.3&&!reactSaid){reactSaid=true;E(t,"react","Après 2031, les gouvernements suivants corrigent une partie du déficit en fonction du niveau de la dette (règle de réaction budgétaire).");}
    const refus=b.exit==="refus"; // sortie de crise : programme européen (prêts contre économies) ou refus (contrôle des capitaux, financement national, sortie de fait de l'euro)
    if(crisis!==null&&t-crisis<=5){ const s0=s; s=lastDef>3?Math.min(s,sPrev-(refus?0.75:1.5)):Math.min(s,sPrev); s=Math.max(s,s0-b.forcedMax); forcedCum=Math.max(0,s0-s); } // ajustement imposé pendant cinq ans
    else if(crisis!==null&&forcedCum>0){ const intPrev=lastDef-o.prim[o.prim.length-1]; forcedCum=Math.min(forcedCum,Math.max(0,s+intPrev-3)); s-=forcedCum; if(forcedCum<0.05&&!relSaid){relSaid=true;E(t,"release","Fin du programme : le déficit tenant sous 3 %, les économies imposées sont relâchées.");} } // ensuite, les économies imposées ne restent que pour tenir le déficit sous 3 %
    // climat
    const adapt=Math.min(1,Math.max(0,p.climInv*realSp)/b.climNeed)*ramp(t,2027,2035);
    const climDrag=t>=2027?C.dmg*(1-0.5*adapt):0;
    // IA
    const cushion=Math.min(1,0.2+(p.aiCushion-0.2)*(p.aiCushion>0.2?realSp:real)), adopt=1+(p.aiAdopt-1)*real;
    const aiRamp=ramp(t,2026,2032), aiProd=I.prod*adopt*aiRamp*(t<=b.aiFade?1:Math.max(0,1-(t-b.aiFade)/6)); // gain de productivité de l'IA : effet de niveau étalé sur une quinzaine d'années, puis la croissance revient à sa tendance
    const hump=t<=2034?ramp(t,2026,2032):Math.pow(0.85,t-2034);
    const aiDisp=I.disp*hump*(1-cushion);
    // croissance
    const lr=t>=2032?p.longRun*pol*ramp(t,2031,2039):0;
    const scar=(crisis!==null&&t-crisis>=1&&t-crisis<=6)?0.4:0; // séquelles durables d'une crise
    const rttPh=p.rtt?pol*retreat*ramp(t,2026,2031):0, rttSupply=p.rtt&&t>=2027&&t<=2031?-0.12*(1-b.rtt)*pol*retreat:0;
    // rendement des services publics (éducation, santé : effet après 5 ans) et de l'investissement public (après 3 ans)
    spHist.push((p.spServ||0)*((p.spServ||0)>0?realSp:real)*retreat*phase); invHist.push((Math.max(0,p.climInv)-0.2)*realSp*retreat*phase);
    const KSp=KS, KIp=KI; KS=KS*0.95+(spHist.length>5?spHist[spHist.length-6]:0); KI=KI*0.97+(invHist.length>3?invHist[invHist.length-4]:0);
    const pubRet=b.spRet*(KS-KSp)+b.invRet*(KI-KIp); // invRet = 0 par défaut : le rendement de l'investissement public est déjà dans son multiplicateur
    // inégalités et croissance de long terme (OCDE, Cingano 2014 : surtout via l'éducation des ménages modestes) : effet décalé de trois ans, réglable, nul en lecture libérale
    const giniLag=o.gini.length>=3?o.gini[o.gini.length-3]:b.gini0, ineqDrag=b.ineqGrowth*100*(giniLag-b.gini0)*ramp(t,2027,2047); // effet qui passe surtout par l'éducation des enfants : il monte en puissance sur vingt ans
    // solde migratoire : écart à la tendance (milliers par an), réduit par la solidité juridique comme les autres mesures touchant aux droits ; il change le nombre d'actifs, donc le PIB total (le PIB par habitant bouge peu)
    const migReal=mode==="annonce"?1:mode==="pondere"?f:(p.legal==null?1:p.legal);
    const dm=(p.migDelta||0)*migReal*retreat*ramp(t,2026,2030); migN+=dm; migW+=dm*b.migWork;
    const migLevel=b.migGdp*migW/b.emp0*100, migGrowth=migLevel-migLevelPrev; migLevelPrev=migLevel;
    const supply=migGrowth+(t>=2027&&t<=2036?p.supply*pol:0)+lr+aiProd-climDrag-scar+0.17*(empEff-empPrev)+rttSupply+pubRet-ineqDrag; empPrev=empEff;
    if(t===2032&&Math.abs(p.longRun*pol)>=0.03) E(t,"lr",(p.longRun>0?"Les réformes commencent à relever":"Les réformes commencent à freiner")+" la croissance de long terme ("+(p.longRun>0?"+":"")+(p.longRun*pol).toFixed(2)+" pt par an à terme).");
    const gapPrev=gap, structPrev=struct;
    const dec0=decEff;
    // effet des mesures du programme sur l'activité : multiplicateur propre à chaque type de mesure, selon le temps écoulé
    const progBal=progFull*retreat*phase, dx={}; let dxAny=false;
    const defOut=(p.defInA?0:defSp-b.def0)+natoX; // défense hors effort annoncé (loi de programmation pour tous) : traitée comme une dépense de fonctionnement
    for(const k in comp){const x=compEff[k]*retreat*phase+(k==="fonct"?defOut:0); dx[k]=x-xPrev[k]; xPrev[k]=x; if(Math.abs(dx[k])>1e-9) dxAny=true;}
    if(dxAny) imp.push({t,dx});
    let cyc=0; struct=0;
    for(const q of imp){const h=t-q.t+1, w=ramp(h,3,10); for(const k in q.dx){const e=q.dx[k]*multAt(k,h)*b.multScale; cyc+=e*(1-w); struct+=e*w;}} // la part durable devient un effet sur le niveau du PIB potentiel
    // autres variations du solde (ajustement imposé, règle de réaction, défense hors programme…) : multiplicateur moyen, plus fort en crise
    const sOther=s+progBal-defOut;
    const gapOPrev=gapO; gapO=0.5*gapO-(crisis!==null&&t-crisis<=5?Math.max(b.mult,1.5):b.mult)*(sOtherPrev-sOther)+z.real+(crisis===t-1?(refus?-5:-2):0); sOtherPrev=sOther; // choc de la crise l'année suivant son déclenchement
    const hystLoss=(crisis!==null&&t-crisis>=1&&t-crisis<=6)?0:b.hyst*Math.max(0,-gapOPrev); // séquelles durables des récessions et ajustements hors programme (les effets durables des mesures sont déjà dans les multiplicateurs ; en crise, ils sont comptés à part)
    gap=gapO+cyc;
    // énergie et pétrole : écart au scénario « tendance » (déjà compris dans la conjoncture 2026-2028) ; l'exposition suit la consommation d'énergies fossiles du programme
    const EN=ENERGY[b.energy]||ENERGY.tendance, pT=interpYear(ENERGY.tendance.p,t), pS=interpYear(EN.p,t)+(hasS("petrole",0)?45:hasS("petrole",1)?25:0);
    const fdep=depPrev, pDev=pS-pT; // exposition : consommation fossile de l'année précédente (indice 2025 = 1)
    let ration=0; if(EN.supply){const sup=interpYear(EN.supply,t); ration=Math.max(0,fdep-sup);} // pétrole demandé au-delà de l'offre disponible
    const oilLev=-b.oilGdp*pDev*fdep-b.oilCoupling*ration*100*0.39; // niveau du PIB, en % (le pétrole pèse 39 % de l'énergie finale)
    const oilGrowth=oilLev-oilLevPrev; oilLevPrev=oilLev;
    const oilInfl=b.oilPi*(pDev-pDevPrev)*fdep; pDevPrev=pDev;
    // indépendance énergétique : les importations fossiles évitées par rapport à la tendance (−1,5 %/an) deviennent en partie de la production en France
    const depTrend=Math.pow(1-b.co2Base/100,t-1-START), priceF=0.75*pS/69+0.25*Math.max(0.6,pS/69);
    const subLev=b.importSub*b.energy0*priceF*(depTrend-fdep)/b.gdpMd*100, subGrowth=subLev-subLevPrev; subLevPrev=subLev;
    // coût de la transition : des investissements qui remplacent les énergies fossiles sans accroître la capacité de production (Pisani-Ferry et Mahfouz, 2023)
    const transCost=t>=2027&&t<=2035?b.transDrag*Math.max(0,(p.climInv||0)-0.2)*realSp*retreat*phase:0;
    const billBase=b.energy0*fdep, bill=billBase*(0.75*pS/69+0.25*Math.max(0.6,pS/69)), billT=billBase*(0.75*pT/69+0.25*Math.max(0.6,pT/69));
    const billRef=billHist.length?billHist.slice(-3).reduce((a,v)=>a+v,0)/Math.min(3,billHist.length):bill; billHist.push(bill);
    const shield=b.bouclier*Math.max(0,bill-Math.max(billRef,billT))/b.gdpMd*100; // aides publiques temporaires face à une hausse brutale (bouclier tarifaire) : elles s'éteignent quand les prix se stabilisent
    if(hasS("petrole",0)) E(t,"oil","Flambée du pétrole : +45 $ le baril, puis +25 $ l'année suivante (type 2022). Facture énergétique, inflation, aides publiques.");
    const near=NEAR[t]||{g:0,pi:0}; // conjoncture : Banque de France, septembre 2026
    const uProg=(t>=2027?p.uStruct*pol:0)+smicUprev; const uLev=-b.uGdp*uProg, uG=uLev-uLevPrev; uLevPrev=uLev; // chômage structurel changé par le programme (assurance chômage, Smic) : moins d'actifs occupés, donc moins de PIB
    cumProg+=progBal; const crowdLev=b.crowd*cumProg, crowdG=crowdLev-crowdPrev; crowdPrev=crowdLev; // éviction : la dette publique ajoutée (ou retirée) par le programme détourne (ou libère) une partie de l'épargne pour l'investissement privé (CBO : 0,33 € par € de déficit, part du capital 0,35 ; zone euro ouverte : moitié) ; effet de niveau sur le PIB, la tendance de référence comprenant déjà le statu quo
    const lfG=b.demog?interpYear(LF,t)-LF[2026]:0; // ralentissement puis baisse de la population active
    const tensLev=-(b.tensCost||0)*Math.max(0,tension-60), tensG=tensLev-tensLevPrev; tensLevPrev=tensLev; // tension forte (grèves, blocages, incertitude) : activité perdue tant qu'elle dure, récupérée ensuite (gilets jaunes : −0,1 pt de PIB au 4e trimestre 2018, Insee)
    const realg=b.realg+tensG+lfG+crowdG+uG+oilGrowth+subGrowth-transCost+supply+(gap-gapPrev)+(struct-structPrev)-hystLoss+(b.calib?near.g:0);
    const kc=crisis===null?-1:t-crisis, exitInfl=refus&&kc>=1&&kc<=3?[0,6,3,1][kc]:0; // refus : dévaluation de la nouvelle monnaie ou financement monétaire (Argentine 2002, Islande 2008 : 15 à 25 % d'inflation ; ici plus modéré)
    const crisisDisinfl=(!refus&&kc>=1&&kc<=3)?[0,-1.0,-0.7,-0.3][kc]:0; // crise avec programme : désinflation (Espagne, Portugal, Italie 2012-2014)
    const pi=b.infl+oilInfl+exitInfl+crisisDisinfl+(t>=2029?b.phil*(b.uStar-u):0)+(b.calib?near.pi:0)+z.infl+(t===2027||t===2028?p.inflImp*real:0);
    // pauvreté et dépenses publiques : surcoûts de santé, d'éducation et de justice liés à la pauvreté (39 Md€ pour environ 9,8 millions de personnes, Collectif Alerte et Oliver Wyman, 2024),
    // en Md€ par point de taux de pauvreté au-dessus ou au-dessous de 2025, avec un effet qui s'installe sur plusieurs années (les personnes concernées sont proches du seuil : effet partiel)
    const climF={aucun:0,moderee:0.8,forte:1,tresforte:1.3}[b.clim]||1, climBud=b.climCost*(0.13*(1+ramp(t,2025,2050))*climF*(1-0.4*adapt)-0.13); // intempéries : catastrophes naturelles (part publique de la CCR), calamités agricoles, réparations publiques ; ≈ 0,13 % du PIB en 2025, doublement d'ici 2050 (France Assureurs), réduit par l'adaptation
    const povCost=climBud+b.povSave*povS/b.gdpMd*100+b.uDef*((t>=2027?p.uStruct*pol:0)+smicUprev); // + allocations chômage et recettes perdues quand le chômage structurel change
    const pd=s+povCost-b.stab*gap+z.pd+shield-b.migFisc*migN/1000+I.tax*hump*(1-0.5*cushion)+b.aiCost*Math.max(0,cushion-0.2)/0.8*hump*I.disp/1.2; // l'amortisseur IA (formation, accompagnement) a un coût
    const sm=(x,th)=>Math.max(0,Math.min(1,(x-th+1)/2)), notch=(burden>8?1:0)+(burden>11?1:0)+(burden>14?1:0);
    const rating=b.ratingW*(0.2*sm(burden,8)+0.4*sm(burden,11)+0.8*sm(burden,14)); // dégradations de note : vers 8, 11 et 14 % des recettes, sans saut brutal
    const polPrem=b.premPol*(t<=2027?1:Math.pow(b.premPolDecay,t-2027)); // prime d'instabilité politique actuelle, qui se résorbe après l'élection
    const piPrev=o.infl[o.infl.length-1], defAdj=lastDef-Math.max(0,piPrev-2)*d/100; // déficit corrigé de l'érosion de la dette par l'inflation au-delà de 2 %
    let prem=b.prem*Math.max(0,defAdj-3)+b.kDebt*Math.max(0,d-120)/10+rating+polPrem+(b.calib&&near.prem?near.prem:0)+(t>=2027?p.eu*euW*z.euMult*(t<=2031?1:Math.pow(0.8,t-2031)):0)+z.spread; // conflit avec l'UE : prime pleine pendant le mandat, puis elle s'estompe (accord, alternance ou habitude des marchés)
    if(tpi!==null&&crisis===null&&lastDef>b.tpiDef+1){tpi=null;E(t,"tpioff","Le déficit dérive de nouveau au-delà de "+(b.tpiDef+1).toFixed(0)+" % du PIB : la BCE retire son filet.");}
    if(crisis!==null && t-crisis>=8 && tpi===null && prem>b.crisisPrem){ crisis=t; crisisN++; E(t,"crisis","Nouvelle crise de financement : la prime de risque dépasse de nouveau le seuil, huit ans ou plus après la précédente."); } // une seconde crise reste possible
    if(t>=2027 && crisis===null && tpi===null && prem>b.crisisPrem){
      if(p.eu*euW<0.2 && lastDef<=b.tpiDef){tpi=t; if(tpiFirst===null) tpiFirst=t;} else {crisis=t; crisisFirst=t;} // filet de la BCE (TPI) : seulement si le déficit est sur une trajectoire conforme aux règles européennes
    }
    if(tpi===t) E(t,"tpi","Primes de risque au-delà du seuil, mais le déficit est ramené sous "+b.tpiDef.toFixed(0)+" % et les règles européennes respectées : la BCE active son filet (TPI) et plafonne les taux.");
    if(crisis===t&&refus) E(t,"crisis","Crise de financement, programme européen refusé : contrôle des capitaux, banques et épargne contraintes de financer l'État, sortie de fait de l'euro (hypothèse très incertaine). Récession plus forte, inflation, ajustement budgétaire de 0,75 pt de PIB par an.");
    else if(crisis===t) E(t,"crisis","Crise de financement : la prime de risque dépasse "+b.crisisPrem.toFixed(1).replace('.',',')+" points. Prêts d'urgence sous condition, économies imposées de 1,5 pt de PIB par an, récession et chômage.");
    if(notch>ratingPrev&&t>=2027) E(t,"rating","La charge d'intérêts dépasse "+(notch>2?14:notch>1?11:8)+" % des recettes : dégradation de la note, les taux montent."); ratingPrev=notch;
    if(tpi!==null) prem=Math.min(prem,1.0);
    if(premRef===null) premRef=prem;
    const premMkt=prem; if(crisis!==null&&t-crisis<5) prem=refus?Math.min(prem,1.5):prem*0.5; else if(crisis!==null&&!refus&&t-crisis<10) prem*=0.5+0.5*(t-crisis-5)/5; // après le programme, la prime revient progressivement (Portugal : écart de taux encore en baisse cinq ans après la sortie de 2014), pas d'un coup // prêts d'urgence à taux réduit pendant cinq ans ; en cas de refus, banques et épargnants contraints de financer l'État à taux plafonné (répression financière)
    const wNew=Math.min(0.5,b.roll+Math.max(0,lastDef)/Math.max(d,1)); const ecbAdj=b.ecb*((b.calib?near.pi:0)+oilInfl+z.infl); rf=b.mktReal+ecbAdj+exAt("r"); ieff+=(rf+pi+prem-ieff)*wNew; // la BCE réagit à l'inflation de la zone euro (composantes communes : énergie, chocs, conjoncture), pas aux mesures françaises // dette à taux fixe : un huitième renouvelé chaque année au taux de marché, plus la dette nouvelle qui finance le déficit
    const i=((1-b.idxShare)*ieff+b.idxShare*(b.idxReal+pi))*(1-(t>=2027?p.bce*bceOn:0)); // environ 10 % de titres indexés sur l'inflation : leur coût suit l'inflation tout de suite (comme en 2022-2023)
    const ng=(1+realg/100)*(1+pi/100)-1;
    const interest=d*i/100/(1+ng); // intérêts rapportés au PIB de l'année
    const bank=(crisis!==null&&t===crisis+1&&!refus)?b.bankCrisis:0; // soutien aux banques pendant la crise (Espagne 2012 : ≈ 4 % du PIB ; Portugal ≈ 3 %), compté dans la dette, pas dans le déficit
    const sf=(b.calib&&near.sf)?near.sf:0; // ajustements stocks-flux (trésorerie de l'État)
    const dOld=d; d=Math.max(0,d*(1+i/100)/(1+ng)+pd+bank+sf); o.snow.push(d-dOld-pd); o.prim.push(pd);
    lastDef=pd+interest; burden=interest/b.rev*100;
    const okunEff=(hasS("pandemie",0)||hasS("pandemie",1))?0.15:1; // activité partielle : en 2020-2021, l'emploi a été protégé malgré la chute du PIB
    const smicU=b.smicEl*(p.smicCost||0)*0.17*ramp(t,2026,2029)*pol*retreat; smicUprev=smicU; // hausse du Smic : emplois au Smic (17 % des salariés) sensibles au coût du travail
    u=u+(b.calib&&near.du?near.du:0)+b.uSpeed*(b.uStar+(t>=2027?p.uStruct*pol:0)+smicU+aiDisp+uSen-1.1*b.rtt*rttPh-u)-b.okun*okunEff*(gap-gapPrev);
    // CO2 : tendance actuelle (−1,5 %/an) remplacée par le rythme du programme, l'activité module à la marge
    const rate=b.co2Base+(p.co2Rate-b.co2Base)*real*retreat*ramp(t,2026,2030);
    co2=co2*(1-rate/100)*(1+0.5*(gap-gapPrev)/100);
    // pollution de l'air (PM2.5) : suit les émissions de combustion, plus un progrès technique de 1 %/an
    const pm=b.pm0*Math.pow(co2/b.co2_0,0.8)*Math.pow(0.99,t-START);
    // retraites : trajectoire COR (−0,2 % du PIB jusqu'en 2030, −0,9 % en 2045) + effet du programme (déjà compris dans le déficit)
    // natalité : fécondité de référence du COR (1,45 enfant par femme dès 2028, Insee 1,56 en 2025), plus l'effet de la politique familiale du programme (avec un an de décalage) ; les naissances n'entrent sur le marché du travail qu'après 2046, l'effet sur les retraites suit le COR (±1 pt de PIB en 2070 pour ±0,25 enfant), à partir de 2045
    const icf=b.icf0+(b.icfRef-b.icf0)*ramp(t,2025,2028)+b.famElast*(p.famMd||0)*((p.famMd||0)>0?realSp:real)*retreat*ramp(t,2027,2032);
    const births=b.births0*icf/b.icf0; o.icf.push(icf); o.births.push(births);
    const pens=(icf-1.45)/0.25*ramp(t,2045,2070)+(t<=2030?-0.2:-0.2-0.7*(t-2030)/15)+p.pensBal*(p.pensBal<0?realSp:real)*retreat*phase-0.15*Math.max(0,u-b.u0)+14*migW/b.emp0*Math.max(0,1-(t-2027)/30); // cotisations des actifs en plus ou en moins, effet qui s'estompe quand ils partent à la retraite (COR)
    const retliv=b.retLiv0-0.21*(t-2023)+p.retLiv*(p.retLiv>0?realSp:real)*retreat*phase-1.5*forcedCum;
    // pouvoir d'achat : croissance commune + mesures du programme + chômage + ajustement imposé + chocs d'inflation
    gdp*=1+realg/100; inflCum=inflCum*0.7+Math.max(0,z.infl)+exitInfl; // perte de pouvoir d'achat d'un choc de prix, rattrapée aux deux tiers en deux ans (Smic, minima et pensions indexés ; pouvoir d'achat par unité de consommation revenu à son niveau de 2021 dès 2024, Insee)
    // logement : prix et loyers réels. Taux immobilier ≈ taux à 10 ans + 1 ; +1 point de taux = −7 % sur les prix en deux ans (BCE, Banque de France) ; +1 % de logements en plus = −1,5 % sur les prix ; loyers : 30 % de la variation des prix, moins l'effet de l'offre
    const rMort=rf+premMkt+1, dR=rMort-(rMortPrev===null?rMort:rMortPrev); rMortPrev=rMort;
    const consNow=Math.max(120,b.cons0*Math.pow(1.01,t-START)*Math.max(0.6,1-b.rateSens*(premMkt-premRef))*(1+0.03*gap)+(p.housing||0)*realSp*retreat*phase), extraStock=(consNow-b.cons0*Math.pow(1.01,t-START))/38000*100;
    const hpG=0.5-3.5*dR-3.5*dRprev+0.5*(realg-1)-1.5*extraStock; dRprev=dR; hpI*=1+hpG/100; const rentG=0.3*hpGprev-0.5*extraStock; hpGprev=hpG; rentI*=1+rentG/100;
    o.house.push(hpI); o.rent.push(rentI);
    const rentHit={mod:0.125,jeu:0.21,moy:0.05}; // part des locataires × poids du loyer dans le revenu
    for(const [g,,su,sf,si] of GROUPS){
      o.pa[g].push(100*gdp*(1+paEff[g]*b.redistEff*retreat*phase/100)*(1-su*(u-b.u0)/100)*(1-sf*forcedCum/100)*(1-si*inflCum/100)*(1-(rentHit[g]||0)*(rentI-100)/100));
    }
    // revenus par décile : effet direct des mesures (microsimulation), chômage, ajustement imposé
    const k=b.redistEff*retreat*phase;
    const inc=LEV.map((L,i)=>L*(1+dec0[i]/100*k)*(1-SU_D[i]*(u-b.u0)/100)*(1-SF_D[i]*forcedCum/100));
    const chg=inc.map((v,i)=>100*(v/LEV[i]-1));
    const gini=b.gini0+(giniDec(inc)-G_DEC0)+I.gini*aiRamp*(1-0.5*cushion);
    const rel=0.4*chg[0]+0.6*chg[1]-chg[4]; // gain des ménages autour du seuil de pauvreté, relatif au revenu médian
    const pov=Math.max(5,b.pov0-b.povElast*rel); povS=0.8*povS+0.2*(pov-b.pov0); // le chômage agit déjà via les revenus des déciles
    const hs=p.healthSpend*(p.healthSpend>0?realSp:real)*retreat*phase;
    const heat=b.heatBase*Math.pow(1+C.heat,t-START)*(1-0.4*adapt)+deathsClim*(1-0.4*adapt);
    const epid=deathsEpid*(1-0.5*hs);
    const health=-0.6*(u-b.u0)-0.8*(pov-b.pov0)+6*hs*ramp(t,2027,2036)-epid/20000; // mois d'espérance de vie
    const unpop=Math.max(0.15,Math.min(1,Math.abs(p.A)/3));
    const rightsReal=mode==="pondere"?f:1; // la mobilisation répond à la tentative, même si une mesure est ensuite censurée
    const rightsT=t>=2027?b.tensionRights*(p.rightsPts||0)*rightsReal*(t===2027?1.5:retreat):0; // mobilisations contre les mesures touchant aux droits (grille qualitative)
    if(t===2027&&rightsT>=8) E(t,"rights","Fortes mobilisations contre les mesures touchant à l'égalité de traitement, aux libertés ou aux contre-pouvoirs.");
    tension=Math.max(0,Math.min(100,40+rightsT+4*(u-b.u0)+5*(pov-b.pov0)+25*(1-p.adh)*real*retreat*phase*unpop+3*Math.max(0,pi-3)+z.tension+(crisis===null?0:crisis===t?(refus?30:20):Math.max(0,(refus?18:12)-2*(t-crisis)))));
    emp55=Math.min(75,b.emp55_0+(t<=2032?0.6*(t-START):0.6*7+0.2*(t-2032))+empEff);
    const wf=(p.wealthFlow||0), wEff=wf<0?wf*(1-leakM):wf;
    w10=w10+0.05+wEff*real*retreat*phase/b.wealthMd*100*0.52;
    o.emp55.push(emp55);o.w10.push(w10);
    // logement : tendance +1 %/an, sensible aux taux (prime de risque) et à la conjoncture, plus l'effet du programme (milliers par an)
    const cons=Math.max(120,b.cons0*Math.pow(1.01,t-START)*Math.max(0.6,1-b.rateSens*(premMkt-premRef))*(1+0.03*gap)+(p.housing||0)*realSp*retreat*phase);
    // services publics individualisables (santé, école, logement, action sociale), % du PIB ; une partie de l'ajustement imposé les touche
    const sp=b.sp0+(p.spServ||0)*((p.spServ||0)>0?realSp:real)*retreat*phase-0.4*forcedCum-0.5*ndSav*real*retreat*phase;
    const ik=IK.map(v=>v*sp/b.sp0);
    o.cons.push(cons);o.nw.push(b.nw0-(d-b.d0)+KI);o.react.push(react);
    // croissance, inflation, chômage des jeunes (2,6 fois le taux global), prélèvements et dépense publique, facture énergétique, artificialisation
    const tmd=p.taxMd||0, topR=Math.min(Math.max(0,tmd),p.topRev||0), taxEff=(tmd<0?tmd*realSp:(tmd-topR)*real+topR*realSp-((p.topRev||0)-(p.topCut||0))*leakM*realSp)/GP*100*retreat*phase; // hausses × crédibilité (sauf sur les plus aisés : fuite), baisses en entier
    const po=b.po0+taxEff+0.3*forcedCum; const dep=po+(b.rev-b.po0)+lastDef; // dépense = prélèvements + autres recettes + déficit
    const zBase=t<=2031?0.04:0.03, zanRate=p.zan?zBase+(0.01-zBase)*pol*retreat*phase:zBase;
    artifS*=1-zanRate; const artif=artifS*Math.pow(cons/(b.cons0*Math.pow(1.01,t-START)),0.6);
    o.growth.push(realg);o.retreat.push((1-retreat)*100);o.tensGdp.push(tensLev);o.infl.push(pi);o.youth.push(b.youth0*u/b.u0);o.po.push(po);o.dep.push(dep);o.energy.push(bill);o.brent.push(pS);depPrev=co2/b.co2_0;o.artif.push(artif);o.sp.push(sp);o.ratioEl.push((inc[9]+ik[9])/(inc[0]+ik[0]));o.ratioMon.push(inc[9]/inc[0]);
    o.spread.push(premMkt);o.rating.push(notch+(crisis!==null?2:0)+(tpi!==null?1:0));o.defense.push(defSp+natoX);
    // solde extérieur courant (indicateur, sans rétroaction sur le PIB : les multiplicateurs comprennent déjà les importations) : −0,4 % du PIB en 2025 (Banque de France) ; importations = 30 % de la demande en plus ; facture énergétique ; compétitivité-coût (coût du travail : Smic, baisses de cotisations ; élasticité-prix des exportations 0,6, transmission 0,5)
    const ulc=0.1*(p.smicCost||0)*ramp(t,2026,2029)*pol*retreat-0.5*Math.max(0,compEff.entr||0)*retreat*phase/0.52; // en % du coût du travail
    o.ca.push(-0.4-0.3*(cyc+struct+gapO)-(bill-b.energy0)/b.gdpMd*100-0.1*ulc);
    // déficit par administration (avant transferts de compensation entre administrations) : 2025 État 4,4, Sécurité sociale 0,2, collectivités 0,5 (Insee)
    const shA={trAutres:0.8,trMod:0.5,taxLarge:0.4,taxMod:0.6,entr:0.3,fonct:0.1}, shL={inv:0.5,log:0.2,fonct:0.15}; let pA=0,pL=0; for(const k in compEff){pA+=(shA[k]||0)*compEff[k]*retreat*phase; pL+=(shL[k]||0)*compEff[k]*retreat*phase;}
    const intD=interest-2.2, dSecu=0.2+ageing+b.uDef*((t>=2027?p.uStruct*pol:0)+smicUprev)+0.5*(povCost-climBud-b.uDef*((t>=2027?p.uStruct*pol:0)+smicUprev))+0.1*intD+pA-0.3*react-0.3*forcedCum, dLoc=0.5+0.4*climBud+0.05*intD+pL-0.1*react-0.1*forcedCum;
    o.defSecu.push(dSecu); o.defLoc.push(dLoc); o.defEtat.push(lastDef-dSecu-dLoc);
    // héritages et donations : ≈ 300 Md€ par an, 15 % du revenu national (CAE, 2021), en hausse avec le vieillissement ; droits de succession ≈ 0,5 % du PIB, plus les mesures des programmes sur les héritages
    const succProg=inhMd*(1-leakM)*realSp/GP*100*retreat*phase; o.inh.push(10+0.08*(t-START)); o.succ.push(0.5+succProg);
    o.mig.push(migW);o.debt.push(d);o.def.push(lastDef);o.unemp.push(u);o.gini.push(gini);o.pov.push(pov);o.health.push(health);o.heat.push(heat+epid);o.tension.push(tension);o.burden.push(burden);o.co2.push(co2);o.pm.push(pm);o.pens.push(pens);o.retliv.push(retliv);
    sPrev=s;
  }
  o.comp=comp;o.ev=ev;o.uSen=uSenLast;o.ageReal=ageRealLast;o.topLeak=topLeak;o.real=real;o.realSp=realSp;o.compEff=compEff;o.progFull=progFull;o.f=f;o.crisis=crisisFirst;o.crisisLast=crisis;o.crisisN=crisisN+(crisisFirst!==null?1:0);o.tpi=tpiFirst;return o;
}
if(typeof module!=="undefined") module.exports={ENERGY,ENERGYTXT,BASE0,SHOCKTXT,simulate,feas,START,END,GROUPS,MULT,MULTLABEL,fiscalComp,fiscalCompDetail,multAt};
