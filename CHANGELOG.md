# Journal des modifications

Chaque changement du modèle ou d'un chiffrage est daté ici et visible dans l'onglet « Informations » du simulateur. Le détail ligne par ligne est dans l'[historique des commits](https://github.com/mysteropodes/simulateur-2027/commits/main).

## 31 octobre 2026 : candidat fictif construit par le simulateur

- `CANDS0` : entrée `ia` (`fictif:1`, `itemized:1`, `c` 0,86, `adh` 0,68, `parl` 0,61, `A` +0,4), mesures dans `PA_MEASURES.ia` (origine `emprunt`), `EXT.ia` ; couleur `--c7`, courbe en pointillés, badge « candidat fictif ».
- Construction (scratch `opt/feas.js`) : menu de 17 mesures + 9 leviers, algorithme évolutionnaire 500 + 60 × 350, trois lectures par évaluation, pénalités de faisabilité (solde ≥ 0, soutien min 40 % / moyen 60 %, tension < 60, pauvreté ≤ statu quo ×3, retraités ≥ statu quo, crise ≥ statu quo en central et libéral), objectif minimax sur 9 indicateurs + 0,1 × somme.
- Corrections à la main : `rentCtrl` 0, `housing` 30 (`compItems` log 3, `A` 0,32), `sec` {places 78 000, mag 1,3, pen −0,03} ; fiche détaillée par thème.
- Exclu de `costRank`, des conclusions robustes (`rob2.js`, `adv.js` filtrent `fictif`) et de la grille des droits ; tests de régression : 4 contrôles sur ses règles.

## 31 octobre 2026 : justice et sécurité

- Nouvelles séries `prisonD`, `judgeLoad`, `theftI`, `secCost` (thème « Justice et sécurité ») ; paramètres `det0`, `places0`, `mag0`, `police0`, `crimeU` (3 %/pt), `crimeP` (0,3), `secU`.
- `sec` par programme : Le Pen (85 000 places, juges × 2, +10 % de détenus), Attal (+3 %), Glucksmann (−3 %), Mélenchon (`cap` : détenus ≤ places). Coût affiché, non ajouté au déficit.
- Grille : critère `prob` (probité), hors `rightsPts`.

## 31 octobre 2026 : encadrement des loyers (hypothèse)

- `rentCtrl:1` pour Mélenchon et Glucksmann ; `rcSupply` (part de l'investissement locatif privé perdue, 0,05 / 0,15 / 0,25 selon la lecture) et `rcRent` (baisse des loyers des locataires en place, 5 / 3 / 1 %) dans `GL` et le panneau Hypothèses ; tirés dans `runMC`.
- `consNow` × (1 − 0,3 × rcSupply) ; loyers : −rcRent + rcSupply × 100 / 3 sur dix ans (San Francisco). `cons` publié = `consNow`.

## 31 octobre 2026 : recherche des angles morts

- Test d'asymétrie (scratch `adv.js`, 500 tirages) : % des tirages où chaque programme fait mieux que le statu quo, par indicateur, et plage de rangs.
- `runMC` : tirages par programme `adh` ±0,15 et `co2Eff` 0,5-1,1 ; tirages communs `us` (× `uStruct`, 0,3-1,5) et `inf` (× `inflImp`, 0,5-2,5).
- Modèle : `co2Eff` et `(1 − rb)` sur le rythme de décarbonation du programme ; `uStructScale` par lecture (0,5 / 1 / 1,6).
- Robustesse : pauvreté la plus basse Mélenchon 77 %, crise précoce Mélenchon 91 %, tension max Retailleau ou Le Pen 98 %, pauvreté max Retailleau 71 %, dette hors crise min Philippe 58 % (2036 : 48 %), crise pour tous 78 %.
- Asymétries restantes documentées dans la Méthode (pauvreté relative des programmes d'économies sociales, crise de Le Pen et Glucksmann, CO₂ vs statu quo).

## 31 octobre 2026 : crises plus réalistes, pauvreté à seuil figé

Suite à une critique (aucune hypothèse ne rendait la pauvreté de Mélenchon pire que le statu quo), trois corrections communes :
- Crise : choc de croissance −3,5 / −2 / −1 sur trois ans (au lieu de −2 la première année), refus −5 / −1,5 / −0,5 ; Okun × 1,6 pendant trois ans (France 2008-2009). Calage : PIB ≈ −5 % sur trois ans, chômage +2,5 à +3 points ; dette +18 à 22 points par rapport à la trajectoire sans crise (10 à 17 avant).
- Créanciers : `rb` = 25 % puis 50 % des gains des ménages (`decEff`, `paEff`) annulés pendant le programme d'aide (hors refus), −10 points par an après la sortie ; ces annulations s'imputent sur l'ajustement imposé (`fHH = forcedCum − rb × gains`), pas en plus.
- Nouvel indicateur `povA` : pauvreté sous le seuil de 2025 en euros constants (croissance du revenu par habitant, `popG` 0,3 %).
- Effets : 2032 central inchangé ; dette 2046 +6 à 8 points ; lecture libérale : pauvreté 2032 Mélenchon 16,3 % contre 15,3 % pour le statu quo. Robustesse : pauvreté la plus basse Mélenchon 76 % (86), tension la plus forte Retailleau ou Le Pen 97 % (100), pauvreté la plus haute Retailleau 72 % (74).

## 31 octobre 2026 : audit, seconde partie

Relecture indépendante du modèle (rapport dans le scratch `audit5/RAPPORT.md`, probes `audit5me/`) : arithmétique juste (identité de la dette, déficit = primaire + intérêts, sous-secteurs, indices, unités, règle de crédibilité, fuite comptée une fois, 665 + 189 cas limites sans valeur non finie). Corrections, toutes communes :

- Modèle, régime de crise : pendant le programme d'aide, `prem` plafonnée à 1,0 (1,5 en `refus`) au lieu de suivre la dette ; programme de 5 ans, prolongé jusqu'à 10 si `lastDef > tpiDef` (4 %) ; OMT (`tpi`) à la sortie si déficit ≤ 4 ; rechute (`crisisN`, `progEnds`) si `k ≥ 8`, programme terminé, pas d'OMT et `prem > crisisPrem`. Événements `progext`, `progend`, un seul événement de première crise.
- Modèle, crédibilité par sens : `compPos` / `compNeg` ; `taxAis` via la fuite une seule fois ; `unpop = clamp(grossNeg / 3)` (économies et hausses brutes, plus aisés pour moitié) au lieu du solde net ; recul sous tension (`retreat`) appliqué aux seules pertes (`progAt`, `paNeg`, `decNeg`), gains maintenus.
- Modèle, réaction budgétaire : `react` passe par les impulsions (`imp`) et le multiplicateur, plafonnée à 4 points.
- Modèle, leviers réels : `co2Rate`, `aiAdopt`, `rtt` dépendent de `pol` (solidité politique et juridique), pas de `realSp` ; Phillips sur `uStar + uProg + aiDisp` ; `premRef` fixée en 2027 ; marche LPM 2026 retirée du double compte ; `defInA` retiré pour Le Pen (solde publié, pas cible).
- Microsim : clé `jeunes` ; clé composite `social` (retraites 56 % × (1 − m), par tête 44 % × (1 − m), minima m = 20 %) via `setSocialKey`, utilisée pour les économies sociales non détaillées (Philippe, Attal, `ndSav` de tous) ; `m` tiré entre 0,10 et 0,35 dans `runMC`.
- UI : Retailleau `c` 0,48 (38 sur ≈ 144 annuels impliqués par sa cible, et non sur 197 cumulés) ; `runMC` tire `tensionRights` et `socialMin` ; colonne « s'emballe » = rechute ou tension ≥ 80 ; durée du programme dans « Conséquences concrètes ».
- Test sur le passé : repère « sans programme » (`retroRun(E, ctx, mode, noProg)`) dans chaque lecture ; réserves (gap0, chômage structurel, Covid recalé) écrites dans l'onglet.
- Tests : efforts attendus Le Pen +0,3, Retailleau −0,1 ; borne dette 2036 statu quo 156-168 (contrôle de stabilité, Commission 144-156 aux taux de 2024).
- Effet en lecture centrale : efforts Mélenchon −1,9, Glucksmann −1,9, Attal −0,9, Philippe −0,3, Retailleau −0,1, Le Pen +0,3 ; crises statu quo 2038, Mélenchon 2035 (programme jusqu'en 2045, rechute 2046), Le Pen 2036, Glucksmann 2036, Philippe 2039, Retailleau 2038, Attal 2038 ; dette 2046 après crise plus basse de 12 à 19 points pour Mélenchon, Glucksmann et Le Pen ; pauvreté 2032 Mélenchon 12,8, Glucksmann 14,3, statu quo 15,3, Le Pen 15,9, Attal 16,0, Philippe 16,3, Retailleau 16,8. Robustesse (400 tirages) : pauvreté la plus basse Mélenchon 86 %, crise la plus précoce Mélenchon 91 %, tension la plus forte Retailleau ou Le Pen 100 %, pauvreté la plus haute Retailleau 74 %, dette hors crise la plus basse Philippe 54 %, crise pour tous 77 %.
- Reste discutable, documenté sans changement : multiplicateurs permanents à dix ans, seuil de crise à 3 points et prime linéaire jusqu'à 250 % de dette, fuite de 40 % sur les niches de l'IR, dépassement de dépenses pour le seul Mélenchon, métrique « dette 2046 sans crise », statu quo plus pessimiste que la Commission, variante `refus` (retour au marché après cinq ans, sans défaut ni renégociation).

## 31 octobre 2026 : audit, première partie

- Modèle : après une crise avec programme européen, `prem` revient de 0,5 × à 1 × entre la 5e et la 10e année (au lieu d'un retour brutal) ; `inflCum` se résorbe de 30 % par an (perte de pouvoir d'achat d'un choc de prix rattrapée aux deux tiers en deux ans).
- Fourchettes d'incertitude : `tensionRights` tiré entre 0,3 et 1,3 × le réglage.
- Microsim : libellé de la mesure retraites de Mélenchon (62 ans dans le contre-budget 2027 ; 60 ans compté dans l'effort annoncé).
- Tests de cohérence (scratch audit5me) : 665 simulations en cas limites, aucune valeur non finie ; sous-secteurs = déficit total ; monotonie en crédibilité et en fuite vérifiée ; statu quo identique dans les trois modes ; robustesse des conclusions inchangée (pauvreté la plus basse Mélenchon 84 %, tension la plus forte Retailleau ou Le Pen 100 %, crise la plus précoce Mélenchon 88 %).

## 30 octobre 2026 : nouvelle présentation

- Menu latéral (vues : vue d'ensemble, indicateurs détaillés, ménages, incertitude, fiches candidats, droits, test sur le passé, comprendre la dette, méthode et sources, journal) ; rangée d'onglets sur téléphone.
- Vue d'ensemble : cartes par programme (crise, pauvreté, chômage, tension, dette 2046 hors crise), graphique avec indicateurs par thème, « Ce qu'il faut retenir », chiffrages, conséquences.
- Panneau « Hypothèses » (scénario et économie) ; pastilles du scénario en cours.
- Thème sombre, police Schibsted Grotesk ; page utilisable même si Chart.js ne charge pas.

## 30 octobre 2026 : test sur le passé

- Onglet « Test sur le passé » (`src/retro.js`) : Hollande 2012, Macron 2017, Macron 2022 rejoués avec les règles de 2027 ; trois lectures (tel qu'annoncé, à l'aveugle, contexte réel), courbes réalité / simulateur pour dette, déficit, chômage, croissance, inflation ; lecture automatique des écarts.
- Modèle : `b.ext` (contexte imposé par année : croissance, inflation, taux, déficit, tension), `gap0` (écart de production de départ), climat « aucun » et IA « aucune » pour neutraliser ces modules.
- Choc « pandemie » recalé sur 2020-2022 : PIB −8,5 pt d'écart puis +1,5 et +0,5 (au lieu de −7, +5, +1,5), déficit +3 puis +2 (au lieu de +5 puis +2).
- Écarts moyens en fin de période : dette 5,0 pts (aveugle) / 2,5 (contexte) ; déficit 1,6 / 0,5 ; chômage 0,7 / 0,6.

## 30 octobre 2026 : conséquences concrètes

- Modèle : `tensCost` 0,01 (perte d'activité de 0,01 % de PIB par point de tension au-dessus de 60, effet de niveau récupéré quand la tension retombe) ; séries `retreat` (part du programme abandonnée) et `tensGdp`.
- Page : section « Conséquences concrètes » (tension forte, recul, activité perdue, crise de financement), recalculée à chaque réglage.

## 30 octobre 2026 : ajout de Gabriel Attal

- Nouveau candidat `attal` (couleur `--c6`) : A 2,7 (équilibre en dix ans), c 0,35 (≈ 10 Md€ vérifiés sur 120 à 150), baisse des cotisations salariales 46 Md€ (hypothèse Déchiffrer 2027), économies sociales aux deux tiers, compItems IA +10, fonctionnaires −4,2, divers +1.
- Effort retenu −0,9 ; test de régression mis à jour.
- Classement des chiffrages : ligne Attal.

## 30 octobre 2026, nuit (3) : vérification des chiffrages

- Règle commune pour l'effort annoncé : solde publié en Md€ de l'année visée (`gdpRef` 3 100 pour un contre-budget 2027), sinon déficit 2026 (5,4 %) moins la cible du candidat.
- Retailleau A 3,03 → 2,59 (197 Md€ cumulés : cible 2,2 % moins 0,61 d'opérations financières), famMd 10 → 0, baisses d'impôts 51 Md€.
- Philippe A 3,0 → 3,4, compItems entr +50 / −50 (baisse en entier, suppressions d'aides × c), c 0,45 → 0,39.
- Mélenchon gdpRef 3 100, A 0,61 → 0,48, c 0,67 → 0,71, spendOver 29,3 → 38,2, smicCost 18 → 9, curseurs recalés en pts du PIB 2027.
- Le Pen A 2,74 → 2,67, contribution UE −8,9 Md€.
- Glucksmann gdpRef 3 100, A −0,8 → −1,23, flat tax −1,1, électricité 4,2, chèque énergie 4, assurance chômage 2,3.

## 30 octobre 2026, nuit (2) : courbes lissées

- Règle de réaction : montée sur 2031-2040 (au lieu de 2031-2034), qui créait un creux puis un rebond de croissance.
- Seconde crise : les économies imposées ne sont plus remises à zéro.
- Prix des logements : taux immobilier réel au lieu de nominal.

## 30 octobre 2026, nuit : huit compléments

- Population active (Insee 2022) : `LF`, `demog`.
- Solde extérieur courant (`ca`), déficit par administration (`defEtat`, `defSecu`, `defLoc`), prix des logements et loyers (`house`, `rent`, effet sur le pouvoir d'achat), héritages et droits de succession (`inh`, `succ`).
- BCE : `ecb` 0,25 sur l'inflation commune ; intempéries : `climCost` (0,13 % du PIB en 2025, doublé en 2050).
- Chocs : `guerre`, second choc (`shock2`, `shockYear2`), seconde crise possible (`crisisN`, `crisisLast`).
- Retailleau : 5 Md€ d'économies sur les collectivités classés en investissement.

## 30 octobre 2026, fin de soirée : derniers chiffres de l'Insee

- Nouvelle section « Méthodes de calcul » dans l'onglet Informations : les 16 blocs d'équations avec leurs valeurs et sources.
- Insee du 30 octobre : PIB T3 −0,1 % (acquis 0,2 %), inflation d'octobre 3,4 % (IPCH 3,8 %) ; chômage T2 8,3 % ; dette fin juin 119,0 %.
- NEAR : croissance 0,3 / 0,8 / 1,1 ; inflation 2,6 / 2,3 / 1,8 ; ajustement stocks-flux +1 pt en 2026 (PLF 2027 : 119,3 %).

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
