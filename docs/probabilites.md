# Le tableau des probabilités : données, modèles, limites

Ce document décrit la section 1 de l'onglet « Changer les règles du jeu » du simulateur. Le tableau donne, pour chaque programme, la probabilité de crises économiques, de pénuries d'énergie, de mobilisations, de violence politique, d'érosion de la démocratie, de chute du gouvernement et d'alternance. Mise à jour : 7 novembre 2026.

**Ce que ce n'est pas.** Ce n'est pas une prévision du vainqueur ni des scores. Aucun sondage n'est utilisé (loi du 19 juillet 1977). On regarde ce qui a suivi, dans l'histoire, des situations économiques comparables à celles que produit chaque programme dans le simulateur. La même règle vaut pour tous.

## 1. Principe

1. Les liens entre l'économie et la politique sont estimés hors du simulateur, sur des données historiques publiques. Les régressions sont faites en Python avec statsmodels, et les erreurs sont groupées par pays.
2. Chaque modèle est testé « hors pays ». On l'estime sans un pays, on prédit ce pays, et on recommence pour tous les pays. Les tests donnent une AUC (0,5 = hasard, 1 = parfait), le score de Brier et une calibration.
3. Les coefficients sont reportés dans `src/polit_data.js` (objet `POLIT`).
4. Dans la page, ils sont appliqués aux 200 tirages de chaque programme. Les tirages sont communs à tous les programmes. Les coefficients sont eux-mêmes tirés dans leur marge d'incertitude (graine fixe, `rng(1789)`). Les écarts avec le statu quo sont calculés tirage par tirage. Le code se trouve dans `src/atlas.js` (`politMC`, `buildPolit`).

Les lignes économiques sont des sorties directes du simulateur et ne viennent pas d'une estimation historique : récession, inflation, dette plus haute en 2030 qu'en 2025, nouvelle dégradation de la note, chômage à 10 % ou plus, pauvreté plus haute en 2032 qu'en 2025, crise de la dette, facture énergétique, rationnement. La ligne sur la dette en 2030 sert de contrôle : la Commission européenne trouve 95 % dans ses projections aléatoires à politique inchangée, le simulateur 100 % pour tous les programmes, un peu plus pessimiste comme ses projections centrales.

## 2. Données

| Source | Contenu utilisé | Licence |
|---|---|---|
| V-Dem v16 (2026) | Mobilisation de masse, violence politique, polarisation, démocratie libérale, régimes, partage du pouvoir selon la richesse, 1900-2025 | CC BY-SA 4.0 |
| ParlGov (version de développement) | Élections législatives, résultats par parti, familles de partis, gouvernements et partis au gouvernement, 1900-2023 | CC0 |
| Jordà-Schularick-Taylor Macrohistory, extrait R6 | PIB réel, prix, taux courts, 18 pays avancés, 1870-2020 | CC BY-NC-SA 4.0 |
| Reinhart-Rogoff (1800-2010) et Laeven-Valencia (2018) | Dates des crises bancaires | Données publiques des auteurs |
| SWIID 9.92 (Solt) | Gini du revenu disponible et du revenu marchand | Libre, citation demandée |
| Our World in Data, energy-data | Énergie primaire par source, 1965-2024 | CC BY 4.0 |
| Clio Infra, via V-Dem | Guerres interétatiques, 1900-1995 | Données publiques |

**Écartées.** La Global Macro Database n'est pas utilisée : sa licence est réservée à la recherche. ACLED n'est pas utilisée : la redistribution est interdite. Les séries complètes du WID, de Berkeley Earth et de JST n'étaient pas accessibles depuis l'environnement de calcul.

## 3. Les modèles

### Grande mobilisation et violence politique forte (V-Dem)

- **Échantillon.** Démocraties de 1900 à 2015, années de guerre mondiale exclues : 3 886 situations dans 111 pays.
- **Événement mesuré.** Une mobilisation de masse atteint au moins 2 sur l'échelle V-Dem dans les cinq ans (niveau des gilets jaunes, de mai 1968 ou du Front populaire). Pour la violence politique, le seuil est 1 (niveau de 1934 ou de 2021 en France).
- **Variables.** Mobilisation des trois dernières années, polarisation, démocratie libérale, niveau moyen de la région, croissance moyenne des cinq années suivantes (logit).
- **Effet de la croissance.** Chaque point de croissance annuelle en moins multiplie les chances de grande mobilisation par 1,17 (de 1,06 à 1,30 ; p = 0,003). Pour la violence, l'effet est de 1,10 et n'est pas significatif (p = 0,20).
- **Test hors pays.** Mobilisation : AUC 0,840, contre 0,834 sans la croissance. Violence : AUC 0,96. L'essentiel vient du point de départ, et la France de 2025 part de très haut.
- **Coupes budgétaires.** Elles s'ajoutent à l'effet de la croissance. Selon l'estimation prudente de Ponticelli et Voth (2020), chaque point de PIB de baisse des dépenses dans l'année augmente le risque de troubles d'environ 9 % cette année-là.
- **Qui gouverne.** L'arrivée de la droite ou de la gauche radicale au gouvernement (ParlGov) ne change pas la violence après 1945, à point de départ égal : coefficient +0,07 (p = 0,92) pour la droite radicale. Avant 1940, l'effet est fort : +4,03 (p = 0,02). Le tableau retient donc le même niveau de violence pour tous.

### Vote pour la droite et la gauche radicales (ParlGov)

- **Échantillon.** 592 élections législatives de 37 démocraties, 1906-2020.
- **Modèle.** On explique l'évolution du vote d'une législative à la suivante. Les variables sont le niveau de départ, le niveau moyen dans les autres démocraties, la croissance moyenne de la législature et l'inflation au-dessus de celle des cinq années précédentes.
- **Droite radicale.** Chaque point de croissance en moins ajoute 0,11 point (p = 0,26). Chaque point d'inflation en plus ajoute 0,06 point (p = 0,06). Une crise bancaire pendant la législature ajoute environ 1,2 point (p = 0,15 ; 59 législatures avec crise sur 515).
- **Gauche radicale.** Aucun effet mesurable de l'économie.
- **Affichage.** Seul l'écart avec le statu quo est montré. Aucun score n'est projeté.

### Érosion forte de la démocratie (analogues V-Dem)

- **Méthode.** On cherche les 25 situations démocratiques de 1950 à 2020 les plus proches de la France de 2025, sur douze indicateurs, et on observe ce qu'elles sont devenues dix ans plus tard. Les mesures de chaque programme sur les libertés sont converties en points V-Dem selon une règle commune, calée sur la Pologne et la Hongrie.
- **Effet d'une crise.** Une crise économique double les chances d'érosion (rapport de chances 2,1). Le risque est recalculé en direct avec le risque de crise de chaque programme.
- **Test à l'aveugle.** Plus de 900 situations passées. Un cas qui a mal tourné reçoit un risque plus élevé qu'un cas stable dans plus de 80 % des comparaisons.

### Chute du gouvernement ou rupture de la coalition (ParlGov)

- **Échantillon.** 997 gouvernements formés dans 37 démocraties de 1946 à 2018, suivis cinq ans.
- **Événement mesuré.** Le gouvernement est remplacé, sans nouvelle législative, par un gouvernement d'une autre composition ou dirigé par un autre parti : censure, départ d'un allié, démission.

| Majorité sortie des urnes | Chute ou rupture dans les 5 ans | Gouvernements |
|---|---|---|
| Un parti a la majorité absolue à lui seul | 8 % | 196 |
| Coalition majoritaire, aucun parti seul | 40 % | 456 |
| Gouvernement minoritaire | 36 % | 345 |

- **Ce qui n'a pas d'effet.** La croissance, la pire année de croissance et une crise bancaire ne changent pas ce risque (p de 0,2 à 0,9).
- **La polarisation compte.** Elle ajoute +0,44 par point de l'échelle V-Dem (p < 0,01). Test hors pays : AUC 0,70.
- **La France est hors de l'échantillon.** En 2025, elle est plus polarisée que 96 % des gouvernements observés. Il y a trop peu de cas aussi polarisés pour chiffrer : le risque français est sans doute au-dessus de ces moyennes.
- **Pourquoi une seule ligne pour tous.** Le risque dépend de la majorité que donneront les électeurs, que le simulateur ne prédit pas. Le tableau affiche donc ces trois niveaux, les mêmes pour tous les programmes.
- **Élections anticipées.** Dans les cinq ans, 41 % des gouvernements majoritaires en connaissent et 37 % des minoritaires. Il n'y a de lien mesurable ni avec la majorité, ni avec la polarisation, ni avec l'économie : c'est surtout un choix tactique.
- **France.** Deux censures adoptées : Pompidou le 5 octobre 1962, Barnier le 4 décembre 2024. Une confiance refusée : Bayrou le 8 septembre 2025, par 194 voix pour et 364 contre. Six dissolutions : en 1962, 1968 et 1981, le président a obtenu une majorité absolue ; en 1988, 1997 et 2024, non.

### Alternance (ParlGov)

- **Événement mesuré.** Après une législative, le parti qui dirige le gouvernement change. C'est le cas dans 43 % de 526 élections de 36 démocraties (1946-2023).
- **Modèle.** Logit sur la croissance et l'inflation moyennes de la législature, 473 élections. Croissance : −0,19 par point (p = 0,001). Inflation : +0,09 par point (p < 0,001). Autour de 45 %, chaque point de croissance en moins ajoute environ 5 points de probabilité, et chaque point d'inflation en plus environ 2 points.
- **Par quart de croissance.** 54 % d'alternance quand la croissance annuelle moyenne est autour de 0,6 %, 34 % quand elle est autour de 6 %.
- **Test hors pays.** AUC 0,65, contre 0,58 avec la croissance seule. Une crise bancaire n'ajoute rien de significatif (p = 0,27).
- **Application.** Le modèle est appliqué à la croissance et à l'inflation 2027-2032 de chaque tirage. On obtient la probabilité que le camp au pouvoir, quel qu'il soit, perde la main en 2032.
- **Limite pour la France.** En France, l'alternance se joue d'abord à la présidentielle, que ParlGov ne mesure pas. On retient la moyenne des démocraties. Repère : depuis 1981, le président élu venait de l'autre camp en 1981, 1995, 2012 et 2017 ; le sortant ou son camp ont gardé la main en 1988, 2002, 2007 et 2022.

### Intérêts de la dette face aux grands budgets

- **Point de départ (projet de budget 2027).** Intérêts de la dette de l'État : 72,9 Md€. Éducation nationale : environ 64 Md€ hors pensions. Armées : 64 Md€ hors pensions. Pour l'ensemble des administrations publiques, Bercy annonce environ 91 Md€ d'intérêts en 2027 ; le simulateur en calcule 3,1 % du PIB, du même ordre.
- **Prolongement jusqu'en 2032, tirage par tirage.** Les intérêts de l'État suivent les intérêts publics du simulateur (même part qu'en 2027). L'Éducation nationale garde sa part du PIB de 2027. Les Armées suivent la trajectoire de défense de chaque programme.
- **Ligne du tableau.** Part des tirages où les intérêts de l'État dépassent en 2032 l'Éducation nationale et les Armées réunies.
- **Charge réelle.** Intérêts moins inflation des prix × dette de l'année précédente, en % du PIB ; c'est une approximation, l'OFCE utilise le déflateur du PIB. Repères de François Geerolf (OFCE, octobre 2026) : environ 0,9 point de PIB en 2027, 2,9 points en moyenne de 1993 à 1999. Son argument : les comparaisons en euros courants exagèrent le poids de la dette. L'argument inverse : ce sont des euros à financer chaque année.

### Été meurtrier

- **Ligne du tableau.** Au moins un été à plus de 5 000 décès dus à la chaleur entre 2027 et 2032. Le risque est le même pour tous : les programmes ne changent presque rien à l'exposition d'ici là.
- **Données (Santé publique France, décès attribuables à la chaleur du 1er juin au 15 septembre).** Environ 33 000 décès de 2014 à 2022, soit 1 000 à 7 000 par été. Plus de 5 000 en 2023, plus de 3 700 en 2024, plus de 5 700 en 2025.
- **Fréquence et probabilité.** Au moins deux étés sur douze ont dépassé 5 000 décès (2023, 2025). Le détail année par année de 2014 à 2021 n'est pas publié, donc ce chiffre est un minimum. Au rythme 2014-2025, la probabilité sur six étés est d'au moins 67 %. Au rythme des trois derniers étés, elle dépasse 99 %.
- **Ce qui n'est pas utilisé.** Les 10 420 décès de l'été 2022 souvent cités sont un excès toutes causes, Covid compris, et non des décès dus à la chaleur. Ils ne sont pas utilisés. L'été 2003 a fait environ 15 000 décès en excès.

### Alimentation

Ces trois lignes sont les mêmes pour tous les programmes : aucun ne change le marché mondial ni la météo d'ici 2032.

- **Flambée mondiale des prix.** Indice des prix alimentaires de la FAO, mensuel, de janvier 1990 à août 2026. On compte une flambée quand l'indice monte de 30 % ou plus sur un an. Il y en a eu 3 en 35,6 ans (2007-2008, 2010-2011, 2021-2022), soit environ 41 % de risque sur six ans. Avec un seuil de +20 %, 5 épisodes et environ 60 %. En août 2026, l'indice est à 133, en hausse de 2,5 % sur un an.
- **Prix de l'alimentation +10 % en France.** Sur ces trois flambées, une seule a fait dépasser 10 % en France, quand elle s'est ajoutée au choc de l'énergie : +6,8 % en 2022 et +11,8 % en 2023 en moyenne annuelle (Insee), +15,9 % sur un an en mars 2023. D'où environ 41 % ÷ 3, soit 14 %.
- **Mauvaise récolte de blé.** Rendement d'au moins 10 % sous la moyenne des cinq années précédentes, sans la meilleure ni la pire (moyenne dite olympique, comme celle d'Agreste). Source : FAOSTAT via Our World in Data, 1961-2018, puis Agreste pour 2024 (60,9 quintaux par hectare) et 2025 (74,0).
  - Mauvaises récoltes trouvées : 1975, 1976, 2003 (−14 %), 2007 (−11 %), 2016 (−27 %), 2024.
  - Probabilité sur six ans : environ 63 % au rythme de 2000-2025 (4 mauvaises récoltes en 26 ans), 44 % au rythme de 1961-2025.
  - La France exporte environ la moitié de son blé : une mauvaise récolte touche les agriculteurs et les exportations, pas l'approvisionnement.
- **Rationnement.** Il n'est pas calculé : il n'y en a pas eu depuis 1949, et il n'a pas de fréquence mesurable en temps de paix.

### Crises bancaires

- **Fréquence historique.** On compte les débuts de crise bancaire (Reinhart-Rogoff 1800-2010, Laeven-Valencia jusqu'en 2017) dans les 18 pays avancés de la base Jordà-Schularick-Taylor et en Irlande. Le taux annuel est de 2,2 % sur 1950-2017 et de 3,6 % sur 1990-2017, soit 12 à 20 % de risque sur six ans. France : 1994 (Crédit lyonnais) et 2008.
- **Écart avec le simulateur.** Le simulateur tire une crise financière mondiale de type 2008 dans environ 3 % des tirages d'ici 2032, et 7 % d'ici 2040. C'est plus rare que l'histoire, en partie parce que les crises bancaires historiques comptent aussi celles sans récession. Cet écart est affiché, pas corrigé.

### Énergie et géopolitique

- **Chocs pétroliers.** Dans 58 démocraties de 1965 à 2015, la dépendance au pétrole n'a pas fait plus de troubles après les chocs de 1973, 1979, 1990 et 2008, à croissance égale (p = 0,37 et 0,38). Le choc passe par l'économie, que le simulateur calcule déjà.
- **Guerre.** Dans 2 177 situations démocratiques de 1900 à 1995 (guerres mondiales exclues), être engagé dans une guerre ne change pas à lui seul le risque de mobilisation. Les scénarios géopolitiques du tableau passent donc par l'économie du simulateur.

## 4. Où mènent les crises

On compare, dans les démocraties (V-Dem, années de guerre exclues), ce qui suit dans les cinq ans une crise économique et ce qui suit les autres années. Une crise est un début de crise bancaire (Reinhart-Rogoff, Laeven-Valencia) ou une baisse du PIB d'au moins 3 % dans l'année. Deux échantillons : les démocraties riches de 1946 à 2018 (les 30 % les plus riches de leur année, 92 crises) et toutes les démocraties de l'entre-deux-guerres (1919-1939, 55 crises).

| Dans les cinq ans | Riches 1946-2018 : après crise | sans crise | 1919-1939 : après crise | sans crise |
|---|---|---|---|---|
| Le parti du chef du gouvernement change | 78 % | 57 % | 79 % | 70 % |
| Vers la gauche, si la droite gouverne | 42 % | 31 % | 36 % | 25 % |
| Vers la droite, si la gauche gouverne | 81 % (16 cas) | 59 % | – | – |
| La gauche radicale entre au gouvernement | 13 % | 5 % | 4 % | 1 % |
| La droite radicale entre au gouvernement | 8 % | 5 % | 8 % | 13 % |
| Grande mobilisation | 11 % | 9 % | 13 % | 5 % |
| Violence politique forte | 1 % | 3 % | 24 % | 8 % |
| Bascule en autocratie (deux ans au moins) | 1,1 % (Uruguay, 1973) | 0,9 % | 13 % (Autriche, Allemagne) | 11 % |
| Guerre civile | 0 % | 0,3 % | 5,5 % | 1,8 % |
| Guerre entre États | 4 % | 8 % | 20 % | 14 % |

**Ce qu'on retient.** Depuis 1945, dans les démocraties riches, une crise se paie dans les urnes : le parti au pouvoir est remplacé, souvent par l'autre camp, et les partis radicaux entrent plus souvent au gouvernement. Dictatures, coups d'État et guerres civiles ne suivent pas les crises, au contraire de l'entre-deux-guerres.

**Limites.** Certaines cases reposent sur peu de cas. Les années de crise successives d'un même pays comptent chacune (la Grèce de 2010 à 2012). Les données de guerre s'arrêtent en 2000 et 2006. ParlGov range le Fidesz et le PiS parmi les conservateurs.

**Lignes du tableau.**

- Bascule en dictature : environ 1 % pour tous. C'est le risque de crise du programme multiplié par 1,1 %, plus le reste multiplié par 0,9 %.
- Guerre civile ou guerre entre États : pas plus probable après une crise.

## 5. Démocratie illibérale

V-Dem distingue quatre régimes : démocratie libérale, démocratie électorale, autocratie électorale et autocratie fermée. La démocratie électorale correspond à ce qu'on appelle souvent une démocratie illibérale : les élections restent libres, mais la justice, les contre-pouvoirs et les libertés sont moins bien garantis.

- **Où en est la France.** Elle reste une démocratie libérale, mais dans la limite basse de la catégorie depuis 2021. Son indice de démocratie libérale est stable à 0,80. Sa polarisation est passée de 0,26 en 2020 à 1,43 en 2025.
- **La vague récente.** Sur les 41 démocraties libérales de 2015, 11 sont devenues des démocraties électorales en 2025 : États-Unis, Royaume-Uni, Canada, Portugal, Grèce, Pologne, Slovaquie, Slovénie, Israël, Botswana, Maurice. Aucune n'est devenue une autocratie.
- **Le modèle.** Échantillon : les démocraties libérales depuis 1950. Événement : bascule en démocratie électorale ou moins. Logit sur le niveau de démocratie libérale, la limite basse, la polarisation, le recul sur cinq ans et les mobilisations.
  - Fréquence de base : 5 % en cinq ans, 12 % pour les démocraties à la limite basse.
  - France : 15 % d'ici 2030, 21 % d'ici 2035.
  - Test hors pays : AUC 0,72 et 0,67, calibration correcte.
  - Passage direct à l'autocratie : 0,2 % en cinq ans.
- **Les programmes.** Appliquées telles qu'annoncées, les mesures de Mélenchon, Le Pen et Retailleau font reculer l'indice d'au moins 0,10 selon la grille du simulateur. La France passerait alors autour de 0,70, le niveau de pays classés démocraties électorales : Royaume-Uni 0,69, Portugal 0,72, Canada 0,74.
- **Deux méthodes, deux chiffres.** Le risque d'« érosion forte » des analogues (autour de 50 % d'ici 2035) vient des 25 situations passées les plus proches de la France. Ce sont surtout des démocraties polarisées des années 2010, dont beaucoup ont reculé.
- **Non chiffré.** Le gouvernement de techniciens (Italie et Grèce en 2011) et le changement de Constitution n'ont pas assez de cas comparables pour être chiffrés.

## 6. Les partis : mesurer plutôt qu'étiqueter

Les mots « extrême » et « radical » n'entrent dans aucun calcul.

- **Les familles de partis.** Le simulateur reprend celles de ParlGov, de façon symétrique : « gauche radicale » (famille communiste/socialiste, qui inclut LFI) et « droite radicale » (qui inclut le RN). Pour les municipales de 2026, le ministère de l'Intérieur range LFI à l'extrême gauche, et le Conseil d'État a rejeté son recours le 27 février 2026 sans qualifier le parti sur le fond. La science politique parle plutôt de gauche radicale, qui rejette la structure du capitalisme mais conquiert le pouvoir par l'élection.
- **La mesure d'anti-pluralisme de V-Party.** Pour savoir si un parti au pouvoir fait reculer la démocratie, le simulateur utilise aussi l'indice d'anti-pluralisme de V-Party (base des partis de V-Dem, CC BY-SA 4.0). C'est une mesure d'experts, de 0 à 1, faite à chaque élection : engagement envers les règles démocratiques, diabolisation des adversaires, respect des minorités, rejet de la violence.
  - France, dernière mesure en 2017 : Renaissance et PS 0,03, LR 0,05, PCF 0,20 (2012), LFI 0,28, FN 0,49.
  - Ailleurs : Die Linke 0,06, Démocrates américains 0,22, M5S 0,49, Syriza 0,59, Vox 0,61, Fidesz 0,66, AfD 0,66, Républicains américains 0,69, PiS 0,71, Ligue 0,90.
- **Ce qui a suivi dans l'histoire.** Démocraties de 1946 à 2019, 3 179 situations, en retenant le parti le plus anti-pluraliste au gouvernement.
  - Érosion forte en dix ans : 3,5 % quand ce parti est sous 0,1, 17 % quand il atteint 0,5 ou plus.
  - Recul de régime : 4 % contre 32 %.
  - À point de départ égal (niveau de démocratie, polarisation, mobilisations), l'effet propre est faible et non significatif (p = 0,59), et la prévision hors pays ne s'améliore pas : ces partis arrivent surtout au pouvoir là où la démocratie est déjà fragile.
- **Application à la France de 2025.** Risque d'érosion forte d'ici 2035 d'environ 20 % avec Renaissance ou le PS au pouvoir, 21 % avec LR, 22 % avec LFI, 23 % avec le RN.
- **Limites.** La mesure de V-Party date de 2017 pour la France. Horizons et Place publique n'existaient pas encore.

## 7. La France face à l'Europe et au monde

Les modèles de mobilisation et de violence sont appliqués au point de départ de 2025 de chaque démocratie (V-Dem 2026 : 84 démocraties, dont 26 dans l'Union européenne ; la Hongrie est classée autocratie électorale). La croissance est la même pour tous, 1 % par an, pour ne comparer que les points de départ.

| Indicateur | France | Union européenne | Démocraties du monde | Place de la France |
|---|---|---|---|---|
| Grande mobilisation d'ici 2032 | 47 % | 24 % | 25 % | 4e de l'UE (Pologne 75 %, Slovaquie 69 %, Pays-Bas 60 %) |
| Violence politique forte d'ici 2032 | 9 % | 1 % | 8 % | 2e de l'UE (Grèce 13 %) |
| Polarisation (V-Dem 2025) | 1,43 | 0,03 | – | 4e de l'UE, 15e sur 84 |
| Vote pour la droite radicale (ParlGov, dernières législatives jusqu'en 2023) | 22,9 % (2022) | 11,7 % | 10,7 % (37 démocraties) | 3e de l'UE |
| Durée médiane des gouvernements formés de 1990 à 2023 (plus de trois mois) | 1,6 an | 2,3 ans | – | 9e plus courte sur 27 |
| Dette publique, 2e trimestre 2026 (Eurostat) | 119,1 % | 82,9 % (zone euro 88,8 %) | – | 3e, après la Grèce et l'Italie |
| Déficit 2025 (Eurostat) | 5,1 % | 3,1 % | – | 4e plus fort |
| Taux à 10 ans, 21 octobre 2026 | 5,01 % | Allemagne 3,4 %, Espagne 4,06 %, Italie 4,57 % | – | plus cher que l'Italie |
| Crises bancaires 1970-2017 | 2 | 1,4 en moyenne (17 pays) | – | un peu au-dessus |
| Décès dus à la chaleur, été 2022 (Ballester et al., 2023) | 71 par million | 114 par million (35 pays) | – | sous la moyenne (Italie 306) |

## 8. La dette : repères extérieurs

La « crise de la dette » du simulateur est une crise de financement : prêts d'urgence et ajustement imposé, type Grèce, Irlande, Portugal 2010-2011, en plus modéré. Ce n'est pas un défaut. Les séries historiques de dette et de taux longs nécessaires à un calage sur l'histoire n'étaient pas accessibles. Le risque vient donc des règles du simulateur (seuil de prime de risque). Ces repères servent à vérifier l'ordre de grandeur, et ont servi au calage de l'« humeur des marchés » (ci-dessous) :

- **Marchés, fin octobre 2026.** Le taux à 10 ans a dépassé 5 % pour la première fois depuis 2002 (5,02 % le 23 octobre). L'écart avec l'Allemagne a atteint 1,78 point, au plus haut depuis 2011. Le taux est revenu à 4,90 % le 26 octobre (AFP). Le CDS à 5 ans a dépassé 100 points de base, une première depuis 2012. À ce prix, la probabilité de défaut implicite est d'environ 8 % sur cinq ans, avec 40 % de recouvrement. Cette mesure dite « risque neutre » comprend une prime de risque et surestime donc le risque réel.
- **Commission européenne**, *Debt Sustainability Monitor 2025* (12 février 2026). Le risque est élevé à moyen terme et moyen à long terme. À politique inchangée, la dette passerait de 116,3 % du PIB en 2025 à 144 % en 2036. Dans 95 % des projections, la dette de 2030 dépasse celle de 2025.
- **FMI**, article IV (mai 2026) : ajustement d'environ 0,8 point de PIB par an.
- **Notes.** S&P et Fitch ont abaissé la France en 2025. Moody's la maintient à Aa3 avec une perspective négative (octobre 2026).

**Calage sur les marchés (7 novembre 2026).** Avant ce calage, l'écart de taux de chaque tirage ne dépendait que de la dette, du déficit, des notes, de l'instabilité politique et des chocs. Aucun tirage du statu quo n'avait de crise avant 2032 (0 %), alors que les marchés payaient environ 8 % de risque de défaut sur cinq ans. Il manquait la volatilité ordinaire de l'écart.

- **Ce qui est ajouté.** Dans chaque tirage, l'écart de chaque année est multiplié par exp(x − v/2). x suit un processus autorégressif : persistance 0,8, écart-type des chocs 0,26 par an, x = 0 en 2026. v est la variance de x, ce qui garde un facteur de moyenne 1. Le générateur aléatoire est séparé, pour ne pas déplacer les autres tirages. Les courbes principales ne changent pas.
- **D'où viennent les valeurs.** Écart des taux à 10 ans avec l'Allemagne (OCDE, via FRED), moyennes annuelles, logarithme. Régression autorégressive groupée sur la France, l'Italie, l'Espagne, le Portugal et l'Irlande. Sur 2015-2025 : écart-type 0,257, persistance 0,885. Sur 2008-2025 : 0,42 et 0,81. France seule : 0,22 sur 2015-2025, 0,29 sur 2008-2025. On retient la période hors crise de la zone euro, parce que les crises du type 2010-2012 sont déjà tirées à part (choc « crise financière »).
- **Résultat, réglages par défaut**, après le calage de la sensibilité à la dette et le canal du crédit (ci-dessous). Crise de financement avant 2032 : 11 % pour le statu quo, de 13 à 39 % pour les programmes des candidats (0 à 11 % avant ces calages). D'ici 2046 : 83 % pour le statu quo, de 84 à 95 % pour les candidats, 66 % pour le candidat fictif, 42 % pour le scénario du gouvernement.
- **Sensibilité.** Avec un écart-type de 0,20, le statu quo est à 8 % avant 2032 ; avec 0,29, à 13 %.

**Calage de la sensibilité à la dette sur l'histoire (7 novembre 2026, base Jordà-Schularick-Taylor R6 complète).** On mesure l'écart des taux à 10 ans avec l'Allemagne dans huit pays de la zone euro (Belgique, Espagne, Finlande, France, Irlande, Italie, Pays-Bas, Portugal), de 1999 à 2020, selon la dette et le déficit de l'année précédente.

- **Hors années de crise :** l'écart monte de 0,47 point par tranche de 10 points de dette au-delà de 100 % (p < 0,01) ; le déficit au-delà de 3 % ajoute 0,08 point par point, sans effet net.
- **Sur toute la période :** 0,52 point pour la dette et 0,66 point pour le déficit, tirés par la crise de 2010-2013.
- **Ce qui change dans le simulateur.** La sensibilité à la dette passe de 0,3 (Commission européenne, dette moyenne) à 0,47 en lecture centrale, 0,31 en keynésienne et 0,70 en libérale. Le seuil de départ passe de 100 à 107 %, pour que l'écart de 2027 reste celui de fin octobre 2026. La sensibilité au déficit reste à 0,11, entre les deux estimations.
- **Le seuil de crise est cohérent avec l'histoire.** Le Portugal (7,6 points en 2011) et l'Irlande (7,0) ont perdu l'accès au marché. L'Espagne (4,3 en 2012) n'a reçu qu'une aide pour ses banques, et l'Italie (4,0) a tenu avec la BCE. Le simulateur place le seuil entre 3 et 6 points.
- **Comment finissent les dettes élevées.** La dette a franchi 100 % du PIB 18 fois en temps de paix depuis 1870, dans les 18 pays de la base. Dans les dix ans qui ont suivi :
  - crise bancaire : 28 % des cas ;
  - inflation au-dessus de 10 % : 22 %, surtout avant 1946 ;
  - baisse d'au moins 20 points de dette : 22 % (Canada après 1995, Irlande après 1986) ;
  - aucune crise de financement au Japon ni en Belgique, malgré une dette en hausse ; le Portugal a connu la crise de 2011.
- **Limite.** La base ne donne pas les dates de défaut ni de programme d'aide. On ne peut donc pas en tirer directement la fréquence des crises de la dette selon le niveau de dette.

**Écart de taux → crédit → croissance (7 novembre 2026).** Les banques répercutent l'écart de taux de l'État sur les crédits aux entreprises et aux ménages. Dans le modèle, chaque point d'écart au-delà de celui de fin octobre 2026 coûte, à l'équilibre, 0,2 % de PIB ; l'écart retenu est celui de l'année précédente, plafonné au seuil de crise.

- **Sources.** Banque d'Italie (Albertazzi et al., 2012) : la moitié de l'écart passe aux crédits en un trimestre, tout en un an. FMI (Italie, 2018) : la hausse durable des écarts coûte 0,2 à 0,4 % de PIB en deux ans.
- **La fuite des capitaux.** Dans la zone euro, elle passe par ce canal et par l'écart de taux, pas par une dévaluation comme en France en 1981-1983.
- **Effets en lecture centrale.** Croissance 2027-2031 : 1,07 % au lieu de 1,13 pour Mélenchon, 0,81 au lieu de 0,85 pour Le Pen. Crise avant 2032 : +0 à +1 point.
- **Résultats par défaut après ce canal.** Crise avant 2032 : 11 % pour le statu quo, de 13 à 39 % pour les candidats. D'ici 2046 : 83 % pour le statu quo, de 84 à 95 % pour les candidats.
- **Comparaison avec le marché.** Le prix du marché (8 %) porte sur un défaut ; une crise de financement est plus large : l'Irlande, le Portugal et l'Espagne ont été aidés sans faire défaut. Ce prix mêle aussi tous les résultats possibles de l'élection, que le simulateur ne pondère pas.

**Les solutions BCE de LFI (8 novembre 2026).** Trois versions testées sur le programme de Mélenchon, en lecture centrale (200 tirages, script `tests/bce-scenarios.js`) : gel en dette perpétuelle à taux zéro, annulation, révision du traité et des statuts de la BCE (achat direct, interdiction de revente).

- **Correction préalable.** La part gardée par la BCE est un montant fixe en euros (18 % de la dette fin 2026), et non plus une part de la dette totale qui grossissait avec elle. Effets : Mélenchon inchangé ; candidat fictif 64 → 66 % d'ici 2046.
- **Résultats (crise avant 2032 / d'ici 2046).** Programme tel que modélisé 39 / 95 % ; BCE qui accepte, conflit maintenu 37 / 93 % ; gel selon LFI (gain complet, aucune réaction) 12 / 87 % ; annulation selon LFI (−18 points en 2027) 4 / 81 % ; annulation avec la vraie comptabilité (la Banque de France ne reverse plus rien) 4 / 81 % ; la même avec conflit 16 / 88 % ; traité révisé (taux plafonnés par la BCE) 2 / 2 % ; escalade sur les capitaux (prime doublée, refus) 59 / 97 % ; référence sans gel ni conflit 21 / 92 %.
- **Lecture.** Le gel rapporte peu face au coût du conflit. Avec les hypothèses de LFI, le gain de court terme est réel, mais aucune version, sauf le traité révisé, ne ramène le risque d'ici 2046 sous 80 % : le déficit reste élevé.
- **Désobéir de l'intérieur.** Crise avant 2032 / d'ici 2046 : désobéissance telle que modélisée 39 / 95 % ; refus du plan d'aide 39 / 95 % (pauvreté 2040 15,1 % au lieu de 16,3) ; BCE qui plafonne l'écart malgré le conflit (`ecbProtect` 2,5 ou 1,5) 0 / 0 %, dette 2046 de 206 à 227 % ; sanctions européennes de 0,35 point de PIB par an (`sanction`) 41 / 96 % ; alliés à 40 % 30 / 93 % ; escalade 57 / 96 % ; référence sans conflit 21 / 92 %. Tout dépend de la décision de la BCE, qui ne se chiffre pas.
- **Limites.** Risque d'inflation du financement direct non compté ; les marchés sont supposés regarder la dette affichée, pas les pertes de la Banque de France (objection d'Olivier Blanchard) ; la prime doublée est une hypothèse (Italie 2018 : environ +1,8 point d'écart avec l'Allemagne, moyennes mensuelles OCDE).

## 9. Limites

- **L'économie ne pèse qu'un peu.** Elle déplace les probabilités de quelques points ; le point de départ de la France et le contexte mondial pèsent bien plus que l'écart entre programmes.
- **Mauvaise calibration au-dessus de 50 %.** Les grandes vagues de 1936, 1968 et 1995 n'étaient pas annoncées. Au-dessus de 50 %, la méthode surestime le risque de mobilisation.
- **Indicateurs d'experts.** Les indicateurs V-Dem sont des évaluations d'experts, révisées chaque printemps.
- **Classements de partis discutables.** Les familles de partis de ParlGov sont discutables, surtout avant 1945. ParlGov range le Fidesz et le PiS parmi les conservateurs.
- **Inégalités non comptées.** Leur niveau n'améliore pas la prévision. Leur aggravation n'est montrée qu'en lecture de sensibilité : 50 % à 66 % de grande mobilisation.
- **Climat.** Il n'entre que par la croissance, faute d'effet direct chiffrable pour un pays riche.
- **Pénurie alimentaire.** Elle n'est pas calculée, faute de mesures chiffrées sur l'agriculture dans les programmes.
- **Les scripts d'estimation** (Python) ne sont pas encore dans le dépôt. Les sources ci-dessus permettent de refaire les calculs.
