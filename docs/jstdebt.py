# Sensibilité de l'écart de taux à la dette : réestimation et tests de robustesse (base Jordà-Schularick-Taylor R6).
# Usage : python3 jstdebt.py chemin/JSTdatasetR6.xlsx
import sys, numpy as np, pandas as pd, statsmodels.formula.api as smf
df=pd.read_excel(sys.argv[1])
de=df[df.iso=="DEU"].set_index("year").ltrate
PAYS=["BEL","ESP","FIN","FRA","IRL","ITA","NLD","PRT"]
x=df[df.iso.isin(PAYS)].copy().sort_values(["iso","year"])
x["spread"]=x.ltrate-x.year.map(de)
x["debt"]=x.debtgdp*(100 if x.debtgdp.max()<5 else 1)
x["defi"]=(x.expenditure-x.revenue)/x.gdp*100
g=x.groupby("iso")
x["dl"]=g.debt.shift(1); x["fl"]=g.defi.shift(1)
x=x[(x.year>=1999)&(x.year<=2020)].dropna(subset=["spread","dl","fl"])
def fit(s,thr=100,fe=False,lab=""):
    s=s.copy(); s["dx"]=np.maximum(0,s.dl-thr)/10; s["fx"]=np.maximum(0,s.fl-3)
    f="spread ~ dx + fx"+(" + C(iso)" if fe else "")
    m=smf.ols(f,s).fit(cov_type="cluster",cov_kwds={"groups":s.iso})
    print(f"{lab:46s} n={len(s):3d}  dette {m.params.dx:5.2f} (±{m.bse.dx:4.2f})  déficit {m.params.fx:5.2f} (±{m.bse.fx:4.2f})  R2 {m.rsquared:4.2f}")
    return m
nc=x[~x.year.between(2010,2013)]
print("déficit lu dans JST (dépenses − recettes de l'État central) ; écarts-types groupés par pays\n")
fit(nc,lab="référence : hors 2010-2013, seuil 100")
fit(x,lab="toute la période")
for thr in (80,90,110,120): fit(nc,thr,lab=f"hors crise, seuil {thr}")
fit(nc,fe=True,lab="hors crise, effets fixes pays")
fit(nc[nc.year<=2007],lab="1999-2007 seulement")
fit(nc[nc.year>=2014],lab="2014-2020 seulement")
for c in PAYS: fit(nc[nc.iso!=c],lab=f"hors crise, sans {c}")
s=nc.copy(); s["dlin"]=s.dl/10; m=smf.ols("spread ~ dlin + fx",s.assign(fx=np.maximum(0,s.fl-3))).fit(cov_type="cluster",cov_kwds={"groups":s.iso}); print(f"\nlinéaire, sans seuil : {m.params.dlin:.2f} (±{m.bse.dlin:.2f}) par 10 points de dette")
print("\nobservations au-dessus de 100 % hors crise :", nc[nc.dl>100].groupby("iso").size().to_dict())
print(nc[nc.iso=="FRA"][["year","dl","spread"]].tail(8).round(2).to_string(index=False))
