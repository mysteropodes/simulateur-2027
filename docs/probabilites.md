# Le tableau des probabilités : données, modèles, limites

Ce document décrit la section 1 de l'onglet « Changer les règles du jeu » du simulateur. Le tableau donne, pour chaque programme, la probabilité de crises économiques, de pénuries d'énergie, de mobilisations, de violence politique, d'érosion de la démocratie, de chute du gouvernement et d'alternance. Mise à jour : 7 novembre 2026.

**Ce que ce n'est pas.** Ce n'est pas une prévision du vainqueur ni des scores. Aucun sondage n'est utilisé (loi du 19 juillet 1977). On regarde ce qui a suivi, dans l'histoire, des situations économiques comparables à celles que produit chaque programme dans le simulateur. La même règle vaut pour tous.

## 1. Principe

1. Les liens entre l'économie et la politique sont estimés hors du simulateur, sur des données historiques publiques. Les régressions sont faites en Python avec statsmodels, et les erreurs sont groupées par pays.
2. Chaque modèle est testé « hors pays ». On l'estime sans un pays, on prédit ce pays, et on recommence pour tous les pays. Les tests donnent une AUC (0,5 = hasard, 1 = parfait), le score de Brier et une calibration.
3. Les coefficients sont reportés dans `src/polit_data.js` (objet `POLIT`).
4. Dans la page, ils sont appliqués aux 200 tirages de chaque programme. Les tirages sont communs à tous les programmes. Les coefficients sont eux-mêmes tirés dans leur marge d'incertitude (graine fixe, `rng(1789)`). Les écarts avec le statu quo sont calculés tirage par tirage. Le code se trouve dans `src/atlas.js` (`politMC`, `buildPolit`).

Les lignes économiques (récession, inflation, crise de la dette, facture énergétique, rationnement) sont des sorties directes du simulateur. Elles ne viennent pas d'une estimation historique.

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

### Énergie et géopolitique

- **Chocs pétroliers.** Dans 58 démocraties de 1965 à 2015, la dépendance au pétrole n'a pas fait plus de troubles après les chocs de 1973, 1979, 1990 et 2008, à croissance égale (p = 0,37 et 0,38). Le choc passe par l'économie, que le simulateur calcule déjà.
- **Guerre.** Dans 2 177 situations démocratiques de 1900 à 1995 (guerres mondiales exclues), être engagé dans une guerre ne change pas à lui seul le risque de mobilisation. Les scénarios géopolitiques du tableau passent donc par l'économie du simulateur.

## 4. La dette : repères extérieurs

La « crise de la dette » du simulateur est une crise de financement : prêts d'urgence et ajustement imposé, type Grèce, Irlande, Portugal 2010-2011, en plus modéré. Ce n'est pas un défaut. Les séries historiques de dette et de taux longs nécessaires à un calage sur l'histoire n'étaient pas accessibles. Le risque vient donc des règles du simulateur (seuil de prime de risque). Ces repères servent à vérifier l'ordre de grandeur :

- **Marchés, fin octobre 2026.** Le taux à 10 ans a dépassé 5 % pour la première fois depuis 2002 (5,02 % le 23 octobre). L'écart avec l'Allemagne a atteint 1,78 point, au plus haut depuis 2011. Le taux est revenu à 4,90 % le 26 octobre (AFP). Le CDS à 5 ans a dépassé 100 points de base, une première depuis 2012. À ce prix, la probabilité de défaut implicite est d'environ 8 % sur cinq ans, avec 40 % de recouvrement. Cette mesure dite « risque neutre » comprend une prime de risque et surestime donc le risque réel.
- **Commission européenne**, *Debt Sustainability Monitor 2025* (12 février 2026). Le risque est élevé à moyen terme et moyen à long terme. À politique inchangée, la dette passerait de 116,3 % du PIB en 2025 à 144 % en 2036. Dans 95 % des projections, la dette de 2030 dépasse celle de 2025.
- **FMI**, article IV (mai 2026) : ajustement d'environ 0,8 point de PIB par an.
- **Notes.** S&P et Fitch ont abaissé la France en 2025. Moody's la maintient à Aa3 avec une perspective négative (octobre 2026).

## 5. Limites

- **L'économie ne pèse qu'un peu.** Elle déplace les probabilités de quelques points ; le point de départ de la France et le contexte mondial pèsent bien plus que l'écart entre programmes.
- **Mauvaise calibration au-dessus de 50 %.** Les grandes vagues de 1936, 1968 et 1995 n'étaient pas annoncées. Au-dessus de 50 %, la méthode surestime le risque de mobilisation.
- **Indicateurs d'experts.** Les indicateurs V-Dem sont des évaluations d'experts, révisées chaque printemps.
- **Classements de partis discutables.** Les familles de partis de ParlGov sont discutables, surtout avant 1945. ParlGov range le Fidesz et le PiS parmi les conservateurs.
- **Inégalités non comptées.** Leur niveau n'améliore pas la prévision. Leur aggravation n'est montrée qu'en lecture de sensibilité : 50 % à 66 % de grande mobilisation.
- **Climat.** Il n'entre que par la croissance, faute d'effet direct chiffrable pour un pays riche.
- **Pénurie alimentaire.** Elle n'est pas calculée, faute de mesures chiffrées sur l'agriculture dans les programmes.
- **Les scripts d'estimation** (Python) ne sont pas encore dans le dépôt. Les sources ci-dessus permettent de refaire les calculs.
