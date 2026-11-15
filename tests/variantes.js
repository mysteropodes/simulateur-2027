// Variantes standards : effet sur le PIB d'une mesure permanente d'1 point de PIB, comparé aux variantes publiées du modèle Mésange (Insee, DG Trésor).
// Dans le simulateur, l'effet d'une impulsion sur le PIB est dx × multAt(catégorie, horizon) (src/model.js) : la comparaison porte donc sur ces profils.
// Ce n'est pas une validation indépendante : les multiplicateurs viennent d'une synthèse qui comprend Mésange. Le test mesure l'écart qui reste et le fige.
// Sources : DG Trésor, « Le modèle macroéconométrique Mésange : réestimation et nouveautés » (2017), variantes investissement public et cotisations employeurs ;
// OFCE, document de travail 2026-9, « Comparaison des propriétés des modèles macroéconomiques français ThreeME et Mésange » (9 juillet 2026), tableaux 2 et 3.
// Usage : node tests/variantes.js
const {multAt}=require('../src/model.js');
const H=[1,2,5,10];
const mix=w=>h=>Object.entries(w).reduce((s,[k,x])=>s+x*multAt(k,h),0);
const V=[
  {lab:"Investissement public +1 pt",ref:[1.32,1.44,1.07,0.86],f:mix({inv:1}),src:"Mésange 2017"},
  // dépense composite de la variante Mésange : 8 % investissement, 46 % rémunérations, achats et prestations en nature, 46 % prestations en espèces
  {lab:"Dépenses publiques +1 pt (composite)",ref:[0.76,1.01,0.88,0.54],f:mix({inv:0.08,fonct:0.46,trAutres:0.46}),src:"Mésange, OFCE 2026-9"},
  {lab:"TVA −1 pt",ref:[0.30,0.65,0.81,0.78],f:mix({taxLarge:1}),src:"Mésange, OFCE 2026-9"},
  {lab:"Cotisations employeurs −1 pt",ref:[0.24,0.60,0.86,1.27],f:mix({entr:1}),src:"Mésange 2017",known:{10:"écart voulu : effets durables abaissés (OBR ; effets transitoires dans e-mod.fr)"}}
];
let bad=0, sum=0, n=0;
console.log("Effet sur le PIB (%) d'une mesure permanente d'1 point de PIB, à 1, 2, 5 et 10 ans\n");
for(const v of V){
  const m=H.map(v.f), d=m.map((x,i)=>x-v.ref[i]);
  console.log(v.lab+" ("+v.src+")");
  console.log("  Mésange     "+v.ref.map(x=>x.toFixed(2)).join("  "));
  console.log("  simulateur  "+m.map(x=>x.toFixed(2)).join("  "));
  console.log("  écart       "+d.map(x=>(x>=0?"+":"")+x.toFixed(2)).join(" "));
  d.forEach((x,i)=>{ const k=v.known&&v.known[H[i]]; if(k){console.log("  à "+H[i]+" ans : "+k); if(Math.abs(x)>0.7) bad++; return;} sum+=Math.abs(x); n++; if(Math.abs(x)>0.35){bad++; console.log("  HORS TOLÉRANCE à "+H[i]+" ans");} });
  console.log("");
}
console.log("Écart absolu moyen (hors écart voulu) : "+(sum/n).toFixed(2)+" point");
if(bad){console.log(bad+" contrôle(s) en échec"); process.exit(1);} console.log("Contrôles OK");
