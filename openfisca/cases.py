import json
from openfisca_france import FranceTaxBenefitSystem
from openfisca_core.simulation_builder import SimulationBuilder
tbs=FranceTaxBenefitSystem()
MONTHS=[f"{y}-{m:02d}" for y in (2024,2025,2026) for m in range(1,13)]
def mo(v): return {m:v for m in MONTHS}
def run(case, out_vars):
    sim=SimulationBuilder().build_from_entities(tbs, case)
    return {v:float(sim.calculate_add(v,"2026").sum()) if tbs.variables[v].definition_period!="year" else float(sim.calculate(v,"2026").sum()) for v in out_vars}
def make(adults, kids=0, loyer=None, divid=0, f2op=False, ages=None):
    ind={}; ages=ages or [40]*len(adults)
    for i,(brut,ret) in enumerate(adults):
        ind[f"a{i}"]={"salaire_de_base":mo(brut),"date_naissance":{"ETERNITY":f"{2026-ages[i]}-01-01"}}
        if ret: ind[f"a{i}"]["retraite_brute"]=mo(ret)
    for k in range(kids): ind[f"e{k}"]={"date_naissance":{"ETERNITY":"2019-06-01"}}
    par=[f"a{i}" for i in range(len(adults))]; enf=[f"e{k}" for k in range(kids)]
    men={"personne_de_reference":["a0"],"enfants":enf}
    if len(par)>1: men["conjoint"]=["a1"]
    if loyer: men.update({"loyer":mo(loyer),"statut_occupation_logement":mo("locataire_vide"),"zone_apl":mo("zone_2")})
    else: men.update({"statut_occupation_logement":mo("proprietaire")})
    foy={"declarants":par,"personnes_a_charge":enf}
    if divid: foy["revenus_capitaux_prelevement_forfaitaire_unique_ir"]=mo(divid/12)
    if f2op:
        foy.pop("revenus_capitaux_prelevement_forfaitaire_unique_ir",None); foy["f2ts"]={"2026":divid}; foy["f2op"]={"2026":True}
    return {"individus":ind,"familles":{"f":{"parents":par,"enfants":enf}},"foyers_fiscaux":{"foy":foy},"menages":{"m":men}}
OUT=["revenu_disponible","salaire_net","ppa","aide_logement","impot_revenu_restant_a_payer","rsa","af"]
SMIC=12.02*151.67  # Smic brut mensuel 2026 (OpenFisca)
cases={
 "c1":("Personne seule au Smic, locataire",dict(adults=[(SMIC,0)],loyer=550)),
 "c2":("Parent seul, un enfant, Smic à mi-temps, locataire",dict(adults=[(SMIC/2,0)],kids=1,loyer=600)),
 "c3":("Couple, deux enfants, Smic et 1,5 Smic, locataire",dict(adults=[(SMIC,0),(1.5*SMIC,0)],kids=2,loyer=800)),
 "c4":("Jeune de 27 ans seul, 3 200 € brut, locataire",dict(adults=[(3200,0)],loyer=700,ages=[27])),
 "c5":("Couple de cadres, 6 000 € brut chacun, 30 000 € de dividendes, propriétaires",dict(adults=[(6000,0),(6000,0)],divid=30000)),
}
res={}
for k,(lab,kw) in cases.items():
    base=run(make(**kw),OUT)
    netm=base["salaire_net"]/12
    r={"label":lab,"base":base}
    # LFI : Smic à 1 700 € net (salaires au Smic relevés)
    if k in("c1","c2","c3"):
        adults=list(kw["adults"]); a0=adults[0][0]
        # net du premier adulte seul
        n0=run(make(adults=[(a0,0)]),["salaire_net"])["salaire_net"]/12
        target=1700*(a0/SMIC)  # mi-temps : moitié
        f=1.0
        for _ in range(4):
            n=run(make(adults=[(a0*f,0)]),["salaire_net"])["salaire_net"]/12; f*=target/n
        adults[0]=(a0*f,0); kw2=dict(kw,adults=adults)
        s=run(make(**kw2),OUT); r["smic1700"]=s; r["smic_net_gain"]=(s["salaire_net"]-base["salaire_net"])/12
    # LFI : APL +10 %
    if kw.get("loyer"): r["apl10"]=0.1*base["aide_logement"]/12
    # PS : CSG progressive (0,55 % au Smic → 9,2 % à 2 700 € net), effet simulé par la hausse du net équivalente
    if k in("c1","c2","c3","c4"):
        adults=list(kw["adults"]); new=[]; gain_tot=0
        for (b,ret) in adults:
            n=run(make(adults=[(b,0)]),["salaire_net"])["salaire_net"]/12
            fulltime_n=n*(SMIC/b) if b<SMIC else n
            nm=n if b>=SMIC else n*SMIC/b
            smicnet=run(make(adults=[(SMIC,0)]),["salaire_net"])["salaire_net"]/12
            # taux selon le salaire net équivalent temps plein
            x=n*(SMIC/b) if b<SMIC else n
            rate=9.2 if x>=2700 else 0.55+(9.2-0.55)*max(0,x-smicnet)/(2700-smicnet)
            assiette=b*0.9825
            gain=assiette*(9.2-rate)/100
            gain_tot+=gain; new.append((b+gain/0.78,ret))
        s=run(make(**dict(kw,adults=new)),OUT); r["csg"]=s; r["csg_net_gain"]=gain_tot
    # RN : exonération d'impôt sur le revenu des moins de 30 ans
    if k=="c4": r["rn30"]=-base["impot_revenu_restant_a_payer"]/12
    # LFI : suppression de la flat tax (dividendes au barème)
    if kw.get("divid"):
        s=run(make(**dict(kw,f2op=True)),OUT); r["flat"]=s
    res[k]=r
json.dump(res,open("cases.json","w"),ensure_ascii=False,indent=1)
for k,r in res.items():
    b=r["base"]; print(k,r["label"],"RD/mois",round(b["revenu_disponible"]/12),"net",round(b["salaire_net"]/12),"ppa",round(b["ppa"]/12),"AL",round(b["aide_logement"]/12),"IR",round(b["impot_revenu_restant_a_payer"]/12))
    if "smic1700" in r: print("  Smic1700: gain net salaire",round(r["smic_net_gain"]),"gain RD",round((r["smic1700"]["revenu_disponible"]-b["revenu_disponible"])/12))
    if "csg" in r: print("  CSG: gain net",round(r["csg_net_gain"]),"gain RD",round((r["csg"]["revenu_disponible"]-b["revenu_disponible"])/12))
    if "apl10" in r: print("  APL+10%",round(r["apl10"]))
    if "rn30" in r: print("  RN -30 ans IR",round(r["rn30"]))
    if "flat" in r: print("  flat->bareme",round((r["flat"]["revenu_disponible"]-b["revenu_disponible"])/12))
