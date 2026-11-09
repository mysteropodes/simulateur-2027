// Quiz (format Wahl-O-Mat) : parcours complet + cohérence des scores + mobile. Usage : node tests/quiz.js [capture.png]
const {chromium}=require('playwright'); const path=require('path'); const S=process.argv[2];
(async()=>{const br=await chromium.launch();const errs=[];let bad=0;const ok=(c,m)=>{if(!c){bad++;console.log('ÉCHEC',m);}};
const open=async(vp)=>{const pg=await br.newPage({viewport:vp});pg.on('pageerror',e=>errs.push(e.message));
 await pg.route('**/*',r=>r.request().url().startsWith('file:')?r.continue():r.abort());
 await pg.goto('file://'+path.resolve(__dirname,'..','index.html'));
 await pg.waitForFunction(()=>typeof MC!=='undefined'&&MC&&MC.rows&&MC.rows.length&&MC.pol,{timeout:120000});
 await pg.evaluate(()=>{showView('quiz');qzRender();}); return pg;};
const pg=await open({width:1280,height:900});
ok(await pg.$('#qzStart'),'écran d\'accueil');
const res=await pg.evaluate(()=>{const pos=qzPositions(), ids=Object.keys(pos), out={ids, nulls:0, bad:0};
 for(const id of ids) for(const t of QZ_T){const x=pos[id][t.id]; if(x.s==null) out.nulls++; if(x.s!=null&&![-1,0,1].includes(x.s)) out.bad++; if(/NaN|undefined/.test(x.txt)) out.bad++;}
 const allA=v=>Object.fromEntries(QZ_T.map(t=>[t.id,v]));
 out.all1=qzRank(pos,allA(1),{}).map(x=>x.id+' '+Math.round(x.score*100));
 out.allm1=qzRank(pos,allA(-1),{}).map(x=>x.id+' '+Math.round(x.score*100));
 const left={ret:1,serv:1,clim:1,mig:-1,def:0,dette:-1,top:1,mod:1,soc:-1,cho:-1,ent:-1,her:1};
 const right={ret:-1,serv:-1,clim:-1,mig:1,def:1,dette:1,top:-1,mod:-1,soc:1,cho:1,ent:1,her:-1};
 out.left=qzRank(pos,left,{}).map(x=>x.id+' '+Math.round(x.score*100)); out.right=qzRank(pos,right,{}).map(x=>x.id+' '+Math.round(x.score*100));
 out.empty=qzRank(pos,{},{}).length;
 out.dbl=qzRank(pos,left,{ret:true}).map(x=>x.id+' '+Math.round(x.score*100));
 out.table=Object.fromEntries(ids.map(id=>[id,QZ_T.map(t=>pos[id][t.id].s==null?'-':({1:'+',0:'0','-1':'x'})[pos[id][t.id].s]).join('')]));
 return out;});
console.log(JSON.stringify(res,null,1));
ok(res.bad===0,'positions invalides ou NaN');
ok(res.empty===0,'sans réponse -> aucun classement');
ok(/^(melenchon|glucksmann)/.test(res.left[0]),'profil gauche -> '+res.left[0]);
ok(/^(philippe|retailleau|attal|lepen)/.test(res.right[0]),'profil droite -> '+res.right[0]);
ok(res.nulls<res.ids.length*12*0.4,'trop de positions manquantes');
// parcours via l'interface : on répond D'accord à tout, la 3e compte double
await pg.click('#qzStart');
for(let i=0;i<12;i++){ await pg.waitForSelector('.qz-fs'); await (await pg.$('.qz-opt input')).check(); await pg.waitForSelector('.qz-fx li');
 if(i===2) await pg.check('#qzDbl'); if(i===11) ok(/Voir mon résultat/.test(await pg.innerText('#qzNext')),'dernier bouton'); await pg.click('#qzNext'); }
await pg.waitForSelector('.qz-ranking');
const txt=await pg.innerText('#quizBox'); ok(!/undefined|NaN/.test(txt),'undefined/NaN dans le résultat');
ok((await pg.$$('.qz-ranking li')).length>=5,'au moins 5 programmes classés');
ok(/Votre programme, chiffré/.test(txt)&&/Risque de crise/.test(txt),'« votre programme » affiché');
ok(/pas un conseil de vote/.test(txt),'avertissement');
ok((await pg.$$('.qz-det')).length===12,'12 détails');
ok(/points chauds/i.test(await pg.innerText('#qzHot'))&&/plus grosses mesures/i.test(await pg.innerText('#qzHot')),'points chauds du premier');
for(const id of ['melenchon','lepen','philippe','glucksmann','retailleau','attal']){await pg.click('#qzHot [data-id="'+id+'"]'); const x=await pg.innerText('.qz-hotbody'); ok(!/undefined|NaN|Infinity/.test(x)&&/Risque de crise/.test(x),'points chauds '+id);}
// passer une question : exclue du calcul
await pg.click('#qzEdit'); await pg.waitForSelector('.qz-fs'); await pg.click('#qzSkip'); await pg.click('#qzSkip');
for(let i=2;i<12;i++){ await pg.waitForSelector('.qz-fs'); await pg.click('#qzNext'); }
await pg.waitForSelector('.qz-ranking'); ok((await pg.$$('.qz-det')).length===10,'2 passées -> 10 détails');
if(S){ await pg.screenshot({path:S,fullPage:true}); }
// mobile
const m=await open({width:390,height:800}); await m.click('#qzStart'); await m.waitForSelector('.qz-fs');
await (await m.$('.qz-opt input')).check(); await m.waitForSelector('.qz-fx li');
ok(!(await m.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1)),'débordement mobile (question)');
if(S) await m.screenshot({path:S.replace('.png','-mobile.png'),fullPage:true});
for(let i=0;i<12;i++){ if(i) {await m.waitForSelector('.qz-fs'); await (await m.$('.qz-opt input')).check();} await m.click('#qzNext'); }
await m.waitForSelector('.qz-ranking'); ok(!(await m.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1)),'débordement mobile (résultat)');
if(S) await m.screenshot({path:S.replace('.png','-mobile-res.png'),fullPage:true});
ok(errs.length===0,'erreurs page: '+errs.join(' | '));
console.log(bad?'ÉCHECS : '+bad:'quiz : tout est bon'); await br.close(); process.exit(bad?1:0);})();
