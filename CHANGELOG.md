# Journal des modifications

Chaque changement du modèle ou d'un chiffrage est daté ici et visible dans l'onglet « Informations » du simulateur. Le détail ligne par ligne est dans l'[historique des commits](https://github.com/mysteropodes/simulateur-2027/commits/main).

## 29 octobre 2026

- **Multiplicateurs par type de mesure.** Le multiplicateur unique (0,7) est remplacé par des multiplicateurs propres à chaque type de mesure et au temps écoulé (1-2 ans, 5 ans, 10 ans), d'après la synthèse publiée par [Déchiffrer 2027](https://dechiffrer2027.fr/en/methode) (Mésange, OFCE, HCFP, FMI, Commission européenne). Chaque programme est découpé par type de mesure ; la répartition s'affiche dans chaque fiche candidat.
  - Conséquence : les programmes qui réduisent fortement les dépenses de fonctionnement (Retailleau, Philippe, Le Pen) freinent davantage l'activité, avec une dette 2032 plus élevée de 1,5 à 6,5 points selon la lecture en mode « chiffrage crédible » (davantage en mode « tel qu'annoncé ») ; ceux qui financent leurs dépenses par des impôts sur les plus aisés (Mélenchon, Glucksmann) la freinent un peu moins, avec une dette 2032 plus basse de 1 à 2 points. Pour Retailleau et Philippe, la part sociale de leurs économies est reprise de leur plan.
- **Séquelles durables des récessions (hystérésis)** : 5 % de l'activité perdue chaque année sous le potentiel ne revient pas en lecture centrale (10 % keynésienne, 0 libérale).
- **Trois ménages types de plus** (fonctionnaire de catégorie C, retraitée modeste, couple de retraités aisés) et détail du revenu disponible de chaque ménage. Le script OpenFisca est reproductible (`openfisca/cases.py`).
- **Origine de chaque mesure** (programme, document du parti, déclaration) et du montant (candidat, institut, estimation du simulateur), date de dernière revue par candidat.
- **Contester un chiffrage** via les Issues GitHub.
- **Lien de partage** d'un scénario (tous les réglages sont dans l'adresse).

## Fin octobre 2026

- Conjoncture 2026-2027 calée sur les prévisions officielles, trajectoire du gouvernement, colonnes alignées sur les hypothèses de France Budget, zone grisée après 2032.
- Le Pen : abrogation des 64 ans avec départ entre 60 et 62 ans (meeting d'Orléans, 25 octobre 2026).
- Mélenchon : retraite à 60 ans avec 40 annuités (2 octobre 2026).
