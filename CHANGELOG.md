# Journal des modifications

Chaque changement du modèle ou d'un chiffrage est daté ici et visible dans l'onglet « Informations » du simulateur. Le détail ligne par ligne est dans l'[historique des commits](https://github.com/mysteropodes/simulateur-2027/commits/main).

## 30 octobre 2026, soir : audit de rigueur et sensibilité

- Crédibilité par règle publique : c = 0,3 + 0,7 × part chiffrée par Déchiffrer 2027 (Mélenchon 0,67, Philippe 0,45, Retailleau 0,43, Le Pen 0,38, Glucksmann 0,3).
- Mélenchon : curseurs calés sur les dépenses annoncées (spServ 0,2, climInv 0,68, housingInv 0), drapeau `itemized` supprimé, uStruct +0,2.
- Retailleau : supply 0,10 → 0.
- Économies non détaillées : moitié sur les ménages (clé « tete ») et moitié sur les services publics.
- Chômage structurel du programme : −0,5 % de PIB et +0,2 pt de déficit par point (`uGdp`, `uDef`).
- Inégalités et croissance : montée en puissance sur 20 ans.
- `invRet` = 0 (déjà dans le multiplicateur) ; `crowd` 0,02 (0 / 0,04).
- Tension « droits » non pondérée par la solidité juridique en mode crédible.
- Crise : désinflation (−1 / −0,7 / −0,3) et soutien aux banques 3 % du PIB (`bankCrisis`).
- Intérêts rapportés au PIB de l'année ; dépenses de santé, services et famille selon la règle par sens.
- Tests : `tests/regression.js` (24 contrôles) ; contrôles et règle d'intérêt du modèle ajoutés à `tests/backtest.js`.
- Textes mis en accord avec le code (stabilisateurs, renouvellement de la dette, notation, seuil de tension, éviction, Smic, inégalités, crises).

## 30 octobre 2026, suite : méthodes étrangères

- Trois niveaux de chiffrage dans chaque fiche (CPB, OBR) : annoncé, après comportements et crédibilité, effet sur le déficit 2032.
- Fuite fiscale sur les plus aisés : 40 % centrale (15 keynésienne, 60 libérale, 54 historique).
- Multiplicateurs à dix ans abaissés (fonctionnement 0,5, transferts 0,5, impôts larges 0,6, entreprises 0,7) ; test 2010-2016 : 0,53 → 0,50.
- Éviction de l'investissement privé : `crowd` 0,05 % de PIB par point de dette ajoutée par le programme (0 / 0,05 / 0,1).
- Smic : élasticité centrale 0,35.

## 30 octobre 2026 : audit élargi

- Montants en Md€ rapportés au PIB nominal de fin de mandat (`gdpProg` = 3 600 Md€) ; efforts en euros recalés (Le Pen 2,74 pts, Retailleau 3,03, Mélenchon 0,61).
- Retailleau : 22 Md€ d'opérations financières retirés de l'effort (SEC 2010).
- Fuite fiscale limitée aux clés `capital` et `ir` (plus aux impôts des entreprises).
- Crédibilité par sens étendue aux revenus des ménages (`microsimSplit`), retraites, prélèvements, défense, amortisseur IA.
- Mélenchon : `spendOver` 29,3 Md€ (Déchiffrer 2027) hors mode annoncé ; solde « non détaillé » sans décote pour un programme entièrement chiffré (`itemized`).
- Taux apparent : renouvellement de 9 % du stock par an plus le financement du déficit ; inflation de long terme 2 % ; taux réel sans risque 1,5 % (1,2 keynésien, 1,8 libéral) ; prime politique 1,3 ; dégradations de note × 0,5 ; stabilisateurs 0,6.
- Prime UE estompée après 2031 ; recul face à la tension progressif (60 → 80) et réversible.
- Colonne « dette 2046 sans crise » ; tirage du seuil TPI recentré.

## 29 octobre 2026, soir (5) : affinages

- **Test du bloc croissance** (`tests/backtest-growth.js`, sans réglage) : consolidation de 2010-2016 rejouée avec les multiplicateurs du modèle, la crise de la zone euro et le CICE. Erreur moyenne 0,53 point en lecture centrale, contre 0,42 sans effet des mesures et 0,42 en lecture libérale : les effets durables des hausses d'impôts semblent trop forts dans la lecture centrale. Valeurs centrales gardées (un seul épisode, nombreux facteurs), résultat publié.
- **Dette au pic (année)** : nouvelle colonne du tableau des finances publiques.
- **Sortie de crise « refus du programme européen »**, réglage commun : contrôle des capitaux, financement national à taux plafonné, sortie de fait de l'euro ; récession −5 points, inflation +6/+3/+1, économies imposées de 0,75 pt/an.

## 29 octobre 2026, fin d'après-midi

- **Pauvreté et dépenses publiques** : chaque point de taux de pauvreté au-dessus ou au-dessous de 2025 change les dépenses de santé, d'éducation et de justice (1,35 Md€ par point en lecture centrale, 2,7 keynésienne, 0 libérale ; Collectif Alerte et Oliver Wyman, 2024 : 39 Md€ de surcoûts pour 9,8 millions de personnes). Effet installé sur cinq ans, varié dans les fourchettes. Effet faible : 0,03 à 0,08 point de déficit en 2032 ; aucune date de crise ne change.

## 29 octobre 2026, après-midi : suite de l'audit

- **Long terme** (à partir de 2030, pour tous) : santé et dépendance +0,8 pt de PIB en 2046 (Commission européenne, Ageing Report 2024) ; dégradation des retraites du COR comptée dans le déficit ; moitié de l'engagement OTAN (3,5 % du PIB en 2035) au-delà de la loi de programmation, sauf pour le programme qui rejette l'objectif (Mélenchon), les renforts propres aux programmes en tenant lieu. Tous réglables.
- **Courbe de Phillips** : 0,15 point d'inflation par point de chômage sous 7,4 %, à partir de 2029.
- **Conjoncture 2026** : chômage 8,3 % (Banque de France), taux plus bas en début d'année (charge d'intérêts 80 Md€).
- **Fourchettes** : la résorption de la prime politique actuelle varie (0,6 à 0,95 par an).
- Effet : dette 2046 du statu quo 189 → 206 % ; dates de crise en lecture centrale décalées d'un an au plus ; dette 2032 inchangée à 1 point près.

## 29 octobre 2026, nuit (3) : audit de réalisme

Audit indépendant : statu quo comparé aux projections officielles (Banque de France, comité d'experts de juillet 2026, Cour des comptes, COR, FMI), règles testées sur des cas extrêmes. Le statu quo est réaliste jusqu'en 2030 (dette 131 % contre 130 %). Corrections, mêmes règles pour tous :

- **Filet de la BCE (TPI)** : condition « effort ≥ 1 point » remplacée par un déficit ramené à 4 % au plus (réglable, tiré entre 3,5 et 5 % dans les fourchettes) ; retrait si le déficit dépasse de nouveau ce seuil d'un point.
- **Crédibilité par sens** : elle réduit les recettes et les économies (sauf les impôts sur les plus aisés, déjà réduits par la fuite fiscale) ; dépenses et baisses d'impôts comptées en entier. Effort retenu : Retailleau +1,1 pt, Philippe +0,8, Le Pen −0,7, Mélenchon −1,1, Glucksmann −1,3.
- **Après une crise** : économies imposées gardées seulement pour tenir le déficit sous 3 % ; séquelles de six ans (−0,4 pt/an).
- **Prime de risque** : dégradations de note progressives (plus de paliers) ; déficit corrigé de l'inflation au-delà de 2 %.
- **Smic** : effet sur l'emploi (élasticité 0,25 centrale, 0,05 keynésienne, 0,5 libérale ; 17 % des salariés au Smic ; coût net des allègements).
- **Âge de départ** : 70 % du changement d'âge légal pour tous (réglable).
- **Effets de niveau** : réformes de l'offre (2027-2036) et IA (jusqu'en 2040, puis extinction sur six ans) ne relèvent plus la croissance indéfiniment.
- **Fourchettes** : correction d'un tirage de la réaction des marchés et du seuil de crise resté en commentaire.
- **Textes** : contradiction entre test historique et Méthode corrigée ; limites de long terme ajoutées ; mise en garde sur la comparaison des dettes de 2046.

## 29 octobre 2026, nuit (2)

- **Transition et indépendance énergétique** : importations fossiles évitées produites en partie en France (50 % centrale, 70 % keynésienne, 30 % libérale ; évaluation ThreeME de la SNBC, 2022) ; coût de la transition sur la productivité (0,06 point de croissance par point de PIB d'investissement climat, 2027-2035 ; 0 keynésienne, 0,12 libérale ; Pisani-Ferry et Mahfouz, 2023).

## 29 octobre 2026, nuit : réalisme, énergie et géopolitique

- **Test historique 2015-2025** (`tests/backtest.js`) : chômage recalé (loi d'Okun 0,3, chômage structurel 7,4 %, retour à 20 % par an, activité partielle en épidémie ; erreur moyenne de 1,6 à 0,6 point) ; environ 10 % de dette indexée sur l'inflation (erreur sur le taux apparent de 0,22 à 0,10 point) ; identité de la dette vérifiée (0,5 point d'écart hors 2020).
- **Conjoncture 2026-2028** calée sur la Banque de France (septembre 2026) : croissance 0,4 / 0,9 / 1,2 %, inflation 2,3 / 1,9 / 1,6 %, choc d'Ormuz compris.
- **Énergie et pétrole** : scénarios « retour au calme » (EIA, AIE), « tensions durables » et « offre en déclin » (The Shift Project, 2021) ; prix du Brent, facture énergétique, inflation, croissance, aides publiques temporaires, rationnement au-delà de l'offre disponible ; exposition selon la consommation fossile de chaque programme. Élasticités : Insee (2019).
- **Nouveaux chocs** : flambée du pétrole, guerre commerciale (Banque de France), blocus de Taïwan (très incertain).
- Nouvel indicateur : prix du pétrole.

## 29 octobre 2026, soir (4)

- **Lecture « fondée sur l'historique »** : valeurs centrales, sauf les recettes perdues sur les impôts visant les plus riches (54 %, CAE Focus n° 118, juillet 2025) et la part des seniors restant en emploi quand l'âge de départ recule (65 %, Insee sur la réforme de 2010). Les hypothèses où l'histoire ne tranche pas restent centrales.

## 29 octobre 2026, soir (3)

- **Natalité** : fécondité de référence du COR (1,45 dès 2028 ; Insee : 1,56 et 645 000 naissances en 2025), réglable ; effet de la politique familiale de chaque programme (0,01 enfant par femme par Md€ net, moitié de l'ordre de grandeur de l'iFRAP ; DG Trésor et Haut-commissariat au plan : effet limité). Retailleau, seul à chiffrer une hausse nette (≈ 10 Md€) : 1,50 enfant par femme en 2032. Effet sur les retraites selon le COR à partir de 2045. Nouveaux indicateurs : fécondité et naissances.

## 29 octobre 2026, soir (2)

- **Démographie et immigration** : solde migratoire par programme, en écart à la tendance du COR (+150 000 par an). Valeurs par défaut, hypothèses du simulateur faute de chiffrage par les candidats : Le Pen −100 000, Retailleau −70 000, Philippe −10 000, Glucksmann 0, Mélenchon +20 000 ; pondérées par la solidité juridique en mode « chiffrage crédible ». Effets sur le nombre d'actifs, le PIB total et les cotisations de retraite ; contribution budgétaire nette nulle par défaut (OCDE, 2021), réglable. Nouvel indicateur : actifs liés au solde migratoire.

## 29 octobre 2026, soir

- **Inégalités et croissance de long terme** (nouveau réglage) : chaque point de Gini en plus réduit la croissance de 0,06 point par an en lecture centrale, avec trois ans de décalage (0,12 keynésienne, 0 libérale), d'après l'OCDE (Cingano, 2014) et le FMI (Ostry et autres, 2014), avec les réserves de Barro (2000), Forbes (2000) et de l'OFCE (Allègre, 2015).

## 29 octobre 2026, fin d'après-midi : vérification de tous les paramètres

- **Facteurs d'application** : la crédibilité du chiffrage ne réduit plus que les montants budgétaires ; les réformes non budgétaires (âge de départ, 32 heures, marché du travail, ZAN) s'appliquent si le candidat est élu ; les mesures touchant aux droits sont pondérées par la solidité juridique.
- **Grille des droits, règle unique** (écrite dans la Méthode) : Mélenchon contre-pouvoirs « mixte » → « restreint » ; Glucksmann libertés « neutre » → « mixte » ; Philippe égalité « restreint » → « mixte » ; Le Pen libertés étayé par son référendum sur le voile ; Retailleau, mention non sourcée retirée.
- **Crédibilité** : Mélenchon 0,5, Philippe 0,5, Glucksmann 0,5, Retailleau 0,55, Le Pen 0,3 (inchangée). **Opinion** : Retailleau 0,5, Le Pen 0,55, Philippe 0,45.
- **Effets de long terme non justifiés retirés** (Mélenchon, Glucksmann, Philippe, Retailleau).
- **Retailleau** : retraites recomptées, cotisations salariales, allocations familiales et quotient familial, effort 4,3 pts. **Glucksmann** : ses propres annonces remplacent le projet du PS, effort −0,8 pt. **Le Pen** : retraites 14 Md€, défense, services publics. Retraites de Mélenchon et Philippe recalées.
- Effet sur la dette 2032 (lecture centrale, chiffrage crédible) : Mélenchon +1,5 point, Glucksmann +1,3, Le Pen +1,1, Philippe +0,9, Retailleau −1,1.

## 29 octobre 2026, après-midi

- **Retailleau, grille des droits** : « libertés » passe de « neutre » à « restreint » (proposition d'interdire La France insoumise, BFMTV-RMC début octobre 2026 ; encadrement des manifestations par drones). Sa note de mobilisation contre les atteintes aux droits (18) rejoint celle de Le Pen.

## 29 octobre 2026

- **Multiplicateurs par type de mesure.** Le multiplicateur unique (0,7) est remplacé par des multiplicateurs propres à chaque type de mesure et au temps écoulé (1-2 ans, 5 ans, 10 ans), d'après la synthèse publiée par [Déchiffrer 2027](https://dechiffrer2027.fr/en/methode) (Mésange, OFCE, HCFP, FMI, Commission européenne). Chaque programme est découpé par type de mesure ; la répartition s'affiche dans chaque fiche candidat.
  - Conséquence, en mode « chiffrage crédible » : la dette 2032 est plus élevée de 1,5 à 2,5 points pour Le Pen, de 2,5 à 3 pour Philippe et de 3,5 à 5,5 pour Retailleau selon la lecture (jusqu'à 11 points en mode « tel qu'annoncé »), parce que leurs économies portent surtout sur les dépenses de fonctionnement ; elle est plus basse de 2 à 4 points pour Mélenchon et Glucksmann, dont les hausses d'impôts visent surtout les plus aisés, et d'environ 1,5 point pour le statu quo (la loi de programmation militaire soutient aussi l'activité). Les économies sociales de Retailleau (91 Md€) et de Philippe (la moitié de son effort) sont désormais comptées en entier dans le revenu des ménages, comme dans le déficit : les inégalités montent davantage avec leurs programmes. Le Pen : la contribution à l'UE plafonnée est séparée entre contribution nette et sommes qui reviennent en France.
- **Séquelles durables des récessions (hystérésis)** : 5 % de l'activité perdue chaque année sous le potentiel ne revient pas en lecture centrale (10 % keynésienne, 0 libérale).
- **Trois ménages types de plus** (fonctionnaire de catégorie C, retraitée modeste, couple de retraités aisés) et détail du revenu disponible de chaque ménage. Le script OpenFisca est reproductible (`openfisca/cases.py`).
- **Origine de chaque mesure** (programme, document du parti, déclaration) et du montant (candidat, institut, estimation du simulateur), date de dernière revue par candidat.
- **Contester un chiffrage** via les Issues GitHub.
- **Lien de partage** d'un scénario (tous les réglages sont dans l'adresse).

## Fin octobre 2026

- Conjoncture 2026-2027 calée sur les prévisions officielles, trajectoire du gouvernement, colonnes alignées sur les hypothèses de France Budget, zone grisée après 2032.
- Le Pen : abrogation des 64 ans avec départ entre 60 et 62 ans (meeting d'Orléans, 25 octobre 2026).
- Mélenchon : retraite à 60 ans avec 40 annuités (2 octobre 2026).
