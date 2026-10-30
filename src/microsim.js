// Microsimulation simplifiée : montant de chaque mesure (Md€ par an en fin de mandat, + = gain des ménages)
// réparti par décile selon une clé d'incidence, rapporté au revenu disponible de chaque décile (Insee 2024).
const LEVELS=[9960,15890,19400,22430,25310,28290,31670,36040,43010,76970]; // niveau de vie moyen par décile, Insee 2024
const RDB=1550; // revenu disponible des ménages, Md€ (ordre de grandeur Insee)
const DEC_INC=LEVELS.map(v=>v/LEVELS.reduce((a,b)=>a+b,0)*RDB); // Md€ par décile
const KEYS={ // part de la mesure reçue ou payée par chaque décile (somme = 100)
 minima:[40,25,15,9,5,3,2,1,0,0],          // RSA, APL, minima, prime d'activité (DREES)
 chomage:[18,16,13,11,10,9,8,7,5,3],       // assurance chômage
 bassal:[8,14,16,15,13,11,9,7,5,2],        // Smic, CSG sur bas salaires
 fonction:[2,5,8,10,11,12,13,14,14,11],    // salaires publics
 retraites:[4,7,9,10,10,11,11,12,12,14],   // pensions
 capital:[0.5,0.5,0.5,0.5,0.5,0.5,1,2,6,88],// revenus et patrimoines du capital (IPP)
 ir:[0,0,1,2,3,5,7,10,15,57],              // impôt sur le revenu et niches associées
 conso:[5,6.5,7.5,8.5,9,10,11,12,13,17.5], // TVA, taxes sur l'énergie
 tete:[10,10,10,10,10,10,10,10,10,10],     // montant identique par personne
 entreprises:[1,1,2,2,3,3,4,8,16,60],      // baisses d'impôts des entreprises, via les actionnaires
 heuressup:[3,8,11,13,13,13,12,11,9,7]     // heures supplémentaires défiscalisées
};
const RET_INC=420, JEU_INC=160; // revenus des retraités et des 18-29 ans, Md€ (ordres de grandeur)
const RET_SHARE={retraites:1,conso:0.25,tete:0.25,ir:0.2,capital:0.25,minima:0.1};
const JEU_SHARE={chomage:0.3,bassal:0.3,minima:0.2,conso:0.12,tete:0.15,fonction:0.1,heuressup:0.15,jeunes:1};
const TOPKEYS={capital:1,ir:1}; // recettes perdues (CAE 2025) : impôts sur le capital, les patrimoines et le revenu des plus aisés, pas l'impôt des entreprises
function microsim(list,leak=0){
  const dec=Array(10).fill(0); let ret=0, jeu=0;
  for(const [label,md0,key] of list){
    const md=md0<0&&TOPKEYS[key]?md0*(1-leak):md0;
    if(key!=="jeunes") KEYS[key].forEach((s,i)=>dec[i]+=md*s/100);
    ret+=md*(RET_SHARE[key]||0); jeu+=md*(JEU_SHARE[key]||0);
  }
  const pct=(a,b)=>a.reduce((s,_,i)=>s+dec[i],0); 
  const grp=(i0,i1)=>{let g=0,inc=0;for(let i=i0;i<=i1;i++){g+=dec[i];inc+=DEC_INC[i];}return 100*g/inc;};
  return {pa:{mod:grp(0,2),moy:grp(3,6),ais:grp(7,8),top:grp(9,9),ret:100*ret/RET_INC,jeu:100*jeu/JEU_INC},
    deciles:dec.map((g,i)=>100*g/DEC_INC[i])};
}
// [libellé, Md€ par an, clé d'incidence, origine de la mesure, origine du montant, catégorie budgétaire si différente de celle de la clé]
// origine : prog = programme ou plan du candidat, parti = document du parti ou contre-budget, decl = déclaration publique du candidat
// montant : cand = chiffre du candidat ou du parti (annualisé si besoin), inst = estimation d'un institut, sim = estimation du simulateur
const ORIG={prog:"Programme du candidat",parti:"Document du parti",decl:"Déclaration publique"}, CHIF={cand:"chiffré par le candidat ou le parti",inst:"chiffré par un institut",sim:"estimé par le simulateur"};
const PA_MEASURES={
 statu:[],
 melenchon:[["Smic à 1 700 € net (gain après baisse de la prime d'activité, calcul OpenFisca : 72 % du gain de salaire)",10.8,"bassal","prog","sim","none"],["APL +10 % et logement",8,"minima","parti","cand"],["Indexation des prestations, lutte contre la pauvreté",5,"minima","prog","sim"],["Abrogation des réformes de l'assurance chômage",3,"chomage","prog","sim"],["Point d'indice des fonctionnaires",17,"fonction","parti","cand"],["Retraite à 60 ans avec 40 annuités, indexation des pensions",22,"retraites","decl","inst"],["Allocation d'autonomie des jeunes (partielle)",6,"jeunes","prog","sim"],
   ["ISF climatique",-10,"capital","parti","cand"],["Suppression de la flat tax",-9,"capital","parti","cand"],["Taxe Zucman (patrimoines > 100 M€)",-15,"capital","parti","cand"],["Taxe sur les héritages",-20,"capital","parti","cand"],["Rabot des niches fiscales",-22,"ir","parti","cand"],["Impôts sur les sociétés, GAFAM, transactions",-8,"entreprises","parti","sim"]],
 lepen:[["TVA à 5,5 % sur l'énergie et les carburants",10,"conso","prog","sim"],["Suppression de taxes",5,"conso","parti","sim"],["Abrogation des 64 ans : départ entre 60 et 62 ans selon l'âge d'entrée au travail",14,"retraites","decl","inst"],["Exonération d'impôt pour les moins de 30 ans",2,"jeunes","prog","sim","taxLarge"],["Priorité nationale et allocation sociale unique",-5,"minima","prog","sim"]],
 philippe:[["Retraite à 65 ans et 45 annuités (pensions versées plus tard)",-15,"retraites","prog","sim"],["Économies d'assurance chômage",-4.5,"chomage","prog","sim"],["Autres économies sociales",-5,"minima","prog","sim"],["Stabilisation des dépenses de santé (reste à charge)",-5,"tete","prog","sim"],["Autres économies sociales non détaillées (la moitié de l'effort porte sur le social)",-15.5,"tete","prog","sim"],["Heures supplémentaires exonérées",3,"heuressup","prog","sim"],["Baisse des impôts de production (nette des aides supprimées)",0,"entreprises","prog","cand"]],
 glucksmann:[["Taxation des méga-héritages",-15,"capital","decl","cand"],["Révision de la flat tax",-5,"capital","parti","sim"],["Baisse de la CSG sur les salaires (14 Md€ ; gain après baisse de la prime d'activité, calcul OpenFisca : 75 %)",10.5,"bassal","decl","inst"],["Smic à 1 600 € net en deux ans (payé par les employeurs, gain après prime d'activité)",6.6,"bassal","decl","sim","none"],["Rémunération des fonctionnaires",14,"fonction","decl","inst"],["Retour à 62 ans, adapté à la pénibilité",10,"retraites","decl","inst"],["Pass transport et aides aux jeunes",1,"jeunes","parti","sim"]],
 retailleau:[["63 ans avec décote, taux plein à 65 ans",-12,"retraites","prog","cand"],["Fin des régimes spéciaux et convergence de l'Agirc-Arrco",-8,"retraites","prog","sim"],["Économies d'assurance chômage",-30,"chomage","prog","cand"],["Allocation sociale unique et autres économies sociales",-15,"minima","prog","cand"],["Arrêts maladie",-4,"tete","prog","cand"],["Allocations familiales de 240 € par mois dès le premier enfant",23,"tete","prog","inst","trAutres"],["Suppression du quotient familial",-13,"ir","prog","inst"],["Baisse des cotisations salariales",10.5,"heuressup","prog","inst"],["Heures supplémentaires sans cotisations",10.5,"heuressup","prog","sim"],["Baisses d'impôts des entreprises",30,"entreprises","prog","cand"]]
};
// recettes prélevées sur les 10 % les plus riches (Md€) et flux net sur leur patrimoine (+ = enrichissement)
function topFlows(list){let topRev=0,topCut=0,wealthFlow=0;
  for(const [,md,key] of list){ if(!TOPKEYS[key]&&key!=="entreprises") continue; const sh=KEYS[key][9]/100;
    if(key!=="ir") wealthFlow+=md*sh; if(!TOPKEYS[key]) continue;
    if(md<0) topRev+=-md*sh; else topCut+=md*sh; }
  return {topRev,topCut,wealthFlow};}
// gains et pertes séparés, pour appliquer la crédibilité par sens : gains (dépenses, baisses d'impôts), pertes sur les plus aisés (déjà réduites par la fuite), autres pertes (économies, hausses d'impôts)
function microsimSplit(list,leak=0){
  const P=list.filter(m=>m[1]>0), T=list.filter(m=>m[1]<0&&TOPKEYS[m[2]]), N=list.filter(m=>m[1]<0&&!TOPKEYS[m[2]]);
  return {pos:microsim(P,leak),top:microsim(T,leak),neg:microsim(N,leak)};
}
if(typeof module!=="undefined") module.exports={topFlows,microsim,microsimSplit,PA_MEASURES,DEC_INC};
