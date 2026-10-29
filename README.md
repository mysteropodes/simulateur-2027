# Simulateur 2027

Simulation pédagogique des programmes de la présidentielle 2027. Elle couvre la dette, la croissance, l'emploi, les inégalités, les retraites, le logement, les services publics et le climat, avec des sources Insee et les chiffrages d'instituts.

**Voir le simulateur :** https://mysteropodes.github.io/simulateur-2027/
(copie identique : https://simulateur-2027.mysteropodes-auth.workers.dev)

Candidats comparés : Jean-Luc Mélenchon (LFI), Marine Le Pen (RN), Édouard Philippe (Horizons), Raphaël Glucksmann (PS-Place publique) et Bruno Retailleau (LR). Un statu quo et la trajectoire du gouvernement servent de repères.

## Ce que fait la page

- **Trajectoires 2025-2036** : dette, déficit, charge d'intérêts, croissance, chômage, pauvreté, Gini, pouvoir d'achat, émissions, logement, etc.
- **Trois modes d'application** pour chaque programme :
  - « Tel qu'annoncé » : les mesures sont prises telles que chiffrées par le candidat ;
  - « Si élu, chiffrage crédible » (par défaut) : le modèle tient compte des fuites fiscales, de la réaction des marchés et des délais de mise en œuvre ;
  - « Pondéré par la faisabilité » : les mesures juridiquement ou politiquement fragiles comptent moins.
- **Fourchettes d'incertitude** obtenues par 200 tirages Monte-Carlo autour des réglages courants.
- **Explications des ruptures de courbe** : la page indique la cause de chaque cassure (crise, prêts d'urgence, règle budgétaire…).
- **Cas types OpenFisca** : effet des principales mesures sur des ménages types.
- **Recoupements** :
  - avec les prévisions officielles 2026-2027 ;
  - avec les chiffrages de France Budget, dans des colonnes alignées sur leurs hypothèses.
- **Onglet Informations** : quand et pourquoi le modèle déclenche une crise de la dette, indicateurs couverts, regard international.
- **Fiches candidats** : mesures principales, critiques formulées et réponses de leurs défenseurs (« L'autre point de vue »).

Tous les paramètres sont réglables. Trois lectures économiques sont proposées : keynésienne (proche de l'OFCE), centrale et libérale (proche de l'iFRAP). Les mêmes règles s'appliquent à tous les candidats.

## Limites à garder en tête

- C'est un **modèle simplifié**, pas une prévision. Les ordres de grandeur et les comparaisons entre programmes sont plus fiables que les niveaux exacts.
- **La crise de la dette est une règle du modèle.** Au-delà de certains seuils, la prime de risque s'emballe, la BCE intervient ou non, puis un ajustement forcé et des prêts d'urgence s'appliquent pendant 5 ans. Le fait qu'une crise apparaisse dans presque tous les scénarios découle en partie de cette règle et du point de départ (dette à 115,6 % du PIB). Ce n'est pas une certitude.
- **Après 2032**, les projections sont grisées : l'incertitude devient trop forte pour les lire au premier degré.
- **Les effets sociétaux sont traduits en paramètres**, donc simplifiés à l'extrême : tension sociale, droits, changements de modèle économique.
- Aucun backtest sur 2015-2025 n'a encore été fait.

## Structure du dépôt

```
index.html          page finale, autonome (générée)
build.py            assemble index.html à partir de src/
src/
  head.part         en-tête et styles
  body.part         contenu HTML (onglets, tableaux, méthode)
  sources.part      liste des sources
  model.js          modèle macro-budgétaire (simulate, BASE0, chocs)
  microsim.js       microsimulation par décile, mesures et fuites
  ui.part           paramètres des candidats, graphiques, interface
openfisca/          script des cas types (OpenFisca France) et résultats
tests/smoke.js      test de fumée dans un navigateur sans interface
```

## Modifier et reconstruire

```sh
python3 build.py            # régénère index.html (vérifie la syntaxe JS si node est installé)
npm i -D playwright && npx playwright install chromium
node tests/smoke.js         # vérifie que la page charge et que chaque candidat donne une trajectoire finie
```

La page ne dépend que de Chart.js (cdnjs) et de polices Google Fonts. Elle s'ouvre directement dans un navigateur.

## Sources principales

- **Statistiques publiques** : Insee (comptes publics 2025, chômage, niveau de vie et pauvreté 2024, démographie, conjoncture), Conseil d'orientation des retraites, Citepa, Santé publique France.
- **Instituts** : OFCE, IPP, I4CE, iFRAP, Institut de l'Entreprise, France Budget, Déchiffrer 2027.
- **Partis** : programmes et contre-budgets publiés, avec les analyses juridiques et les sondages cités dans la page.

La liste complète, avec les liens, figure dans la section « Sources » du simulateur.
