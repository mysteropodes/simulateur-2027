# Qui pourrait gouverner ? Méthode du calculateur de sièges

Section 12 de l'onglet « Changer les règles du jeu ». Code : `src/parl.js` ; données : `src/parl_data.js` ; test : `tests/parl.js`.

## Principe

Aucun sondage n'est utilisé : aucune personne n'a été interrogée. Le point de départ est le résultat officiel du premier tour des législatives 2024 dans les 577 circonscriptions. Le visiteur choisit ce qui change. Rien n'est une prévision ; avec les réglages par défaut, le calcul rejoue 2024.

## Données

| Donnée | Source | Licence |
|---|---|---|
| Législatives 2024 et 2022, premier et second tours, par circonscription et par candidat | ministère de l'Intérieur, via data.gouv.fr | Etalab 2.0 |
| Présidentielle 2022, premier tour, par circonscription législative | ministère de l'Intérieur, via data.gouv.fr | Etalab 2.0 |
| Parti des candidats du NFP en 2024 (LFI ou non) | presse (Le Monde), compilation ouverte | — |
| Législatives 1958-2022 (voix et sièges par parti), gouvernements | ParlGov (Döring, Huber et Manow), version de développement | CC0 |
| Groupes de l'Assemblée au 30 octobre 2026 | Assemblée nationale (modifications de la composition des groupes), Datan | — |

## Blocs

Six blocs d'après la nuance officielle des candidats en 2024 : LFI (candidats NFP membres de LFI) ; PS, écologistes, PCF (autres candidats NFP, SOC, DVG, COM, VEC, RDG) ; centre (ENS, DVC, HOR, UDI) ; LR et divers droite (LR, DVD) ; RN et alliés (RN, UXD, REC, EXD, DSV) ; autres (EXG, REG, DIV, ECO). Pour 1958-2022, partis ParlGov regroupés en cinq blocs ; l'UDF compte à droite jusqu'en 2002, le MoDem au centre à partir de 2007, les écologistes dans « autres » avant 1997.

## Premier tour du scénario

1. Gauche divisée : la voix du candidat NFP de chaque circonscription est partagée entre LFI et le reste de la gauche. La part locale de LFI suit la part de Mélenchon parmi Mélenchon, Jadot, Roussel et Hidalgo à la présidentielle 2022, décalée en logit pour que la moyenne nationale (pondérée par les voix) vaille la part choisie (repères : 31 % aux européennes 2024, 72 % à la présidentielle 2022).
2. Élan du camp présidentiel : la part nationale du camp passe de S à S + b ; les voix du camp sont multipliées par (S + b) / S, celles des autres par (1 − S − b) / (1 − S), dans toutes les circonscriptions. Repères (ParlGov, camp du président à la législative suivante comparé à la précédente) : +12,1 (1981), +6,0 (1988), +8,7 (2002), +8,6 (2007), +7,2 (2012), +30,6 (2017, parti nouveau), −6,6 (2022).
3. Alliance de LR (avec le centre ou avec le RN) : les premiers candidats des deux partenaires sont fusionnés ; le plus fort garde la candidature, 85 % des voix du plus faible le suivent (hypothèse).

## Second tour

- Élu au premier tour : plus de 50 % des exprimés et au moins 25 % des inscrits.
- Qualifiés : les deux premiers et tout candidat à 12,5 % des inscrits.
- Retraits, quand le RN est parmi les deux premiers (taux observés en 2024 sur 311 circonscriptions à trois qualifiés ou plus) : PS-écologistes-PCF 99 %, LFI 92 %, centre 68 % face à LFI, 92 % face au reste de la gauche, LR 14 %, autres 90 %, RN 6 % quand il est troisième. Multipliés par l'intensité du barrage (0 à 100 %). Le calcul sans tirage parcourt toutes les combinaisons de retraits.
- Reports : les voix d'un candidat éliminé ou retiré vont aux candidats restants selon une matrice d'affinités a[bloc d'origine][bloc d'arrivée] (le reste s'abstient ; si la somme dépasse 1, elle est ramenée à 1). Deux matrices estimées par moindres carrés sur les parts de voix des vrais seconds tours : 500 en 2024, 569 en 2022 (diagonale fixée à 0,95 ; LFI ↔ reste de la gauche fixé à 0,85, faute de duel entre eux). L'intensité du barrage interpole entre la matrice de 2022 (0) et celle de 2024 (100).

## Fourchettes

120 tirages : écart local au mouvement national sur les voix du premier tour (log-normal de moyenne 1, écart-type 0,08 à 0,15 selon le bloc, la moitié ou moins de l'écart mesuré entre 2022 et 2024 (0,17 à 0,50), qui inclut les changements de candidats), erreur de 2,8 points sur les parts du second tour (erreur du calcul sur les vrais seconds tours), retraits tirés au sort. Fourchette à 80 % : quantiles 10 et 90 des tirages, recentrés sur le calcul sans tirage.

## Tests

| Contrôle | Calcul | Réel |
|---|---|---|
| 2024, réglages par défaut : gauche | 189 | 191 |
| centre | 167 | 165 |
| LR et divers droite | 66 | 66 |
| RN et alliés | 143 | 143 |
| bon vainqueur par circonscription | 546 / 577 | résultats officiels par circonscription, non inclus dans `parl_data.js` |
| 2022 avec les reports de 2022 : gauche, centre, LR, RN | 154, 247, 73, 92 | 153, 252, 71, 90 |
| 2022 avec les reports de 2024 | RN 6 | 90 |

Les deux matrices sont estimées sur les élections qu'elles rejouent : ce n'est pas un test hors échantillon. Le dernier contrôle montre au contraire que le comportement de second tour change beaucoup d'une élection à l'autre ; d'où le curseur. Contrefactuel : voix de 2024 avec les reports de 2022, RN et alliés environ 276 sièges.

## Limites

Participation identique à 2024 ; pas d'effet des sortants ni des personnalités ; une seule candidature par alliance partout ; la gauche divisée oppose LFI à un seul candidat ; les blocs ne sont pas les groupes parlementaires ; les candidats du NFP éliminés au premier tour dont le parti n'a pas été retrouvé (103) sont classés hors LFI ; le candidat fictif n'a pas de parti et n'est pas chiffré.
