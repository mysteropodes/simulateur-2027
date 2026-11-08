// Audit du coût des programmes complets : mesures annoncées par les candidats mais absentes des montants retenus par le simulateur,
// et compléments quand un chiffrage indépendant dépasse nettement le montant retenu. Même grille pour tous (8 novembre 2026).
// Montants en Md€ par an, en régime de croisière (fin de mandat), en euros de 2027 : [libellé, central, bas, haut, clé ménages, catégorie, sources, méthode].
// Positif = coût (dépense ou baisse d'impôt), négatif = recette. Clé ménages : effet sur le revenu des ménages (microsimulation) ;
// sans clé, la catégorie du budget (fonct, inv, log, entr, taxLarge). debt : opération financière (rachats d'entreprises), qui augmente la dette sans creuser le déficit.
// Règle : mesures du programme publié ou des annonces du candidat dont l'effet peut dépasser ≈ 1 Md€ par an. Quand une mesure est ambiguë, la lecture centrale
// est la moins coûteuse des lectures plausibles (ou l'hypothèse déjà retenue), et la fourchette couvre les autres. Aucun sondage, aucune source partisane pour les coûts.
const AUDIT_SRC={
 lfi_livre:["L'Avenir en commun, édition 2027 (7 novembre 2026)","https://melenchon2027.fr/programme/livre/"],
 lfi_btp:["LFI – plan BTP et logement","https://melenchon2027.fr/programme/plans-investissement/btp-logement/"],
 insee_pauv:["Insee – pauvreté monétaire en 2023","https://www.insee.fr/fr/statistiques/8612540"],
 mont_nfp:["Institut Montaigne – chiffrage du programme du NFP (législatives 2024)","https://www.institutmontaigne.org/legislatives-2024/nouveau-front-populaire/synthese"],
 mont_rn:["Institut Montaigne – chiffrage du programme du RN (législatives 2024)","https://www.institutmontaigne.org/legislatives-2024/rassemblement-national/synthese"],
 mont_ret22:["Institut Montaigne – retraite à 60 ans, programme Mélenchon 2022","https://www.institutmontaigne.org/presidentielle-2022/jean-luc-melenchon/retablir-la-retraite-a-60-ans-apres-40-ans-annees-de-cotisation/"],
 mv_ret:["MoneyVox – abroger la réforme des retraites : combien ça coûte (12 juillet 2024)","https://www.moneyvox.fr/retraite/actualites/98707/abroger-la-reforme-des-retraites-et-le-depart-a-64-ans-combien-ca-coute"],
 ifrap_ret:["iFRAP – retraite à 60 ans : entre 20 et 40 Md€ (2017)","https://www.ifrap.org/retraite/retraite-60-ans-entre-20-et-40-milliards-deuros-de-cout"],
 ifrap_rn:["iFRAP – le vrai coût du programme du RN (juin 2024)","https://www.ifrap.org/budget-et-fiscalite/le-vrai-cout-du-programme-du-rassemblement-national"],
 hcaam:["Que Choisir – le scénario « Grande Sécu » du HCAAM (janvier 2022)","https://www.quechoisir.org/actualite-couverture-des-soins-la-grande-secu-une-option-parmi-d-autres-n98431/"],
 snu:["Public Sénat – la Cour des comptes et le coût du SNU (13 septembre 2024)","https://www.publicsenat.fr/actualites/societe/risques-pour-la-securite-des-jeunes-cout-largement-sous-estime-la-cour-des-comptes-etrille-le-deploiement-du-snu"],
 tzcld:["Banque des territoires – Territoires zéro chômeur selon la Cour des comptes (20 juin 2025)","https://www.banquedesterritoires.fr/territoires-zero-chomeur-un-projet-innovant-mais-couteux-selon-la-cour-des-comptes"],
 insee_chom:["Insee – chômage au 2e trimestre 2026","https://www.insee.fr/fr/statistiques/9032359"],
 engie:["StockAnalysis – capitalisation d'Engie (18 septembre 2026)","https://stockanalysis.com/quote/epa/ENGI/market-cap/"],
 autoroutes:["Public Sénat – renationaliser les autoroutes : à quel coût ? (septembre 2021)","https://www.publicsenat.fr/actualites/politique/montebourg-souhaite-renationaliser-les-autoroutes-mais-a-quel-cout-et-de-quelle"],
 rn_prog:["Programme du RN, mesures économiques et de santé (recensées par votons-2027.fr)","https://votons-2027.fr/candidats/le-pen/programme/economie"],
 rn_sante:["Programme du RN, santé (recensé par votons-2027.fr)","https://votons-2027.fr/candidats/le-pen/programme/sante"],
 gl_prog:["Programme de R. Glucksmann, économie (recensé par votons-2027.fr)","https://votons-2027.fr/candidats/glucksmann/programme/economie"],
 at_prog:["Programme de G. Attal, économie (recensé par votons-2027.fr)","https://votons-2027.fr/candidats/attal/programme/economie"],
 at_prog2:["Programme de G. Attal (recensé par votons-2027.fr)","https://votons-2027.fr/candidats/attal/programme"],
 ph_prog:["Programme d'É. Philippe, économie (recensé par votons-2027.fr)","https://votons-2027.fr/candidats/philippe/programme/economie"],
 ph_prog2:["Programme d'É. Philippe (recensé par votons-2027.fr)","https://votons-2027.fr/candidats/philippe/programme"],
 ph_lcp:["LCP – allocations familiales : Philippe propose 350 € dès le premier enfant (9 octobre 2026)","https://lcp.fr/actualites/allocations-familiales-edouard-philippe-propose-350-euros-des-le-premier-enfant-443576"],
 ph_afp:["AFP via La Gazette – Philippe veut aider les familles dès le premier enfant et par une réduction d'impôt","https://www.lagazettefrance.fr/article/edouard-philippe-veut-aider-les-familles-des-le-premier-enfant-et-via-une-reduction-d-impot"],
 ph_euronews:["Euronews – Philippe mise sur le travail et la réduction des dépenses (9 octobre 2026)","https://fr.euronews.com/2026/10/09/presidentielle-2027-edouard-philippe-mise-sur-le-travail-et-la-reduction-des-depenses-publ"],
 re_prog:["Programme de B. Retailleau, économie (recensé par votons-2027.fr)","https://votons-2027.fr/candidats/retailleau/programme/economie"],
 conge:["Public Sénat – le congé supplémentaire de naissance (14 novembre 2025)","https://www.publicsenat.fr/actualites/societe/duree-indemnites-date-dapplication-cout-pour-letat-ce-quil-faut-savoir-sur-le-nouveau-conge-supplementaire-de-naissance"]
};
const AUDIT={
 melenchon:{items:[
  ["Garantie d'autonomie pour tous au seuil de pauvreté (1 337 € par mois pour une personne seule), au-delà des 9,5 Md€ comptés pour les jeunes",15,8,35,"minima",null,["lfi_livre","insee_pauv"],"Écart total à combler : ≈ 20 à 26 Md€ (Insee, 2023 : 9,8 millions de pauvres, seuil de 1 288 € par mois, écart médian de 19,2 % ; ≈ 0,66 unité de consommation par personne), moins la part des jeunes déjà comptée et ce que l'AAH et les pensions au Smic couvrent déjà. Plus si l'aide est individualisée ou si elle décourage le travail juste au-dessus du seuil."],
  ["Retraite à 60 ans avec 40 annuités : complément au montant compté (23 Md€)",22,13,35,"retraites",null,["mont_ret22","mv_ret","ifrap_ret"],"Total retenu ≈ 45 Md€ : 36 Md€ pour le seul retour de 62 à 60 ans (Institut Montaigne, 2022), plus l'abrogation des 64 ans (8 à 14 Md€, 2027-2030). 58 Md€ avec les mesures d'accompagnement (Institut Montaigne, 2024) ; « en gros 50 » selon Éric Coquerel ; 20 à 41 Md€ selon l'iFRAP (2017)."],
  ["Pensions de carrière complète au niveau du Smic, fin de la décote",16,12,25,"retraites",null,["lfi_livre","mv_ret"],"Minimum contributif au Smic de 1 600 € nets : 13,9 Md€ (Institut Montaigne, 2024), porté au Smic de 1 700 € ; la fin de la décote n'est pas chiffrée à part."],
  ["« 100 % Sécu » : complémentaires santé intégrées à la Sécurité sociale, fin des franchises et des jours de carence",24,19,30,"tete",null,["lfi_livre","hcaam"],"Scénario « Grande Sécu » du HCAAM : +19 Md€ de dépense publique (2021), ≈ 22 Md€ en 2027, plus ≈ 2 Md€ de franchises et participations. Les ménages ne paient plus de complémentaire ; le financement prévu (« cotisation sociale universelle ») n'est pas chiffré."],
  ["Service citoyen obligatoire de neuf mois, payé au Smic, avant 25 ans",25,15,30,"jeunes",null,["lfi_livre","snu"],"≈ 800 000 jeunes par an × 9 mois × ≈ 2 800 € de coût employeur pour un Smic de 1 700 € nets ≈ 20 Md€, plus l'encadrement et l'hébergement. Repère : 3,5 à 5 Md€ par an pour un séjour de 12 jours généralisé (Cour des comptes, 2024)."],
  ["Garantie d'emploi au Smic pour les chômeurs de longue durée",6,3,11,"chomage",null,["lfi_livre","insee_chom","tzcld"],"671 000 chômeurs depuis plus d'un an (Insee, 2e trimestre 2026) ; 28 000 € par emploi (Territoires zéro chômeur, Cour des comptes, 2025), moins les allocations économisées ; un tiers à la moitié des chômeurs concernés."],
  ["Blocage des prix (alimentation, énergie, carburant) et première tranche gratuite d'énergie et d'eau",12,5,25,"conso",null,["lfi_livre","mont_nfp"],"Blocage des prix des produits de première nécessité : 9 Md€ (Institut Montaigne, 2024) ; première tranche gratuite : ≈ 3 Md€ (hypothèse du simulateur, quantité non précisée) ; nettement plus si le pétrole reste cher."],
  ["Gratuité réelle de l'école (transports, fournitures, activités), au-delà de la cantine déjà comptée",9,5,13,"tete",null,["lfi_livre","mont_nfp"],"Gratuité totale : 13 Md€ (Institut Montaigne, 2024), moins la cantine (3,6 Md€, contre-budget)."],
  ["Classes sous la moyenne européenne de 19 élèves",7,4,10,"fonction",null,["lfi_livre","mont_nfp"],"Recrutements d'enseignants pour réduire les effectifs : 6,8 Md€ (Institut Montaigne, 2024)."],
  ["Allocation aux adultes handicapés au niveau du Smic",7,5,9,"minima",null,["lfi_livre","mont_nfp"],"7,3 Md€ (Institut Montaigne, 2024)."],
  ["Culture à 1 % du PIB, plan pour le sport",15,10,20,null,"fonct",["lfi_livre","mont_nfp"],"Culture à 1 % du PIB et sport à 1 % du budget : 20,2 Md€ (Institut Montaigne, 2024) ; le livre de 2027 ne chiffre que la culture."],
  ["Indexation des salaires publics sur l'inflation, au-delà du point d'indice +10 % compté",8,4,12,"fonction",null,["lfi_livre","mont_nfp"],"10,5 Md€ par an (Institut Montaigne, 2024) ; dépend de l'inflation."],
  ["Plan logement et rénovation : part de l'État au-delà des montants comptés",5,2,8,null,"log",["lfi_btp"],"12 Md€ par an annoncés pour l'État (plan BTP et logement), dont ≈ 7 déjà comptés (rénovation) ; ≈ 36 Md€ par an via le pôle public bancaire, hors budget de l'État."],
  ["Sixième semaine de congés payés et 32 heures dans les métiers pénibles : remplacements dans le secteur public",3,1,6,"fonction",null,["lfi_livre"],"Hypothèse du simulateur : ≈ 1 % de la masse salariale publique."],
  ["Soignants et EHPAD publics (10 000 places par an), au-delà des 3 Md€ comptés pour l'hôpital",2.5,1.5,5,null,"fonct",["lfi_livre","mont_nfp"],"Plan de recrutement du soin et du médico-social : 4,6 Md€ (Institut Montaigne, 2024)."],
  ["Cotisations sociales sur les dividendes, l'intéressement et les rachats d'actions",-5,-6.3,-3,"capital",null,["lfi_livre","mont_nfp"],"6,3 Md€ (Institut Montaigne, 2024), moins les comportements d'évitement."],
  ["Impôt sur le revenu à 14 tranches",-4.7,-8,0,"ir",null,["lfi_livre","mont_nfp"],"4,7 Md€ (Institut Montaigne, 2024)."]],
  debt:["Renationalisations : Engie, autoroutes, aéroports stratégiques",85,60,110,["lfi_livre","engie","autoroutes"],"Engie vaut ≈ 58 Md€ en bourse (septembre 2026), dont l'État détient une partie ; autoroutes : 45 à 50 Md€ selon Bercy (2021), moins à mesure que les concessions approchent de leur fin ; Aéroports de Paris : la part non détenue par l'État. Opération financière : la dette augmente, pas le déficit ; les dividendes reçus ne sont pas comptés."]},
 lepen:{items:[
  ["Retraites (abrogation des 64 ans, 60 ans pour les carrières commencées avant 20 ans) : complément au montant compté (14 Md€)",11,0,21,"retraites",null,["rn_prog","mont_rn","ifrap_rn"],"34,7 Md€ selon l'Institut Montaigne (2024) ; ≈ 10 Md€ pour la seule abrogation en 2027 selon l'iFRAP (2024), sans les départs à 60 ans. Retenu ≈ 25 Md€."],
  ["TVA à 5,5 % sur l'énergie et les carburants : complément au montant compté (10 Md€)",2,0,6.7,"conso",null,["rn_prog","mont_rn","ifrap_rn"],"11,3 à 12 Md€ en année pleine (Institut Montaigne, 2024) ; 16,7 Md€ selon l'iFRAP (2024)."],
  ["TVA supprimée sur 100 produits de première nécessité",5,0,7,"conso",null,["rn_prog","mont_rn","ifrap_rn"],"6,7 Md€ (Institut Montaigne, 2024, en cas de forte inflation) ; 7 Md€ (iFRAP, 2024)."],
  ["Exonération d'impôt sur le revenu des moins de 30 ans : complément au montant compté (2 Md€)",1.7,0.5,2.5,"jeunes","taxLarge",["rn_prog","mont_rn"],"3,7 Md€ (Institut Montaigne, 2024)."],
  ["Plan de soutien d'urgence pour la santé de 20 Md€",4,4,20,null,"fonct",["rn_sante"],"Durée non annoncée : 4 Md€ par an s'il est étalé sur le mandat, 20 s'il est annuel."],
  ["Revalorisation des enseignants",5.8,3,6,"fonction",null,["rn_prog","mont_rn"],"5,8 Md€ (Institut Montaigne, 2024)."],
  ["Chèque formation de 200 à 300 € par mois pour les apprentis et alternants",2,1.2,3.5,"jeunes",null,["rn_prog","mont_rn"],"Soutien à l'apprentissage : 1,2 Md€ (Institut Montaigne, 2024) ; davantage si le chèque va à tous les apprentis."],
  ["Donations exonérées jusqu'à 100 000 € tous les dix ans, hausses de salaires de 10 % sans cotisations, impôt sur les sociétés supprimé cinq ans pour les créateurs de moins de 30 ans",2.5,1.5,3.5,null,"taxLarge",["rn_prog","mont_rn"],"1 + 0,8 + 0,7 Md€ (Institut Montaigne, 2024)."],
  ["100 000 logements sociaux par an, dont 20 000 pour les étudiants et jeunes travailleurs",1,0.5,2,null,"log",["rn_prog"],"Hypothèse du simulateur : aides publiques au-delà du rythme de construction actuel."],
  ["85 000 places de prison",1.5,1,2,null,"fonct",["rn_prog","mont_rn"],"1,5 Md€ (Institut Montaigne, 2024)."]],
  debt:["Renationalisation des autoroutes (péages −15 %)",35,25,50,["rn_prog","autoroutes"],"45 à 50 Md€ selon Bercy (2021), moins à mesure que les concessions approchent de leur fin. Opération financière : la dette augmente, pas le déficit ; péages et dividendes non comptés."]},
 glucksmann:{items:[
  ["Garantie à l'emploi et CDI d'insertion",6,3,11,"chomage",null,["gl_prog","insee_chom","tzcld"],"Même calcul que pour la garantie d'emploi de Mélenchon : 671 000 chômeurs de longue durée, 28 000 € par emploi, moins les allocations économisées."],
  ["Fonds national foncier et logement",1,0.5,3,null,"log",["gl_prog"],"Montant non annoncé ; hypothèse du simulateur."]]},
 attal:{items:[
  ["Moins de 20 élèves par classe",1,0,3,"fonction",null,["at_prog2"],"Financé selon lui par la baisse du nombre d'élèves ; reste dépend du rythme (hypothèse du simulateur)."],
  ["Plan d'épargne retraite de 1 000 € ouvert par l'État à chaque enfant",0.65,0.6,0.7,"tete",null,["at_prog"],"≈ 650 000 naissances par an."],
  ["Rénovation thermique, leasing social, bonus pour les voitures électriques d'occasion",1,0.5,2,null,"inv",["at_prog2"],"Montants non annoncés ; hypothèse du simulateur."],
  ["Assistant médical et compagnon éducatif par IA, formation de 200 000 professionnels de la petite enfance",1,0.5,2,null,"fonct",["at_prog","at_prog2"],"Montants non annoncés ; hypothèse du simulateur."]]},
 philippe:{items:[
  ["Allocation familiale unique de 350 € dès le premier enfant : coût au-delà de l'enveloppe actuelle",0,-8,18,"tete",null,["ph_lcp","ph_afp"],"Par enfant ou par famille, mensuel ou non : pas précisé. Par enfant et par mois, ≈ 59 Md€ au lieu des 41 Md€ actuels. Lecture centrale : même enveloppe, comme déjà retenu."],
  ["Réduction d'impôt d'environ 3 000 € pendant trois ans après une naissance (classes moyennes qui travaillent)",2.5,1.5,4,"tete","taxLarge",["ph_afp"],"≈ 650 000 naissances par an, trois années de suite, environ 60 % de foyers imposables, ≈ 2 000 € de réduction effective en moyenne (hypothèse du simulateur)."],
  ["Fonds d'adaptation au climat",2,1.5,2.5,null,"inv",["ph_euronews"],"2 Md€ par an annoncés."],
  ["Revalorisation des professeurs",2.4,1,6,"fonction",null,["ph_prog2"],"Montant non annoncé : même coût que la hausse de 200 € nets d'Attal (2,4 Md€)."],
  ["Réservistes (de 45 000 à 250 000) et service militaire volontaire (de 3 000 à 50 000 places par an)",2,1,3,null,"fonct",["ph_prog2"],"Hypothèse du simulateur."],
  ["Soutien scolaire universel, prêt à taux zéro à chaque naissance, temps partiel parental payé à 100 % pendant deux mois",2,1,4,"tete",null,["ph_prog","ph_prog2","ph_euronews"],"Montants non annoncés ; hypothèse du simulateur."]]},
 retailleau:{items:[
  ["Congé de naissance de six mois payé à 70 %",2,1,5,"tete",null,["re_prog","conge"],"Le congé supplémentaire de un à deux mois voté en 2025 coûte ≈ 0,6 Md€ en régime de croisière ; six mois au total en ajoutent trois à quatre (hypothèse du simulateur)."],
  ["Déduction des intérêts d'emprunt immobilier pour les familles (50 à 100 % selon le nombre d'enfants)",3,1.5,6,"tete","taxLarge",["re_prog"],"Hypothèse du simulateur."],
  ["Suramortissement de l'investissement industriel",1,0.5,2,null,"entr",["re_prog"],"Hypothèse du simulateur."]]}
};
function auditNet(id,i){const a=(typeof AUDIT!=="undefined")?AUDIT[id]:null; if(!a) return 0; return a.items.reduce((s,x)=>s+x[i||1],0);}
