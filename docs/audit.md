# Audit du coût des programmes complets

Lecture « Programme complet (audit) » du simulateur. Données : `src/audit_data.js` ; test : `tests/audit.js`. Mis à jour le 8 novembre 2026.

## Pourquoi

Les montants du simulateur sont ceux que chaque candidat chiffre, corrigés par des chiffrages indépendants. Les programmes contiennent aussi des mesures annoncées sans coût : jusqu'ici, elles étaient listées dans les fiches mais pas comptées (même règle pour tous). L'audit les chiffre.

## Grille, la même pour tous

- Mesures du programme publié ou des annonces du candidat dont l'effet peut dépasser ≈ 1 Md€ par an, absentes des montants retenus ; plus les compléments quand un chiffrage indépendant dépasse nettement le montant retenu (retraites).
- Coût annuel en fin de mandat, en euros de 2027 ; + = coût (dépense, baisse d'impôt), − = recette.
- Coûts unitaires tirés de sources publiques (Insee, Cour des comptes, HCAAM, Institut Montaigne, iFRAP) ; jamais du candidat lui-même ; aucun sondage.
- Mesure ambiguë : lecture centrale = la moins coûteuse des lectures plausibles (ou l'hypothèse déjà retenue), fourchette pour les autres.
- Rachats d'entreprises : comptés en dette (2028), pas en déficit ; dividendes et péages non comptés.
- Dans le simulateur : les mesures s'ajoutent aux mesures ménages (microsimulation) ou aux postes du budget, et l'effort annoncé baisse d'autant ; les recettes subissent la même décote de crédibilité que les autres.

## Synthèse

| Candidat | Mesures | Net (Md€ par an) | Fourchette | Hors déficit (dette) |
|---|---|---|---|---|
| Jean-Luc Mélenchon (LFI) | 17 | 166,8 | 93,2 à 271,0 | ≈ 85 Md€ (renationalisations) |
| Marine Le Pen (RN) | 10 | 36,5 | 11,7 à 74,2 | ≈ 35 Md€ (renationalisation des autoroutes) |
| Raphaël Glucksmann (PS-Place publique) | 2 | 7,0 | 3,5 à 14,0 | — |
| Gabriel Attal (Renaissance) | 4 | 3,6 | 1,6 à 7,7 | — |
| Édouard Philippe (Horizons) | 6 | 10,9 | −2,0 à 37,5 | — |
| Bruno Retailleau (LR) | 3 | 6,0 | 3,0 à 13,0 | — |
| Candidat IA (fictif) | 0 | 0 | — | — |

Le nombre de mesures dépend de la taille des programmes : le livre de LFI compte 1 069 mesures ; les autres programmes publiés, de quelques dizaines à une centaine.

## Effet dans le simulateur (lecture centrale, 200 tirages)

| Candidat | Crise avant 2032 / d'ici 2046 | Dette médiane 2036 | Pauvreté 2032 |
|---|---|---|---|
| Mélenchon | 39 / 95 % → 75 / 100 % | 166 → 176 % | 14,1 → 13,9 % |
| Le Pen | 30 / 88 % → 37 / 94 % | 162 → 169 % | 16,4 → 16,2 % |
| Philippe | 14 / 84 % → 16 / 85 % | 155 → 157 % | 18,2 → 18,1 % |
| Glucksmann | 24 / 94 % → 26 / 95 % | 168 → 168 % | 14,7 → 14,4 % |
| Retailleau | 14 / 84 % → 16 / 85 % | 156 → 156 % | 18,1 → 18,0 % |
| Attal | 13 / 85 % → 13 / 85 % | 156 → 156 % | 16,0 → 16,0 % |

Sans crise (calcul déterministe), le déficit 2030 de Mélenchon passe de 7,8 à 11,3 % du PIB et sa dette 2036 de 172 à 220 % : la dette médiane monte moins parce que la crise, plus précoce, impose ensuite l'austérité.

## Jean-Luc Mélenchon (LFI)

| Mesure | Central | Fourchette | Méthode | Sources |
|---|---|---|---|---|
| Garantie d'autonomie pour tous au seuil de pauvreté (1 337 € par mois pour une personne seule), au-delà des 9,5 Md€ comptés pour les jeunes | 15,0 | 8,0 à 35,0 | Écart total à combler : ≈ 20 à 26 Md€ (Insee, 2023 : 9,8 millions de pauvres, seuil de 1 288 € par mois, écart médian de 19,2 % ; ≈ 0,66 unité de consommation par personne), moins la part des jeunes déjà comptée et ce que l'AAH et les pensions au Smic couvrent déjà. Plus si l'aide est individualisée ou si elle décourage le travail juste au-dessus du seuil. | [L'Avenir en commun, édition 2027 (7 novembre 2026)](https://melenchon2027.fr/programme/livre/) ; [Insee – pauvreté monétaire en 2023](https://www.insee.fr/fr/statistiques/8612540) |
| Retraite à 60 ans avec 40 annuités : complément au montant compté (23 Md€) | 22,0 | 13,0 à 35,0 | Total retenu ≈ 45 Md€ : 36 Md€ pour le seul retour de 62 à 60 ans (Institut Montaigne, 2022), plus l'abrogation des 64 ans (8 à 14 Md€, 2027-2030). 58 Md€ avec les mesures d'accompagnement (Institut Montaigne, 2024) ; « en gros 50 » selon Éric Coquerel ; 20 à 41 Md€ selon l'iFRAP (2017). | [Institut Montaigne – retraite à 60 ans, programme Mélenchon 2022](https://www.institutmontaigne.org/presidentielle-2022/jean-luc-melenchon/retablir-la-retraite-a-60-ans-apres-40-ans-annees-de-cotisation/) ; [MoneyVox – abroger la réforme des retraites : combien ça coûte (12 juillet 2024)](https://www.moneyvox.fr/retraite/actualites/98707/abroger-la-reforme-des-retraites-et-le-depart-a-64-ans-combien-ca-coute) ; [iFRAP – retraite à 60 ans : entre 20 et 40 Md€ (2017)](https://www.ifrap.org/retraite/retraite-60-ans-entre-20-et-40-milliards-deuros-de-cout) |
| Pensions de carrière complète au niveau du Smic, fin de la décote | 16,0 | 12,0 à 25,0 | Minimum contributif au Smic de 1 600 € nets : 13,9 Md€ (Institut Montaigne, 2024), porté au Smic de 1 700 € ; la fin de la décote n'est pas chiffrée à part. | [L'Avenir en commun, édition 2027 (7 novembre 2026)](https://melenchon2027.fr/programme/livre/) ; [MoneyVox – abroger la réforme des retraites : combien ça coûte (12 juillet 2024)](https://www.moneyvox.fr/retraite/actualites/98707/abroger-la-reforme-des-retraites-et-le-depart-a-64-ans-combien-ca-coute) |
| « 100 % Sécu » : complémentaires santé intégrées à la Sécurité sociale, fin des franchises et des jours de carence | 24,0 | 19,0 à 30,0 | Scénario « Grande Sécu » du HCAAM : +19 Md€ de dépense publique (2021), ≈ 22 Md€ en 2027, plus ≈ 2 Md€ de franchises et participations. Les ménages ne paient plus de complémentaire ; le financement prévu (« cotisation sociale universelle ») n'est pas chiffré. | [L'Avenir en commun, édition 2027 (7 novembre 2026)](https://melenchon2027.fr/programme/livre/) ; [Que Choisir – le scénario « Grande Sécu » du HCAAM (janvier 2022)](https://www.quechoisir.org/actualite-couverture-des-soins-la-grande-secu-une-option-parmi-d-autres-n98431/) |
| Service citoyen obligatoire de neuf mois, payé au Smic, avant 25 ans | 25,0 | 15,0 à 30,0 | ≈ 800 000 jeunes par an × 9 mois × ≈ 2 800 € de coût employeur pour un Smic de 1 700 € nets ≈ 20 Md€, plus l'encadrement et l'hébergement. Repère : 3,5 à 5 Md€ par an pour un séjour de 12 jours généralisé (Cour des comptes, 2024). | [L'Avenir en commun, édition 2027 (7 novembre 2026)](https://melenchon2027.fr/programme/livre/) ; [Public Sénat – la Cour des comptes et le coût du SNU (13 septembre 2024)](https://www.publicsenat.fr/actualites/societe/risques-pour-la-securite-des-jeunes-cout-largement-sous-estime-la-cour-des-comptes-etrille-le-deploiement-du-snu) |
| Garantie d'emploi au Smic pour les chômeurs de longue durée | 6,0 | 3,0 à 11,0 | 671 000 chômeurs depuis plus d'un an (Insee, 2e trimestre 2026) ; 28 000 € par emploi (Territoires zéro chômeur, Cour des comptes, 2025), moins les allocations économisées ; un tiers à la moitié des chômeurs concernés. | [L'Avenir en commun, édition 2027 (7 novembre 2026)](https://melenchon2027.fr/programme/livre/) ; [Insee – chômage au 2e trimestre 2026](https://www.insee.fr/fr/statistiques/9032359) ; [Banque des territoires – Territoires zéro chômeur selon la Cour des comptes (20 juin 2025)](https://www.banquedesterritoires.fr/territoires-zero-chomeur-un-projet-innovant-mais-couteux-selon-la-cour-des-comptes) |
| Blocage des prix (alimentation, énergie, carburant) et première tranche gratuite d'énergie et d'eau | 12,0 | 5,0 à 25,0 | Blocage des prix des produits de première nécessité : 9 Md€ (Institut Montaigne, 2024) ; première tranche gratuite : ≈ 3 Md€ (hypothèse du simulateur, quantité non précisée) ; nettement plus si le pétrole reste cher. | [L'Avenir en commun, édition 2027 (7 novembre 2026)](https://melenchon2027.fr/programme/livre/) ; [Institut Montaigne – chiffrage du programme du NFP (législatives 2024)](https://www.institutmontaigne.org/legislatives-2024/nouveau-front-populaire/synthese) |
| Gratuité réelle de l'école (transports, fournitures, activités), au-delà de la cantine déjà comptée | 9,0 | 5,0 à 13,0 | Gratuité totale : 13 Md€ (Institut Montaigne, 2024), moins la cantine (3,6 Md€, contre-budget). | [L'Avenir en commun, édition 2027 (7 novembre 2026)](https://melenchon2027.fr/programme/livre/) ; [Institut Montaigne – chiffrage du programme du NFP (législatives 2024)](https://www.institutmontaigne.org/legislatives-2024/nouveau-front-populaire/synthese) |
| Classes sous la moyenne européenne de 19 élèves | 7,0 | 4,0 à 10,0 | Recrutements d'enseignants pour réduire les effectifs : 6,8 Md€ (Institut Montaigne, 2024). | [L'Avenir en commun, édition 2027 (7 novembre 2026)](https://melenchon2027.fr/programme/livre/) ; [Institut Montaigne – chiffrage du programme du NFP (législatives 2024)](https://www.institutmontaigne.org/legislatives-2024/nouveau-front-populaire/synthese) |
| Allocation aux adultes handicapés au niveau du Smic | 7,0 | 5,0 à 9,0 | 7,3 Md€ (Institut Montaigne, 2024). | [L'Avenir en commun, édition 2027 (7 novembre 2026)](https://melenchon2027.fr/programme/livre/) ; [Institut Montaigne – chiffrage du programme du NFP (législatives 2024)](https://www.institutmontaigne.org/legislatives-2024/nouveau-front-populaire/synthese) |
| Culture à 1 % du PIB, plan pour le sport | 15,0 | 10,0 à 20,0 | Culture à 1 % du PIB et sport à 1 % du budget : 20,2 Md€ (Institut Montaigne, 2024) ; le livre de 2027 ne chiffre que la culture. | [L'Avenir en commun, édition 2027 (7 novembre 2026)](https://melenchon2027.fr/programme/livre/) ; [Institut Montaigne – chiffrage du programme du NFP (législatives 2024)](https://www.institutmontaigne.org/legislatives-2024/nouveau-front-populaire/synthese) |
| Indexation des salaires publics sur l'inflation, au-delà du point d'indice +10 % compté | 8,0 | 4,0 à 12,0 | 10,5 Md€ par an (Institut Montaigne, 2024) ; dépend de l'inflation. | [L'Avenir en commun, édition 2027 (7 novembre 2026)](https://melenchon2027.fr/programme/livre/) ; [Institut Montaigne – chiffrage du programme du NFP (législatives 2024)](https://www.institutmontaigne.org/legislatives-2024/nouveau-front-populaire/synthese) |
| Plan logement et rénovation : part de l'État au-delà des montants comptés | 5,0 | 2,0 à 8,0 | 12 Md€ par an annoncés pour l'État (plan BTP et logement), dont ≈ 7 déjà comptés (rénovation) ; ≈ 36 Md€ par an via le pôle public bancaire, hors budget de l'État. | [LFI – plan BTP et logement](https://melenchon2027.fr/programme/plans-investissement/btp-logement/) |
| Sixième semaine de congés payés et 32 heures dans les métiers pénibles : remplacements dans le secteur public | 3,0 | 1,0 à 6,0 | Hypothèse du simulateur : ≈ 1 % de la masse salariale publique. | [L'Avenir en commun, édition 2027 (7 novembre 2026)](https://melenchon2027.fr/programme/livre/) |
| Soignants et EHPAD publics (10 000 places par an), au-delà des 3 Md€ comptés pour l'hôpital | 2,5 | 1,5 à 5,0 | Plan de recrutement du soin et du médico-social : 4,6 Md€ (Institut Montaigne, 2024). | [L'Avenir en commun, édition 2027 (7 novembre 2026)](https://melenchon2027.fr/programme/livre/) ; [Institut Montaigne – chiffrage du programme du NFP (législatives 2024)](https://www.institutmontaigne.org/legislatives-2024/nouveau-front-populaire/synthese) |
| Cotisations sociales sur les dividendes, l'intéressement et les rachats d'actions | −5,0 | −6,3 à −3,0 | 6,3 Md€ (Institut Montaigne, 2024), moins les comportements d'évitement. | [L'Avenir en commun, édition 2027 (7 novembre 2026)](https://melenchon2027.fr/programme/livre/) ; [Institut Montaigne – chiffrage du programme du NFP (législatives 2024)](https://www.institutmontaigne.org/legislatives-2024/nouveau-front-populaire/synthese) |
| Impôt sur le revenu à 14 tranches | −4,7 | −8,0 à 0,0 | 4,7 Md€ (Institut Montaigne, 2024). | [L'Avenir en commun, édition 2027 (7 novembre 2026)](https://melenchon2027.fr/programme/livre/) ; [Institut Montaigne – chiffrage du programme du NFP (législatives 2024)](https://www.institutmontaigne.org/legislatives-2024/nouveau-front-populaire/synthese) |
| **Total net** | **166,8** | 93,2 à 271,0 | | |

Hors déficit : Renationalisations : Engie, autoroutes, aéroports stratégiques, ≈ 85 Md€ de dette (60 à 110). Engie vaut ≈ 58 Md€ en bourse (septembre 2026), dont l'État détient une partie ; autoroutes : 45 à 50 Md€ selon Bercy (2021), moins à mesure que les concessions approchent de leur fin ; Aéroports de Paris : la part non détenue par l'État. Opération financière : la dette augmente, pas le déficit ; les dividendes reçus ne sont pas comptés. Sources : [L'Avenir en commun, édition 2027 (7 novembre 2026)](https://melenchon2027.fr/programme/livre/) ; [StockAnalysis – capitalisation d'Engie (18 septembre 2026)](https://stockanalysis.com/quote/epa/ENGI/market-cap/) ; [Public Sénat – renationaliser les autoroutes : à quel coût ? (septembre 2021)](https://www.publicsenat.fr/actualites/politique/montebourg-souhaite-renationaliser-les-autoroutes-mais-a-quel-cout-et-de-quelle).

## Marine Le Pen (RN)

| Mesure | Central | Fourchette | Méthode | Sources |
|---|---|---|---|---|
| Retraites (abrogation des 64 ans, 60 ans pour les carrières commencées avant 20 ans) : complément au montant compté (14 Md€) | 11,0 | 0,0 à 21,0 | 34,7 Md€ selon l'Institut Montaigne (2024) ; ≈ 10 Md€ pour la seule abrogation en 2027 selon l'iFRAP (2024), sans les départs à 60 ans. Retenu ≈ 25 Md€. | [Programme du RN, mesures économiques et de santé (recensées par votons-2027.fr)](https://votons-2027.fr/candidats/le-pen/programme/economie) ; [Institut Montaigne – chiffrage du programme du RN (législatives 2024)](https://www.institutmontaigne.org/legislatives-2024/rassemblement-national/synthese) ; [iFRAP – le vrai coût du programme du RN (juin 2024)](https://www.ifrap.org/budget-et-fiscalite/le-vrai-cout-du-programme-du-rassemblement-national) |
| TVA à 5,5 % sur l'énergie et les carburants : complément au montant compté (10 Md€) | 2,0 | 0,0 à 6,7 | 11,3 à 12 Md€ en année pleine (Institut Montaigne, 2024) ; 16,7 Md€ selon l'iFRAP (2024). | [Programme du RN, mesures économiques et de santé (recensées par votons-2027.fr)](https://votons-2027.fr/candidats/le-pen/programme/economie) ; [Institut Montaigne – chiffrage du programme du RN (législatives 2024)](https://www.institutmontaigne.org/legislatives-2024/rassemblement-national/synthese) ; [iFRAP – le vrai coût du programme du RN (juin 2024)](https://www.ifrap.org/budget-et-fiscalite/le-vrai-cout-du-programme-du-rassemblement-national) |
| TVA supprimée sur 100 produits de première nécessité | 5,0 | 0,0 à 7,0 | 6,7 Md€ (Institut Montaigne, 2024, en cas de forte inflation) ; 7 Md€ (iFRAP, 2024). | [Programme du RN, mesures économiques et de santé (recensées par votons-2027.fr)](https://votons-2027.fr/candidats/le-pen/programme/economie) ; [Institut Montaigne – chiffrage du programme du RN (législatives 2024)](https://www.institutmontaigne.org/legislatives-2024/rassemblement-national/synthese) ; [iFRAP – le vrai coût du programme du RN (juin 2024)](https://www.ifrap.org/budget-et-fiscalite/le-vrai-cout-du-programme-du-rassemblement-national) |
| Exonération d'impôt sur le revenu des moins de 30 ans : complément au montant compté (2 Md€) | 1,7 | 0,5 à 2,5 | 3,7 Md€ (Institut Montaigne, 2024). | [Programme du RN, mesures économiques et de santé (recensées par votons-2027.fr)](https://votons-2027.fr/candidats/le-pen/programme/economie) ; [Institut Montaigne – chiffrage du programme du RN (législatives 2024)](https://www.institutmontaigne.org/legislatives-2024/rassemblement-national/synthese) |
| Plan de soutien d'urgence pour la santé de 20 Md€ | 4,0 | 4,0 à 20,0 | Durée non annoncée : 4 Md€ par an s'il est étalé sur le mandat, 20 s'il est annuel. | [Programme du RN, santé (recensé par votons-2027.fr)](https://votons-2027.fr/candidats/le-pen/programme/sante) |
| Revalorisation des enseignants | 5,8 | 3,0 à 6,0 | 5,8 Md€ (Institut Montaigne, 2024). | [Programme du RN, mesures économiques et de santé (recensées par votons-2027.fr)](https://votons-2027.fr/candidats/le-pen/programme/economie) ; [Institut Montaigne – chiffrage du programme du RN (législatives 2024)](https://www.institutmontaigne.org/legislatives-2024/rassemblement-national/synthese) |
| Chèque formation de 200 à 300 € par mois pour les apprentis et alternants | 2,0 | 1,2 à 3,5 | Soutien à l'apprentissage : 1,2 Md€ (Institut Montaigne, 2024) ; davantage si le chèque va à tous les apprentis. | [Programme du RN, mesures économiques et de santé (recensées par votons-2027.fr)](https://votons-2027.fr/candidats/le-pen/programme/economie) ; [Institut Montaigne – chiffrage du programme du RN (législatives 2024)](https://www.institutmontaigne.org/legislatives-2024/rassemblement-national/synthese) |
| Donations exonérées jusqu'à 100 000 € tous les dix ans, hausses de salaires de 10 % sans cotisations, impôt sur les sociétés supprimé cinq ans pour les créateurs de moins de 30 ans | 2,5 | 1,5 à 3,5 | 1 + 0,8 + 0,7 Md€ (Institut Montaigne, 2024). | [Programme du RN, mesures économiques et de santé (recensées par votons-2027.fr)](https://votons-2027.fr/candidats/le-pen/programme/economie) ; [Institut Montaigne – chiffrage du programme du RN (législatives 2024)](https://www.institutmontaigne.org/legislatives-2024/rassemblement-national/synthese) |
| 100 000 logements sociaux par an, dont 20 000 pour les étudiants et jeunes travailleurs | 1,0 | 0,5 à 2,0 | Hypothèse du simulateur : aides publiques au-delà du rythme de construction actuel. | [Programme du RN, mesures économiques et de santé (recensées par votons-2027.fr)](https://votons-2027.fr/candidats/le-pen/programme/economie) |
| 85 000 places de prison | 1,5 | 1,0 à 2,0 | 1,5 Md€ (Institut Montaigne, 2024). | [Programme du RN, mesures économiques et de santé (recensées par votons-2027.fr)](https://votons-2027.fr/candidats/le-pen/programme/economie) ; [Institut Montaigne – chiffrage du programme du RN (législatives 2024)](https://www.institutmontaigne.org/legislatives-2024/rassemblement-national/synthese) |
| **Total net** | **36,5** | 11,7 à 74,2 | | |

Hors déficit : Renationalisation des autoroutes (péages −15 %), ≈ 35 Md€ de dette (25 à 50). 45 à 50 Md€ selon Bercy (2021), moins à mesure que les concessions approchent de leur fin. Opération financière : la dette augmente, pas le déficit ; péages et dividendes non comptés. Sources : [Programme du RN, mesures économiques et de santé (recensées par votons-2027.fr)](https://votons-2027.fr/candidats/le-pen/programme/economie) ; [Public Sénat – renationaliser les autoroutes : à quel coût ? (septembre 2021)](https://www.publicsenat.fr/actualites/politique/montebourg-souhaite-renationaliser-les-autoroutes-mais-a-quel-cout-et-de-quelle).

## Raphaël Glucksmann (PS-Place publique)

| Mesure | Central | Fourchette | Méthode | Sources |
|---|---|---|---|---|
| Garantie à l'emploi et CDI d'insertion | 6,0 | 3,0 à 11,0 | Même calcul que pour la garantie d'emploi de Mélenchon : 671 000 chômeurs de longue durée, 28 000 € par emploi, moins les allocations économisées. | [Programme de R. Glucksmann, économie (recensé par votons-2027.fr)](https://votons-2027.fr/candidats/glucksmann/programme/economie) ; [Insee – chômage au 2e trimestre 2026](https://www.insee.fr/fr/statistiques/9032359) ; [Banque des territoires – Territoires zéro chômeur selon la Cour des comptes (20 juin 2025)](https://www.banquedesterritoires.fr/territoires-zero-chomeur-un-projet-innovant-mais-couteux-selon-la-cour-des-comptes) |
| Fonds national foncier et logement | 1,0 | 0,5 à 3,0 | Montant non annoncé ; hypothèse du simulateur. | [Programme de R. Glucksmann, économie (recensé par votons-2027.fr)](https://votons-2027.fr/candidats/glucksmann/programme/economie) |
| **Total net** | **7,0** | 3,5 à 14,0 | | |

## Gabriel Attal (Renaissance)

| Mesure | Central | Fourchette | Méthode | Sources |
|---|---|---|---|---|
| Moins de 20 élèves par classe | 1,0 | 0,0 à 3,0 | Financé selon lui par la baisse du nombre d'élèves ; reste dépend du rythme (hypothèse du simulateur). | [Programme de G. Attal (recensé par votons-2027.fr)](https://votons-2027.fr/candidats/attal/programme) |
| Plan d'épargne retraite de 1 000 € ouvert par l'État à chaque enfant | 0,7 | 0,6 à 0,7 | ≈ 650 000 naissances par an. | [Programme de G. Attal, économie (recensé par votons-2027.fr)](https://votons-2027.fr/candidats/attal/programme/economie) |
| Rénovation thermique, leasing social, bonus pour les voitures électriques d'occasion | 1,0 | 0,5 à 2,0 | Montants non annoncés ; hypothèse du simulateur. | [Programme de G. Attal (recensé par votons-2027.fr)](https://votons-2027.fr/candidats/attal/programme) |
| Assistant médical et compagnon éducatif par IA, formation de 200 000 professionnels de la petite enfance | 1,0 | 0,5 à 2,0 | Montants non annoncés ; hypothèse du simulateur. | [Programme de G. Attal, économie (recensé par votons-2027.fr)](https://votons-2027.fr/candidats/attal/programme/economie) ; [Programme de G. Attal (recensé par votons-2027.fr)](https://votons-2027.fr/candidats/attal/programme) |
| **Total net** | **3,6** | 1,6 à 7,7 | | |

## Édouard Philippe (Horizons)

| Mesure | Central | Fourchette | Méthode | Sources |
|---|---|---|---|---|
| Allocation familiale unique de 350 € dès le premier enfant : coût au-delà de l'enveloppe actuelle | 0,0 | −8,0 à 18,0 | Par enfant ou par famille, mensuel ou non : pas précisé. Par enfant et par mois, ≈ 59 Md€ au lieu des 41 Md€ actuels. Lecture centrale : même enveloppe, comme déjà retenu. | [LCP – allocations familiales : Philippe propose 350 € dès le premier enfant (9 octobre 2026)](https://lcp.fr/actualites/allocations-familiales-edouard-philippe-propose-350-euros-des-le-premier-enfant-443576) ; [AFP via La Gazette – Philippe veut aider les familles dès le premier enfant et par une réduction d'impôt](https://www.lagazettefrance.fr/article/edouard-philippe-veut-aider-les-familles-des-le-premier-enfant-et-via-une-reduction-d-impot) |
| Réduction d'impôt d'environ 3 000 € pendant trois ans après une naissance (classes moyennes qui travaillent) | 2,5 | 1,5 à 4,0 | ≈ 650 000 naissances par an, trois années de suite, environ 60 % de foyers imposables, ≈ 2 000 € de réduction effective en moyenne (hypothèse du simulateur). | [AFP via La Gazette – Philippe veut aider les familles dès le premier enfant et par une réduction d'impôt](https://www.lagazettefrance.fr/article/edouard-philippe-veut-aider-les-familles-des-le-premier-enfant-et-via-une-reduction-d-impot) |
| Fonds d'adaptation au climat | 2,0 | 1,5 à 2,5 | 2 Md€ par an annoncés. | [Euronews – Philippe mise sur le travail et la réduction des dépenses (9 octobre 2026)](https://fr.euronews.com/2026/10/09/presidentielle-2027-edouard-philippe-mise-sur-le-travail-et-la-reduction-des-depenses-publ) |
| Revalorisation des professeurs | 2,4 | 1,0 à 6,0 | Montant non annoncé : même coût que la hausse de 200 € nets d'Attal (2,4 Md€). | [Programme d'É. Philippe (recensé par votons-2027.fr)](https://votons-2027.fr/candidats/philippe/programme) |
| Réservistes (de 45 000 à 250 000) et service militaire volontaire (de 3 000 à 50 000 places par an) | 2,0 | 1,0 à 3,0 | Hypothèse du simulateur. | [Programme d'É. Philippe (recensé par votons-2027.fr)](https://votons-2027.fr/candidats/philippe/programme) |
| Soutien scolaire universel, prêt à taux zéro à chaque naissance, temps partiel parental payé à 100 % pendant deux mois | 2,0 | 1,0 à 4,0 | Montants non annoncés ; hypothèse du simulateur. | [Programme d'É. Philippe, économie (recensé par votons-2027.fr)](https://votons-2027.fr/candidats/philippe/programme/economie) ; [Programme d'É. Philippe (recensé par votons-2027.fr)](https://votons-2027.fr/candidats/philippe/programme) ; [Euronews – Philippe mise sur le travail et la réduction des dépenses (9 octobre 2026)](https://fr.euronews.com/2026/10/09/presidentielle-2027-edouard-philippe-mise-sur-le-travail-et-la-reduction-des-depenses-publ) |
| **Total net** | **10,9** | −2,0 à 37,5 | | |

## Bruno Retailleau (LR)

| Mesure | Central | Fourchette | Méthode | Sources |
|---|---|---|---|---|
| Congé de naissance de six mois payé à 70 % | 2,0 | 1,0 à 5,0 | Le congé supplémentaire de un à deux mois voté en 2025 coûte ≈ 0,6 Md€ en régime de croisière ; six mois au total en ajoutent trois à quatre (hypothèse du simulateur). | [Programme de B. Retailleau, économie (recensé par votons-2027.fr)](https://votons-2027.fr/candidats/retailleau/programme/economie) ; [Public Sénat – le congé supplémentaire de naissance (14 novembre 2025)](https://www.publicsenat.fr/actualites/societe/duree-indemnites-date-dapplication-cout-pour-letat-ce-quil-faut-savoir-sur-le-nouveau-conge-supplementaire-de-naissance) |
| Déduction des intérêts d'emprunt immobilier pour les familles (50 à 100 % selon le nombre d'enfants) | 3,0 | 1,5 à 6,0 | Hypothèse du simulateur. | [Programme de B. Retailleau, économie (recensé par votons-2027.fr)](https://votons-2027.fr/candidats/retailleau/programme/economie) |
| Suramortissement de l'investissement industriel | 1,0 | 0,5 à 2,0 | Hypothèse du simulateur. | [Programme de B. Retailleau, économie (recensé par votons-2027.fr)](https://votons-2027.fr/candidats/retailleau/programme/economie) |
| **Total net** | **6,0** | 3,0 à 13,0 | | |

## Limites

- L'audit lit des programmes de tailles très différentes ; les mesures sans montant sont chiffrées par analogie (même coût unitaire pour la même mesure chez deux candidats, par exemple la garantie d'emploi).
- Plusieurs coûts unitaires viennent des chiffrages de l'Institut Montaigne pour les législatives de 2024, sur des mesures proches mais pas identiques ; ils sont datés et à revoir quand des chiffrages indépendants des programmes de 2027 paraîtront.
- Les mesures marquées « hypothèse du simulateur » n'ont pas de chiffrage public : leur fourchette est large.
- Les effets de comportement (travail, évasion) ne sont comptés que par les mécanismes généraux du simulateur.
- Un programme écrit appliqué en entier est un cas limite : en moyenne, environ la moitié des promesses électorales sont tenues.
