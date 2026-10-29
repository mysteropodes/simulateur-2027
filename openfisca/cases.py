"""Cas types de ménages calculés avec OpenFisca-France (législation 2026, montants mensuels).

Usage : pip install openfisca-france && python3 cases.py
Écrit cases.json et affiche la ligne CASES à recopier dans src/ui.part.
"""
import json
from openfisca_france import FranceTaxBenefitSystem
from openfisca_core.simulation_builder import SimulationBuilder

tbs = FranceTaxBenefitSystem()
MONTHS = [f"{y}-{m:02d}" for y in (2024, 2025, 2026) for m in range(1, 13)]
SMIC = 12.02 * 151.67  # Smic brut mensuel 2026 (OpenFisca)
CSG_CRDS = 0.097       # heures supplémentaires sans cotisations : seules CSG et CRDS restent dues


def mo(v):
    return {m: v for m in MONTHS}


def make(adults, kids=0, loyer=None, divid=0, f2op=False):
    """adults : liste de dict(brut=…, public=False, pension=0, age=40)."""
    ind = {}
    for i, a in enumerate(adults):
        p = {"date_naissance": {"ETERNITY": f"{2026 - a.get('age', 40)}-01-01"}}
        if a.get("brut"):
            if a.get("public"):
                p["categorie_salarie"] = mo("public_titulaire_territoriale")
                p["traitement_indiciaire_brut"] = mo(a["brut"])
            else:
                p["salaire_de_base"] = mo(a["brut"])
        if a.get("pension"):
            p["retraite_brute"] = mo(a["pension"])
        ind[f"a{i}"] = p
    for k in range(kids):
        ind[f"e{k}"] = {"date_naissance": {"ETERNITY": "2016-06-01" if k else "2019-06-01"}}
    par = [f"a{i}" for i in range(len(adults))]
    enf = [f"e{k}" for k in range(kids)]
    men = {"personne_de_reference": ["a0"], "enfants": enf}
    if len(par) > 1:
        men["conjoint"] = ["a1"]
    if loyer:
        men.update({"loyer": mo(loyer), "statut_occupation_logement": mo("locataire_vide"), "zone_apl": mo("zone_2")})
    else:
        men["statut_occupation_logement"] = mo("proprietaire")
    foy = {"declarants": par, "personnes_a_charge": enf}
    if divid and not f2op:
        foy["revenus_capitaux_prelevement_forfaitaire_unique_ir"] = mo(divid / 12)
    if divid and f2op:
        foy["f2ts"] = {"2026": divid}
        foy["f2op"] = {"2026": True}
    return {"individus": ind, "familles": {"f": {"parents": par, "enfants": enf}},
            "foyers_fiscaux": {"foy": foy}, "menages": {"m": men}}


OUT = ["revenu_disponible", "salaire_net", "retraite_nette", "ppa", "aide_logement", "rsa", "af", "aspa",
       "impot_revenu_restant_a_payer"]


def run(case):
    sim = SimulationBuilder().build_from_entities(tbs, case)
    return {v: float(sim.calculate_add(v, "2026").sum()) / 12 for v in OUT}


def net_of(a):
    return run(make([dict(a, pension=0)]))["salaire_net"]


def brut_for_net(a, target):
    """Brut qui donne le salaire net visé (même statut)."""
    b = a["brut"]
    for _ in range(5):
        b *= target / net_of(dict(a, brut=b))
    return b


CASES = {
    "c1": ("Personne seule au Smic, locataire", dict(adults=[dict(brut=SMIC)], loyer=550)),
    "c2": ("Parent seul, un enfant, Smic à mi-temps, locataire", dict(adults=[dict(brut=SMIC / 2, age=34)], kids=1, loyer=600)),
    "c3": ("Couple, deux enfants, Smic et 1,5 Smic, locataire", dict(adults=[dict(brut=SMIC), dict(brut=1.5 * SMIC)], kids=2, loyer=800)),
    "c4": ("Jeune de 27 ans seul, 3 200 € brut, locataire", dict(adults=[dict(brut=3200, age=27)], loyer=700)),
    "c5": ("Couple de cadres, 6 000 € brut chacun, 30 000 € de dividendes, propriétaires", dict(adults=[dict(brut=6000), dict(brut=6000)], divid=30000)),
    "c6": ("Fonctionnaire territorial de catégorie C en début de carrière, seul, locataire", dict(adults=[dict(brut=SMIC, public=True, age=38)], loyer=550)),
    "c7": ("Retraitée seule, 72 ans, pension de 1 200 € brut, locataire", dict(adults=[dict(pension=1200, age=72)], loyer=500)),
    "c8": ("Couple de retraités, pensions de 2 800 € et 2 200 € brut, propriétaires", dict(adults=[dict(pension=2800, age=70), dict(pension=2200, age=68)])),
}

res = {}
for k, (label, kw) in CASES.items():
    base = run(make(**kw))
    workers = [a for a in kw["adults"] if a.get("brut")]
    r = {"id": k, "label": label, "rd": base["revenu_disponible"], "act": base["salaire_net"] + base["retraite_nette"],
         "ir": -base["impot_revenu_restant_a_payer"], "ppa": base["ppa"], "al": base["aide_logement"],
         "autres": base["rsa"] + base["af"] + base["aspa"],
         "smic": None, "smicNet": None, "apl": None, "flat": None, "csg": None, "csgNet": None, "rn30": None,
         "lr": None, "lrH": None, "lrCut": None}
    # Mélenchon : Smic à 1 700 € net (salariés au Smic, temps plein ou partiel ; minimum de traitement aligné dans le public)
    if k in ("c1", "c2", "c3", "c6"):
        a0 = kw["adults"][0]
        share = a0["brut"] / SMIC
        if net_of(a0) >= 1700 * share:  # déjà au-dessus de 1 700 € net : pas concerné
            share = None
    if k in ("c1", "c2", "c3", "c6") and share:
        nb = brut_for_net(a0, 1700 * share)
        adults = [dict(a0, brut=nb)] + kw["adults"][1:]
        s = run(make(**dict(kw, adults=adults)))
        r["smic"] = s["revenu_disponible"] - base["revenu_disponible"]
        r["smicNet"] = s["salaire_net"] - base["salaire_net"]
    # Mélenchon : APL +10 %
    if base["aide_logement"] > 0:
        r["apl"] = 0.1 * base["aide_logement"]
    # Mélenchon : fin de la flat tax (dividendes au barème)
    if kw.get("divid"):
        r["flat"] = run(make(**dict(kw, f2op=True)))["revenu_disponible"] - base["revenu_disponible"]
    # PS : CSG progressive sur les revenus d'activité, de 0,55 % au Smic à 9,2 % à 2 700 € net (équivalent temps plein)
    if workers and k != "c5":
        smicnet = net_of(dict(brut=SMIC))
        adults, gain_tot = [], 0
        for a in kw["adults"]:
            if not a.get("brut"):
                adults.append(a); continue
            n = net_of(a)
            x = n * SMIC / a["brut"] if a["brut"] < SMIC else n
            rate = 9.2 if x >= 2700 else 0.55 + (9.2 - 0.55) * max(0, x - smicnet) / (2700 - smicnet)
            gain = a["brut"] * 0.9825 * (9.2 - rate) / 100
            gain_tot += gain
            adults.append(dict(a, brut=brut_for_net(a, n + gain)))
        s = run(make(**dict(kw, adults=adults)))
        r["csg"] = s["revenu_disponible"] - base["revenu_disponible"]
        r["csgNet"] = gain_tot
    # Le Pen : pas d'impôt sur le revenu avant 30 ans
    if k == "c4":
        r["rn30"] = -base["impot_revenu_restant_a_payer"] if base["impot_revenu_restant_a_payer"] < 0 else 0
    # Retailleau : RSA + prime d'activité −30 %, 16 heures de plus par an payées sans cotisations
    if workers:
        r["lrCut"] = -0.3 * (base["ppa"] + base["rsa"])
        r["lrH"] = sum(a["brut"] / 151.67 * 16 * (1 - CSG_CRDS) / 12 for a in workers)
        r["lr"] = r["lrCut"] + r["lrH"]
    res[k] = {kk: (round(v) if isinstance(v, float) else v) for kk, v in r.items()}

json.dump(list(res.values()), open("cases.json", "w"), ensure_ascii=False, indent=1)
print("const CASES=" + json.dumps(list(res.values()), ensure_ascii=False) + ";")
