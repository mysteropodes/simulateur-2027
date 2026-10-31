# Simulateur 2027

Simulation pédagogique des programmes de la présidentielle 2027. Elle couvre la dette, la croissance, l'emploi, les inégalités, les retraites, le logement, les services publics et le climat, avec des sources Insee et les chiffrages d'instituts.

**Voir le simulateur :** https://mysteropodes.github.io/simulateur-2027/

Candidats comparés : Jean-Luc Mélenchon (LFI), Marine Le Pen (RN), Édouard Philippe (Horizons), Raphaël Glucksmann (PS-Place publique), Bruno Retailleau (LR) et Gabriel Attal (Renaissance). Les autres candidats déclarés n'ont pas encore publié de chiffrage global. Un statu quo (aucune mesure nouvelle) sert de référence.

C'est un outil de comparaison, pas une prévision : les mêmes règles s'appliquent à tous les programmes, et chaque hypothèse est réglable.

## Ce que fait la page

- **Trajectoires 2026-2046** : dette, déficit, charge d'intérêts, accès au financement, croissance, chômage, inflation, pauvreté, inégalités, pouvoir d'achat par catégorie, retraites, logement, services publics, émissions, énergie, tension sociale, etc.
- **Trois modes d'application** : « tel qu'annoncé », « si élu, chiffrage crédible » (par défaut) et « pondéré par la faisabilité ».
- **Quatre lectures économiques** : keynésienne (proche de l'OFCE), centrale, libérale (proche de l'iFRAP) et « fondée sur l'historique ».
- **Fiches candidats** : mesures, origine de chaque mesure et de son montant, trois niveaux de chiffrage, critiques et réponses de leurs défenseurs (« L'autre point de vue »).
- **Fourchettes d'incertitude** (200 tirages), explication de chaque cassure de courbe, cas types OpenFisca, recoupements avec les prévisions officielles et France Budget, lien de partage qui garde tous les réglages.


Une huitième trajectoire, **« Candidat IA (fictif) »**, est construite par le simulateur lui-même : parmi 21 500 combinaisons tirées d'un menu de 33 mesures et leviers (26 repris des programmes réels, 7 recommandés par des institutions indépendantes et absents des programmes : solidarité à la source, niches fiscales défavorables au climat, aides à l'apprentissage, crédit d'impôt recherche, petite enfance, accompagnement des demandeurs d'emploi, allègements de cotisations), celle qui fait le mieux possible sur neuf indicateurs à la fois sous des contraintes de faisabilité (financée, chaque mesure majoritaire dans les sondages ou comptée à 50 % faute de sondage, tension sociale sous 60, pas de crise avant le statu quo). Elle n'est pas la meilleure partout, et elle reflète les hypothèses du modèle autant que la réalité : la Méthode détaille sa construction et ses limites. Elle est exclue des conclusions robustes et du classement des chiffrages.

L'onglet « Test sur le passé » rejoue les programmes de Hollande 2012, Macron 2017 et Macron 2022 avec les mêmes règles, depuis la situation de l'année précédant l'élection, et compare à la réalité (Insee) : à l'aveugle (ce que le simulateur aurait prédit le jour de l'élection) et avec les chocs réels imposés (crise de la zone euro, Covid, énergie). Écart moyen en fin de période : dette 5 points à l'aveugle (surtout le Covid), 2,4 avec le contexte ; déficit 1,6 et 0,6 point ; chômage 0,7 et 0,6 point. Deux réserves : l'écart de production de départ (`gap0`) et le chômage structurel de l'époque sont des hypothèses fixées après coup, qui pèsent de 4 à 6 points de dette ; et le choc « épidémie » du simulateur a été recalé sur 2020-2021, si bien que l'épisode 2017-2022 « avec contexte » n'est plus une validation indépendante. Chaque lecture donne aussi un repère « sans programme » (même point de départ, mêmes chocs, A = 0) : en 2012-2017, le programme décoté rapproche le simulateur du réel (dette 102 % contre 104 sans programme, réel 98,7) ; en 2017-2022, il l'en éloigne (109,6 contre 110,6, réel 111,4) ; en 2022-2025, il ne change presque rien. Autrement dit, le test valide surtout la mécanique de base (point de départ, taux, croissance, chocs) ; la lecture des programmes n'y ajoute une information nette que sur un mandat sur trois.

La section « Conséquences concrètes » traduit la tension sociale et les crises en effets lisibles : années de tension forte (au-dessus de 60 sur 100), part du programme abandonnée sous la pression, activité perdue (0,01 % de PIB par point au-dessus de 60, ordre de grandeur des gilets jaunes), et pour une crise de financement, pic de chômage, pic de pauvreté et économies imposées.

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
   - **Recettes et économies annoncées** : multipliées par la note de crédibilité du chiffrage, fixée par une règle commune : c = 0,3 + 0,7 × d, où d est la part de ces montants que Déchiffrer 2027 a pu chiffrer de façon indépendante. Les montants non documentés sont donc retenus à 30 %, comme les économies non détaillées chez le CPB. Pour les programmes construits sur une cible de déficit, le dénominateur est le montant annuel d'économies impliqué par la cible (écart de déficit plus baisses d'impôts), les montants annoncés étant cumulés ou incomplets. Notes : Mélenchon 0,71, Retailleau 0,48, Philippe 0,39, Le Pen 0,38, Attal 0,35, Glucksmann 0,3.
   - **Impôts visant les 10 % les plus aisés** (capital, patrimoines, héritages, part de l'impôt sur le revenu payée par eux) : réduits par les « recettes perdues » au lieu de la crédibilité. Elles valent 40 % en lecture centrale, 15 % keynésienne, 60 % libérale, 54 % historique (CAE 2025 ; CPB : 50 % pour les taux supérieurs de l'impôt sur le revenu).
   - **Dépenses et baisses d'impôts** : comptées en entier. Un programme moins crédible a donc toujours un déficit plus élevé.
   - **Chiffrage indépendant** : quand il estime les dépenses au-dessus de l'annonce, il est retenu hors du mode « tel qu'annoncé ». Exemple : Mélenchon, 111 Md€ selon Déchiffrer 2027 au lieu de 81,7.
   - **Opérations financières** (placement de réserves, capitalisation) : elles ne réduisent pas le déficit au sens européen (SEC 2010) et ne sont pas comptées.
3. **Effet final sur le déficit**, avec les effets sur l'activité, le chômage et les intérêts, par rapport au statu quo.

Chaque fiche candidat affiche ces trois niveaux. En lecture centrale, l'effort retenu à pleine application est :

| Programme | Effort retenu (pt de PIB) |
|---|---|
| Le Pen | +0,3 |
| Retailleau | −0,1 |
| Philippe | −0,3 |
| Attal | −0,9 |
| Glucksmann | −1,9 |
| Mélenchon | −1,9 |

Ces efforts ne comprennent pas la loi de programmation militaire (0,55 pt de PIB d'ici 2030, appliquée à tous) : elle est comptée à part pour les programmes construits sur un solde (Mélenchon, Glucksmann, Le Pen) et à l'intérieur de la cible pour ceux construits sur une cible de déficit (Philippe, Retailleau, Attal), qui doivent donc trouver les économies correspondantes.

L'effort annoncé suit une règle commune : le solde net publié par le candidat, en milliards de l'année visée (2027 pour un contre-budget annuel) ; à défaut, ou si sa lecture est incertaine, l'écart entre le déficit de 2026 (5,4 %) et la cible du candidat (Philippe 2 %, Retailleau 2,2 %, Attal 2,7 % sur la route de l'équilibre en dix ans). Repère, avec les seules lignes chiffrées par Déchiffrer 2027, qui ne couvrent qu'une partie des programmes : Mélenchon ≈ −60 Md€, Le Pen ≈ −38, Retailleau ≈ −7, Philippe ≈ +13.

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
- **Éviction.** La dette ajoutée par un programme évince une partie de l'investissement privé (CBO) : 0,02 % de PIB par point de dette en lecture centrale (capital d'environ trois ans de PIB, part du capital 0,35, économie ouverte).
- **Séquelles des récessions** (hystérésis) : 5 % de l'écart de production en lecture centrale.
- **Énergie.** Trois scénarios pétroliers (EIA, AIE, The Shift Project). Le prix du pétrole agit sur le PIB et l'inflation (Insee). La dépendance aux énergies fossiles suit le rythme de décarbonation de chaque programme, et une partie des importations évitées devient de la production en France.

- **Population active.** Elle ralentit puis baisse après 2040 (Insee, projections 2022) : la croissance potentielle passe de 1 % à environ 0,7 % après 2040, comme chez le COR et la Commission.
- **Intempéries.** Leur coût budgétaire (catastrophes naturelles, calamités agricoles, réparations) part de 0,13 % du PIB en 2025 et double d'ici 2050 (France Assureurs, I4CE), selon le scénario de réchauffement et l'adaptation.

### 4. Emploi, prix, salaires

- **Chômage.** Retour vers un chômage structurel de 7,4 % à 20 % par an, loi d'Okun 0,3, activité partielle en cas d'épidémie. Le tout est recalé sur 2015-2025.
- **Hausse du Smic.** Les emplois au Smic (17 % des salariés) baissent avec le coût du travail net des allègements : environ 18 000 emplois par point de Smic en lecture centrale, dans la fourchette de 15 000 à 25 000 des études françaises.
- **Chômage structurel et budget.** Quand un programme change le chômage structurel (assurance chômage, Smic), le PIB perd 0,5 % par point de chômage en plus et le déficit augmente de 0,2 point. La règle vaut dans les deux sens : durcir l'assurance chômage le baisse (Philippe, Retailleau), revenir sur les réformes de 2019-2023 le monte (Mélenchon).
- **Inflation.** 2 % à long terme (convention de la Commission), courbe de Phillips de pente 0,15 à partir de 2029, chocs pétroliers.

### 5. Finances publiques et dette

- **Solde public.** Il part du déficit hors intérêts de 2025 (Insee). S'y ajoutent l'effort du programme, les stabilisateurs automatiques (0,6), la loi de programmation militaire et la moitié de l'engagement OTAN (sauf pour le programme qui le rejette). À partir de 2030 s'ajoutent aussi le vieillissement (santé et dépendance : +0,8 pt de PIB en 2046) et la dégradation des retraites du COR.
- **Pauvreté.** Chaque point de pauvreté en plus ou en moins change les dépenses de santé, d'éducation et de justice de 1,35 Md€ en lecture centrale (Collectif Alerte, 2024 ; nul en lecture libérale).
- **Charge d'intérêts.** Environ 9 % de la dette est renouvelée chaque année au taux de marché, plus la dette nouvelle qui finance le déficit. 10 % des titres sont indexés sur l'inflation.
- **Taux de marché.** Il est égal à un taux sans risque (1,5 % réel plus 2 % d'inflation, soit environ 3,5 %, le niveau du taux allemand à 10 ans en octobre 2026), plus une prime de risque. La prime augmente avec :
  - le déficit au-delà de 3 % (corrigé de l'inflation) ;
  - la dette au-delà de 120 % ;
  - la charge d'intérêts rapportée aux recettes (dégradations de note progressives) ;
  - la prime d'instabilité politique actuelle, qui se résorbe après l'élection ;
  - un éventuel conflit avec l'Union européenne, plein pendant le mandat puis qui s'estompe.
- **Calage 2026-2028.** Il suit la Banque de France (septembre 2026), mise à jour avec les chiffres de l'Insee du 30 octobre 2026 (PIB du 3e trimestre −0,1 %, acquis de croissance 0,2 % pour 2026, inflation d'octobre 3,4 %, 3,8 % en indice harmonisé). Retenu : croissance 0,3 % en 2026, 0,8 % en 2027, 1,1 % en 2028 ; inflation 2,6 %, 2,3 %, 1,8 % ; chômage 8,3 % (Insee, 2e trimestre 2026). Repères obtenus : dette fin 2026 de 118,9 % (119,3 % dans le projet de loi de finances), 2027 de 121,4 % (121,7 %), 2030 de 131 % (comité d'experts : 130 %) ; intérêts 2027 de 98 Md€ (91 annoncés par le gouvernement, avec une inflation plus basse que celle d'octobre).
- **Crise de financement.** C'est une règle du modèle : quand la prime dépasse 3 points (réglable), il y a deux issues.
  - **Filet de la BCE (TPI).** La BCE plafonne la prime, à condition que le déficit soit ramené à 4 % au plus et sans conflit avec l'Union européenne. Elle retire ce filet si le déficit dérive de nouveau.
  - **Sinon, une crise.** Prêts officiels proches du taux sans risque (prime plafonnée à 1 point, comme les prêts du MES) contre 1,5 pt de PIB d'économies par an tant que le déficit dépasse 3 %. Le programme dure cinq ans au moins ; s'il n'a pas ramené le déficit sous 4 %, il est prolongé jusqu'à dix ans (Grèce) ; s'il y parvient, le pays devient éligible aux achats de la BCE (OMT), qui plafonnent la prime (Irlande, Portugal). Après la sortie, la prime revient en cinq ans vers celle du marché ; une rechute reste possible. S'y ajoutent une récession, une désinflation, un soutien aux banques de 3 % du PIB et des séquelles. Comme au Portugal, en Espagne, en Irlande et en Grèce en 2010-2014, la dette monte d'abord, de 18 à 22 points de plus que sans crise sur trois ans (récession d'environ 5 % sur trois ans, chômage +2,5 à +3 points ; les créanciers font annuler 25 puis 50 % des mesures favorables aux ménages, rétablies en cinq ans après la sortie). Ensuite, les économies ne sont gardées que pour tenir le déficit sous 3 %.
  - **Variante « refus du programme »**, réglable : contrôle des capitaux, financement national à taux plafonné et inflation.
- **Après 2031.** Les gouvernements suivants corrigent une partie du déficit selon la dette (règle de réaction : 0,04 pt par point de dette, 4 pts au plus). Ces économies passent par le même mécanisme que les mesures des programmes (multiplicateur des dépenses de fonctionnement, effets durables compris) ; seul l'ajustement imposé en crise garde un traitement à part (multiplicateur de 1,5 et séquelles).
- **BCE.** Le taux sans risque réagit à l'inflation commune de la zone euro (0,25 point par point), pas aux mesures françaises.
- **Chocs.** Les fourchettes tirent jusqu'à deux chocs sur vingt ans (récession, crise financière, inflation, intempéries, pétrole, guerre commerciale, guerre en Europe), et une rechute reste possible après un programme.
- **Déficit par administration.** État, Sécurité sociale et collectivités (Insee 2025), avant compensations entre elles. Les économies demandées aux collectivités portent en partie sur l'investissement local.
- **Lire la dette après une crise.** Une crise impose des économies, ce qui fausse la comparaison des dettes après coup. Le tableau affiche donc aussi la dette 2046 « sans crise ».

### 6. Revenus, pauvreté, inégalités

- **Microsimulation simplifiée.** Chaque mesure en milliards est répartie entre les déciles par une clé d'incidence (Insee, Drees, IPP), puis rapportée au revenu de chaque décile. Les gains des ménages sont comptés en entier, leurs pertes réduites comme les économies. Le taux de non-recours et la diffusion sont résumés par une efficacité de 0,85.
- **Économies sociales non détaillées.** Même clé pour tous les programmes, construite sur la structure des prestations : 45 % retraites, 35 % santé (par personne), 20 % minima et famille (Drees) ; la part « minima » est tirée entre 10 et 35 % dans les fourchettes d'incertitude. Les économies désignées par le candidat (allocation sociale unique, assurance chômage, arrêts maladie, âge de départ) gardent leur propre clé. Pour le reste des économies non détaillées, la moitié retombe sur les ménages avec cette même clé, l'autre moitié sur les services publics.
- **Pauvreté et Gini.** Ils sont calculés à partir des revenus par décile (Insee 2024 : pauvreté 15,4 %, Gini 0,302). Ils tiennent compte du chômage et d'un éventuel ajustement imposé.
- **Pouvoir d'achat par catégorie.** Il est exprimé par rapport au statu quo.
- **Cas types.** Huit ménages types sont calculés avec OpenFisca France (dossier `openfisca/`).

- **Logement.** Prix et loyers réels réagissent aux taux (−7 % par point de taux immobilier) et à la construction ; la hausse des loyers réduit le pouvoir d'achat des modestes et des jeunes, selon la part de locataires.
- **Héritages.** Flux d'héritages et donations (≈ 10 % du PIB, en hausse ; CAE) et droits de succession, avec les mesures des programmes.
- **Solde extérieur courant.** Importations liées à la demande, facture énergétique et coût du travail (Banque de France 2025 : −0,4 % du PIB) ; indicateur sans effet en retour sur la croissance, déjà compris dans les multiplicateurs.

### 7. Indicateurs plus fragiles

- **Tension sociale.** C'est un indice 0-100 qui monte avec le chômage, la pauvreté, l'inflation, les réformes impopulaires appliquées, les mesures touchant aux droits (grille qualitative) et les crises. Les « réformes impopulaires » sont mesurées par l'ampleur des pertes imposées (économies et hausses d'impôts avant décote, impôts sur les plus aisés comptés pour moitié), par l'adhésion de l'opinion et par la crédibilité. Au-delà de 60, le gouvernement recule progressivement sur une partie des pertes qu'il impose (économies, hausses d'impôts), jusqu'à 40 % quand la tension atteint 80 ; les dépenses engagées restent (1995, 2006, 2018). Il revient en arrière quand la tension retombe. Les poids de l'indice sont des hypothèses.
- **Santé (mois d'espérance de vie), décès liés à la chaleur, logement, émissions.** Ce sont des ordres de grandeur sourcés dans la page. Ils indiquent un sens et une taille, pas une prévision.

### 8. Incertitude

- **200 tirages communs à tous les candidats.** Ils font varier la croissance, les taux, l'inflation, les multiplicateurs et séquelles, la réaction des marchés, le seuil de crise, le filet de la BCE, les recettes perdues, l'emploi des seniors, l'effet du Smic, le climat, l'IA, le pétrole, un choc éventuel et la crédibilité des programmes.
- **Résultats.** La page affiche des fourchettes et la part des tirages où survient une crise.
- **Au-delà de 2032**, les courbes sont grisées : ce sont des tendances, pas des prévisions.

### 9. Validation

- **Test 2015-2025** (`tests/backtest.js`). Il couvre le chômage (erreur moyenne de 0,6 point), le taux apparent de la dette (0,10 point) et l'identité de la dette (0,5 point hors 2020). Ces mécanismes ont aussi été réglés sur cette période : ce n'est pas une validation indépendante.
- **Test des effets des mesures sur la croissance** (`tests/backtest-growth.js`, consolidation 2010-2016). Erreur moyenne de 0,50 point en lecture centrale et de 0,41 en lecture libérale, contre 0,42 en supposant les mesures sans effet. Un seul épisode, mêlé à la crise de la zone euro, ne permet pas de trancher.
- **Test de non-régression** (`tests/regression.js`) : 26 contrôles automatiques. Les repères de calage sont des contrôles de stabilité (ils détectent une dérive involontaire), pas une validation externe : la dette 2036 du statu quo (≈ 163 %) est au-dessus de la fourchette de la Commission européenne (144-156, calculée avec les taux de 2024), parce que le modèle intègre l'écart de taux observé fin 2026 (1,7 point), la loi de programmation militaire et l'engagement OTAN. Il vérifie les repères de calage, les efforts publiés, les conclusions robustes de l'analyse de sensibilité et les règles de méthode : une crédibilité plus basse ne réduit jamais la dette, plus de recettes perdues ne l'améliore jamais, plus d'inflation baisse le ratio de dette, une crise fait d'abord monter la dette.
- **Analyse de sensibilité** (1 500 tirages sur 65 hypothèses). Conclusions solides (recalculées le 31 octobre 2026 sur 400 tirages comprenant le poids des droits et la clé des économies sociales) : Mélenchon a la pauvreté la plus basse (77 % ; 86 % avant le réalisme des crises et les nouveaux tirages) et la crise la plus précoce (91 %) ; Retailleau la pauvreté la plus haute (71 %) ; Retailleau ou Le Pen la tension sociale la plus forte (98 %) ; Philippe la dette hors crise la plus basse (58 % en 2046, 48 % en 2036, devant Attal). Conclusions fragiles : qui a la dette la plus haute ; le chômage, trop proche entre programmes pour les classer. Hypothèses décisives : seuil de crise, réaction des marchés, prime politique de 2027, crédibilité, recettes perdues, multiplicateurs.
- **Audits.** Plusieurs audits indépendants du code et de la méthode ont été menés (octobre 2026). Leurs corrections sont datées dans l'onglet « Informations » et dans [CHANGELOG.md](CHANGELOG.md).

## Limites à garder en tête

- **Modèle simplifié.** Ce n'est pas un modèle complet de l'économie : le commerce extérieur n'est qu'un indicateur, il n'y a ni taux de change ni secteurs, et la BCE ne réagit pas à la France seule. Les comparaisons entre programmes sont plus fiables que les niveaux.
- **La crise de la dette est une règle du modèle, pas une prévision.** Elle dépend surtout de la lecture économique : en lecture centrale, tous les programmes la franchissent entre 2035 et 2039, en lecture keynésienne aucun. Le filet de la BCE ne se déclenche presque jamais, car les déficits dépassent 4 % quand la prime franchit le seuil.
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
tests/regression.js       test de non-régression : chiffres publiés et règles de méthode
```

## Modifier et reconstruire

```sh
python3 build.py            # régénère index.html (vérifie la syntaxe JS si node est installé)
npm i -D playwright && npx playwright install chromium
node tests/smoke.js         # vérifie que la page charge et que chaque candidat donne une trajectoire finie
node tests/backtest.js      # test historique 2015-2025
node tests/backtest-growth.js
node tests/regression.js    # 24 contrôles, échoue si un chiffre publié ou une règle n'est plus respecté
```

La page ne dépend que de Chart.js (cdnjs) et de polices Google Fonts. Elle s'ouvre directement dans un navigateur.

## Sources principales

- **Statistiques publiques** : Insee, Drees, Banque de France, Cour des comptes, HCFP, Conseil d'orientation des retraites, Citepa, Santé publique France.
- **Institutions et instituts** : Commission européenne, FMI, CBO, OBR, CPB, CAE, OFCE, IPP, I4CE, iFRAP, Institut de l'Entreprise, France Budget, Déchiffrer 2027.
- **Partis** : programmes et contre-budgets publiés, avec les analyses juridiques et les sondages cités dans la page.

La liste complète, avec les liens, figure dans la section « Sources » du simulateur.
