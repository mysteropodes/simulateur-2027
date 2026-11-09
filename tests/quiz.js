// Quiz : parcours complet dans la page + cohérence des scores. Usage : node tests/quiz.js [capture.png]
const {chromium}=require('playwright'); const path=require('path'); const S=process.argv[2];
(async()=>{const br=await chromium.launch();const errs=[];let bad=0;const ok=(c,m)=>{if(!c){bad++;console.log('ÉCHEC',m);}};
const pg=await br.newPage({viewport:{width:1280,height:900}});pg.on('pageerror',e=>errs.push(e.message));
await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await pg.goto('file://'+path.resolve(__dirname,'..','index.html'));
await pg.waitForFunction(()=>typeof MC!=='undefined'&&MC&&MC.rows&&MC.rows.length&&MC.pol,{timeout:120000});
await pg.evaluate(()=>{window.__qzNoShuffle=true; showView('quiz'); qzRender();});
ok(await pg.$('#qzStart'),'écran d\'accueil');
// profils : choix par thème (valeur visée), importance 2
const prof={gauche:{ret:60,mod:7,top:-6,serv:22,clim:20,mig:20,dette:0,def:0},
 rigueur:{ret:65,mod:-5,top:3,serv:-15,clim:-4,mig:-100,dette:110,def:22},
 centre:{ret:64,mod:0,top:0,serv:0,clim:4,mig:0,dette:55,def:11}};
const res=await pg.evaluate((prof)=>{const vals=qzValues(), out={}; for(const [k,a] of Object.entries(prof)){const rk=qzRank(vals,a,{}); out[k]=rk.map(x=>x.id+' '+Math.round(x.score*100)); if(rk.some(x=>!isFinite(x.score)||x.score<0||x.score>1)) out[k+'_bad']=1;} return out;},prof);
console.log(JSON.stringify(res,null,1));
ok(!res.gauche_bad&&!res.rigueur_bad&&!res.centre_bad,'scores hors [0,1]');
// cohérence : le profil « gauche » place Mélenchon ou Glucksmann en tête, le profil « rigueur » un des candidats de droite ou de centre
ok(/^(melenchon|glucksmann)/.test(res.gauche[0]),'profil gauche -> '+res.gauche[0]);
ok(/^(philippe|retailleau|attal|lepen)/.test(res.rigueur[0]),'profil rigueur -> '+res.rigueur[0]);
// symétrie : tout « sans avis » -> aucun classement
ok(await pg.evaluate(()=>qzRank(qzValues(),{},{}).length===0),'sans réponse');
// parcours via l'interface
await pg.click('#qzStart');
for(let i=0;i<8;i++){ await pg.waitForSelector('.qz-fs'); const first=await pg.$('.qz-opt input'); await first.check(); if(i===2){ await pg.click('#qzImp button[data-w="3"]'); } await pg.click('#qzNext'); }
await pg.waitForSelector('.qz-card');
const txt=await pg.innerText('#quizBox'); ok(!/undefined|NaN/.test(txt),'undefined/NaN dans le résultat');
ok((await pg.$$('.qz-card')).length>=3,'au moins 3 cartes');
ok(/Ce que le simulateur projette/.test(txt)&&/Risque de crise/.test(txt),'projection affichée');
ok(/Ce n'est pas un conseil de vote|pas un conseil de vote/.test(txt),'avertissement');
if(S){ await pg.screenshot({path:S,fullPage:true}); }
// mobile
const m=await br.newPage({viewport:{width:390,height:800},deviceScaleFactor:2});m.on('pageerror',e=>errs.push(e.message));
await m.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
await m.goto('file://'+path.resolve(__dirname,'..','index.html'));
await m.waitForFunction(()=>typeof MC!=='undefined'&&MC&&MC.rows&&MC.rows.length,{timeout:120000});
await m.evaluate(()=>{showView('quiz');qzRender();}); await m.click('#qzStart'); await m.waitForSelector('.qz-fs');
const ov=await m.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1); ok(!ov,'défilement horizontal sur mobile (question)');
if(S) await m.screenshot({path:S.replace('.png','-mobile.png')});
for(let i=0;i<8;i++){ await m.waitForSelector('.qz-fs'); await (await m.$('.qz-opt input')).check(); await m.click('#qzNext'); }
await m.waitForSelector('.qz-card'); const ov2=await m.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1); ok(!ov2,'défilement horizontal sur mobile (résultat)');
if(S) await m.screenshot({path:S.replace('.png','-mobile-res.png'),fullPage:true});
ok(errs.length===0,'erreurs page: '+errs.join(' | '));
console.log(bad?'ÉCHECS : '+bad:'quiz : tout est bon'); await br.close(); process.exit(bad?1:0);})();
