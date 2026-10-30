# Simulateur 2027

Simulation pédagogique des programmes de la présidentielle 2027. Elle couvre la dette, la croissance, l'emploi, les inégalités, les retraites, le logement, les services publics et le climat, avec des sources Insee et les chiffrages d'instituts.

**Voir le simulateur :** https://mysteropodes.github.io/simulateur-2027/

Candidats comparés : Jean-Luc Mélenchon (LFI), Marine Le Pen (RN), Édouard Philippe (Horizons), Raphaël Glucksmann (PS-Place publique) et Bruno Retailleau (LR). Un statu quo (aucune mesure nouvelle) sert de référence.

C'est un outil de comparaison, pas une prévision : les mêmes règles s'appliquent à tous les programmes, et chaque hypothèse est réglable.

## Ce que fait la page

- **Trajectoires 2026-2046** : dette, déficit, charge d'intérêts, accès au financement, croissance, chômage, inflation, pauvreté, inégalités, pouvoir d'achat par catégorie, retraites, logement, services publics, émissions, énergie, tension sociale, etc.
- **Trois modes d'application** : « tel qu'annoncé », « si élu, chiffrage crédible » (par défaut) et « pondéré par la faisabilité ».
- **Quatre lectures économiques** : keynésienne (proche de l'OFCE), centrale, libérale (proche de l'iFRAP) et « fondée sur l'historique ».
- **Fiches candidats** : mesures, origine de chaque mesure et de son montant, trois niveaux de chiffrage, critiques et réponses de leurs défenseurs (« L'autre point de vue »).
- **Fourchettes d'incertitude** (200 tirages), explication de chaque cassure de courbe, cas types OpenFisca, recoupements avec les prévisions officielles et France Budget, lien de partage qui garde tous les réglages.

## Méthode de simulation

### 1. Principe

Chaque programme est traduit en un petit nombre de paramètres :
- un effort budgétaire en points de PIB ;
- des mesures chiffrées en milliards, réparties par décile de revenu ;
- des réformes non budgétaires (âge de départ, temps de travail, Smic, immigration, climat…) ;
- des notes de crédibilité, de faisabilité et de conflit avec l'Union européenne.

Un modèle annuel simple calcule ensuite, de 2026 à 2046, les effets sur l'économie, les finances publiques et les revenus. Les règles sont identiques pour tous les candidats ; seuls les paramètres du programme changent.

L'approche reprend celle des institutions qui chiffrent les programmes électoraux à l'étranger :
- même base et même calendrier pour tous (CPB aux Pays-Bas, Bureau fédéral du Plan en Belgique, PBO en Australie et au Canada) ;
- décotes de comportement publiées à l'avance ;
- séparation entre chiffrage statique, comportements et effets macroéconomiques (CPB, OBR britannique) ;
- projections de dette probabilistes (FMI, Commission européenne) ;
- résultats présentés comme des comparaisons.

### 2. Du programme au chiffrage retenu : trois niveaux

1. **Annoncé.** Le solde annoncé par le candidat. Les montants en milliards de fin de mandat sont rapportés au PIB nominal de fin de mandat (environ 3 600 Md€), pas à celui de 2025.
2. **Après comportements et crédibilité.** Même règle pour tous :
   - **Recettes et économies annoncées** : multipliées par la note de crédibilité du chiffrage (0,3 à 0,55 selon les programmes, justifiée dans chaque fiche). C'est là que les chiffrages sont le plus souvent optimistes.
   - **Impôts visant les 10 % les plus aisés** (capital, patrimoines, héritages, part de l'impôt sur le revenu payée par eux) : réduits par les « recettes perdues » au lieu de la crédibilité. Elles valent 40 % en lecture centrale, 15 % keynésienne, 60 % libérale, 54 % historique (CAE 2025 ; CPB : 50 % pour les taux supérieurs de l'impôt sur le revenu).
   - **Dépenses et baisses d'impôts** : comptées en entier. Un programme moins crédible a donc toujours un déficit plus élevé.
   - **Chiffrage indépendant** : quand il estime les dépenses au-dessus de l'annonce, il est retenu hors du mode « tel qu'annoncé ». Exemple : Mélenchon, 111 Md€ selon Déchiffrer 2027 au lieu de 81,7.
   - **Opérations financières** (placement de réserves, capitalisation) : elles ne réduisent pas le déficit au sens européen (SEC 2010) et ne sont pas comptées.
3. **Effet final sur le déficit**, avec les effets sur l'activité, le chômage et les intérêts, par rapport au statu quo.

Chaque fiche candidat affiche ces trois niveaux. En lecture centrale, l'effort retenu à pleine application est :

| Programme | Effort retenu (pt de PIB) |
|---|---|
| Philippe | +0,8 |
| Retailleau | +0,4 |
| Le Pen | −0,7 |
| Glucksmann | −1,3 |
| Mélenchon | −1,5 |

Le signe − signifie un déficit en hausse.

### 3. Effets sur l'activité

- **Découpage par type de mesure.** Chaque programme est découpé en investissement public, logement, fonctionnement, transferts aux modestes, autres transferts, impôts larges, impôts des aisés, entreprises, etc. Chaque type a son multiplicateur à 1-2 ans, 5 ans et 10 ans.
- **Origine des multiplicateurs.** Ils viennent de la synthèse de Déchiffrer 2027 (Mésange, OFCE, HCFP, FMI, Commission). Les effets à dix ans ont été abaissés vers la pratique de l'OBR britannique, pour qui les effets de demande s'éteignent en quelques années. Une échelle globale (× 1,25 keynésienne, × 0,7 libérale) les fait varier.
- **Multiplicateur des ajustements hors programme.** Il vaut 0,7 (crise, règle de réaction), et au moins 1,5 en crise (Blanchard et Leigh, 2013).
- **Effets d'offre :**
  - âge de départ (70 % du changement d'âge légal se retrouve dans l'âge effectif ; part des seniors restant en emploi d'après l'IPP et l'Insee) ;
  - temps de travail, réformes structurelles et IA, en effets de niveau limités dans le temps ;
  - immigration (nombre d'actifs) ;
  - rendement de l'investissement public et des services publics ;
  - inégalités et croissance (OCDE, réglable, nul en lecture libérale).
- **Éviction.** La dette ajoutée par un programme évince une partie de l'investissement privé (CBO) : 0,05 % de PIB par point de dette en lecture centrale.
- **Séquelles des récessions** (hystérésis) : 5 % de l'écart de production en lecture centrale.
- **Énergie.** Trois scénarios pétroliers (EIA, AIE, The Shift Project). Le prix du pétrole agit sur le PIB et l'inflation (Insee). La dépendance aux énergies fossiles suit le rythme de décarbonation de chaque programme, et une partie des importations évitées devient de la production en France.

### 4. Emploi, prix, salaires

- **Chômage.** Retour vers un chômage structurel de 7,4 % à 20 % par an, loi d'Okun 0,3, activité partielle en cas d'épidémie. Le tout est recalé sur 2015-2025.
- **Hausse du Smic.** Les emplois au Smic (17 % des salariés) baissent avec le coût du travail net des allègements : environ 18 000 emplois par point de Smic en lecture centrale, dans la fourchette de 15 000 à 25 000 des études françaises.
- **Inflation.** 2 % à long terme (convention de la Commission), courbe de Phillips de pente 0,15 à partir de 2029, chocs pétroliers.

### 5. Finances publiques et dette

- **Solde public.** Il part du déficit hors intérêts de 2025 (Insee). S'y ajoutent l'effort du programme, les stabilisateurs automatiques (0,6), la loi de programmation militaire et la moitié de l'engagement OTAN (sauf pour le programme qui le rejette). À partir de 2030 s'ajoutent aussi le vieillissement (santé et dépendance : +0,8 pt de PIB en 2046) et la dégradation des retraites du COR.
- **Pauvreté.** Chaque point de pauvreté en plus ou en moins change les dépenses de santé, d'éducation et de justice de 1,35 Md€ en lecture centrale (Collectif Alerte, 2024 ; nul en lecture libérale).
- **Charge d'intérêts.** Environ 9 % de la dette est renouvelée chaque année au taux de marché, plus la dette nouvelle qui finance le déficit. 10 % des titres sont indexés sur l'inflation.
- **Taux de marché.** Il est égal au taux réel sans risque (1,5 %, proche du taux allemand), plus l'inflation, plus une prime de risque. La prime augmente avec :
  - le déficit au-delà de 3 % (corrigé de l'inflation) ;
  - la dette au-delà de 120 % ;
  - la charge d'intérêts rapportée aux recettes (dégradations de note progressives) ;
  - la prime d'instabilité politique actuelle, qui se résorbe après l'élection ;
  - un éventuel conflit avec l'Union européenne, plein pendant le mandat puis qui s'estompe.
- **Calage 2026-2028.** Il suit la Banque de France (septembre 2026). Repères obtenus : dette 2030 de 131 % (comité d'experts : 130 %), intérêts 2027 de 95 Md€ (91 annoncés par le gouvernement), OAT 10 ans à 5 % en 2027.
- **Crise de financement.** C'est une règle du modèle : quand la prime dépasse 3 points (réglable), il y a deux issues.
  - **Filet de la BCE (TPI).** La BCE plafonne la prime, à condition que le déficit soit ramené à 4 % au plus et sans conflit avec l'Union européenne. Elle retire ce filet si le déficit dérive de nouveau.
  - **Sinon, une crise.** Prêts d'urgence à taux réduit pendant cinq ans, contre 1,5 pt de PIB d'économies par an tant que le déficit dépasse 3 %. S'y ajoutent une récession et des séquelles. Ensuite, les économies ne sont gardées que pour tenir le déficit sous 3 %.
  - **Variante « refus du programme »**, réglable : contrôle des capitaux, financement national à taux plafonné et inflation.
- **Après 2031.** Les gouvernements suivants corrigent une partie du déficit selon la dette (règle de réaction : 0,04 pt par point de dette).
- **Lire la dette après une crise.** Une crise impose des économies, ce qui fausse la comparaison des dettes après coup. Le tableau affiche donc aussi la dette 2046 « sans crise ».

### 6. Revenus, pauvreté, inégalités

- **Microsimulation simplifiée.** Chaque mesure en milliards est répartie entre les déciles par une clé d'incidence (Insee, Drees, IPP), puis rapportée au revenu de chaque décile. Les gains des ménages sont comptés en entier, leurs pertes réduites comme les économies. Le taux de non-recours et la diffusion sont résumés par une efficacité de 0,85.
- **Pauvreté et Gini.** Ils sont calculés à partir des revenus par décile (Insee 2024 : pauvreté 15,4 %, Gini 0,302). Ils tiennent compte du chômage et d'un éventuel ajustement imposé.
- **Pouvoir d'achat par catégorie.** Il est exprimé par rapport au statu quo.
- **Cas types.** Huit ménages types sont calculés avec OpenFisca France (dossier `openfisca/`).

### 7. Indicateurs plus fragiles

- **Tension sociale.** C'est un indice 0-100 qui monte avec le chômage, la pauvreté, l'inflation, les réformes impopulaires appliquées, les mesures touchant aux droits (grille qualitative) et les crises. Au-delà de 60, le gouvernement recule progressivement sur une partie du programme, jusqu'à 40 % quand la tension atteint 80. Il revient en arrière quand la tension retombe. Les poids de l'indice sont des hypothèses.
- **Santé (mois d'espérance de vie), décès liés à la chaleur, logement, émissions.** Ce sont des ordres de grandeur sourcés dans la page. Ils indiquent un sens et une taille, pas une prévision.

### 8. Incertitude

- **200 tirages communs à tous les candidats.** Ils font varier la croissance, les taux, l'inflation, les multiplicateurs et séquelles, la réaction des marchés, le seuil de crise, le filet de la BCE, les recettes perdues, l'emploi des seniors, l'effet du Smic, le climat, l'IA, le pétrole, un choc éventuel et la crédibilité des programmes.
- **Résultats.** La page affiche des fourchettes et la part des tirages où survient une crise.
- **Au-delà de 2032**, les courbes sont grisées : ce sont des tendances, pas des prévisions.

### 9. Validation

- **Test 2015-2025** (`tests/backtest.js`). Il couvre le chômage (erreur moyenne de 0,6 point), le taux apparent de la dette (0,10 point) et l'identité de la dette (0,5 point hors 2020). Ces mécanismes ont aussi été réglés sur cette période : ce n'est pas une validation indépendante.
- **Test des effets des mesures sur la croissance** (`tests/backtest-growth.js`, consolidation 2010-2016). Erreur moyenne de 0,50 point en lecture centrale et de 0,41 en lecture libérale, contre 0,42 en supposant les mesures sans effet. Un seul épisode, mêlé à la crise de la zone euro, ne permet pas de trancher.
- **Audits.** Plusieurs audits indépendants du code et de la méthode ont été menés (octobre 2026). Leurs corrections sont datées dans l'onglet « Informations » et dans [CHANGELOG.md](CHANGELOG.md).

## Limites à garder en tête

- **Modèle simplifié.** Ce n'est pas un modèle complet de l'économie : pas de commerce extérieur, de taux de change ni de secteurs, et la BCE ne réagit pas à la France seule. Les comparaisons entre programmes sont plus fiables que les niveaux.
- **La crise de la dette est une règle du modèle, pas une prévision.** Elle dépend surtout de la lecture économique : en lecture centrale, tous les programmes la franchissent entre 2036 et 2044, en lecture keynésienne aucun.
- **Programmes interprétés.** Ils sont traduits à partir de documents publics parfois incomplets, et Glucksmann n'a pas encore publié de programme chiffré. Chaque fiche dit d'où vient chaque chiffre.
- **Pas de relecture extérieure.** Aucun économiste extérieur n'a encore relu le simulateur.

## Contester un chiffrage

Équipes de campagne et lecteurs peuvent [signaler une erreur ou compléter un chiffrage](https://github.com/mysteropodes/simulateur-2027/issues/new/choose). Les corrections sont datées dans l'onglet « Informations » et dans [CHANGELOG.md](CHANGELOG.md).

## Structure du dépôt

```
index.html                page finale, autonome (générée)
build.py                  assemble index.html à partir de src/
src/
  head.part               en-tête et styles
  body.part               contenu HTML (onglets, tableaux, méthode)
  sources.part            liste des sources
  model.js                modèle macro-budgétaire (simulate, BASE0, chocs, énergie)
  microsim.js             microsimulation par décile, mesures et fuites
  ui.part                 paramètres des candidats, lectures, Monte-Carlo, graphiques, interface
openfisca/                script reproductible des cas types (OpenFisca France) et résultats
CHANGELOG.md              journal des modifications
tests/smoke.js            test de fumée dans un navigateur sans interface
tests/backtest.js         test historique 2015-2025 (données dans tests/backtest-data.js)
tests/backtest-growth.js  test des effets des mesures sur la croissance (consolidation 2010-2016)
```

## Modifier et reconstruire

```sh
python3 build.py            # régénère index.html (vérifie la syntaxe JS si node est installé)
npm i -D playwright && npx playwright install chromium
node tests/smoke.js         # vérifie que la page charge et que chaque candidat donne une trajectoire finie
node tests/backtest.js      # test historique 2015-2025
node tests/backtest-growth.js
```

La page ne dépend que de Chart.js (cdnjs) et de polices Google Fonts. Elle s'ouvre directement dans un navigateur.

## Sources principales

- **Statistiques publiques** : Insee, Drees, Banque de France, Cour des comptes, HCFP, Conseil d'orientation des retraites, Citepa, Santé publique France.
- **Institutions et instituts** : Commission européenne, FMI, CBO, OBR, CPB, CAE, OFCE, IPP, I4CE, iFRAP, Institut de l'Entreprise, France Budget, Déchiffrer 2027.
- **Partis** : programmes et contre-budgets publiés, avec les analyses juridiques et les sondages cités dans la page.

La liste complète, avec les liens, figure dans la section « Sources » du simulateur.
