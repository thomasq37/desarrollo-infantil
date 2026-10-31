// Données et logique de la page « Développement et vaccins »
'use strict';
// ---------- Données ----------
// a = âge d'apparition approximatif en mois (lu sur l'échelle), b = fin (alertes)
const CATS = {
  soc:{fr:'Socialisation',es:'Socialización',col:'var(--soc)'},
  lang:{fr:'Langage et logique mathématique',es:'Lenguaje y lógica matemática',col:'var(--lang)'},
  man:{fr:'Manipulation',es:'Manipulación',col:'var(--man)'},
  post:{fr:'Posture',es:'Postural',col:'var(--post)'},
  sa:{fr:'Signaux d’alerte',es:'Señales de alerta',col:'var(--sa)'},
  vac:{fr:'Vaccins',es:'Vacunas',col:'var(--vac)'}
};
const I = [
// Socialisation
['soc',1,1,'Réagit à la voix','Reacciona a la voz'],
['soc',2,2,'Sourit à la mère / au père','Sonríe a la madre / al padre'],
['soc',3,3,'Reconnaît le biberon','Reconoce el biberón'],
['soc',4,4,'Regarde ses mains','Se mira las manos'],
['soc',5,4,'Poursuite optique verticale','Seguimiento óptico vertical'],
['soc',6,5,'Poursuite optique horizontale','Seguimiento óptico horizontal'],
['soc',7,6,'Cherche un objet tombé','Busca un objeto caído'],
['soc',8,6,'Mange un biscuit','Come una galleta'],
['soc',9,8,'Joue à cache-cache','Juega al escondite'],
['soc',10,8,'Cherche un objet disparu','Busca un objeto desaparecido'],
['soc',11,10,'Imite des gestes simples','Imita gestos sencillos'],
['soc',12,10,'Aide quand on l’habille','Ayuda cuando lo visten'],
['soc',13,13,'Porte un verre à la bouche','Se lleva un vaso a la boca'],
['soc',14,15,'Imite les tâches ménagères','Imita tareas del hogar'],
['soc',15,15,'Mange à la cuillère','Come con cuchara'],
['soc',16,17,'Aide à ranger les jouets','Ayuda a recoger los juguetes'],
['soc',17,20,'Donne à manger aux poupées','Da de comer a los muñecos'],
['soc',18,24,'Enlève son pantalon','Se quita los pantalones'],
['soc',19,29,'Dramatise des séquences','Dramatiza secuencias'],
['soc',20,30,'Enfile des vêtements ouverts','Se pone prendas abiertas'],
['soc',21,31,'Va aux toilettes','Va al váter'],
['soc',22,36,'Déboutonne ses boutons','Se desabrocha los botones'],
['soc',23,36,'Manipule des marionnettes','Manipula marionetas'],
['soc',24,42,'Rend la nourriture comestible','Hace comestible la comida'],
['soc',25,50,'Dessine une personne','Dibuja una persona'],
// Langage
['lang',26,1.5,'Est attentif à la conversation','Presta atención a la conversación'],
['lang',27,3,'Fait des rires','Hace risas'],
['lang',28,6,'Babille','Balbucea'],
['lang',29,8,'Ma-ma / pa-pa non spécifique','Ma-ma / pa-pa inespecífico'],
['lang',30,9,'Comprend une interdiction','Comprende una prohibición'],
['lang',31,9.5,'Reconnaît son prénom','Reconoce su nombre'],
['lang',32,11,'Comprend le sens de quelques mots','Comprende el significado de algunas palabras'],
['lang',33,12,'Obéit à un ordre donné par gestes','Obedece una orden por gestos'],
['lang',34,13,'Dit maman / papa','Dice mamá / papá'],
['lang',35,16,'Utilise un mot','Utiliza una palabra'],
['lang',36,16,'Montre une partie du corps','Señala una parte del cuerpo'],
['lang',37,19,'Nomme un objet dessiné','Nombra un objeto dibujado'],
['lang',38,19,'Exécute 2 ordres','Ejecuta 2 órdenes'],
['lang',39,20,'Combine 2 mots','Combina 2 palabras'],
['lang',40,23.5,'Utilise des pronoms','Utiliza pronombres'],
['lang',41,25,'Nomme 5 images','Nombra 5 imágenes'],
['lang',42,26,'Identifie des objets par leur usage','Identifica objetos por su uso'],
['lang',43,28,'Phrases de 3 mots','Frases de 3 palabras'],
['lang',44,28,'Mémorise une image simple','Memoriza una imagen sencilla'],
['lang',45,30,'Compte jusqu’à 2','Cuenta hasta 2'],
['lang',46,30,'Nomme 10 images','Nombra 10 imágenes'],
['lang',47,31,'Utilise le verbe « être »','Utiliza el verbo ser'],
['lang',48,35,'Distingue long et court','Distingue largo y corto'],
['lang',49,35,'Répond de façon cohérente','Responde coherentemente'],
['lang',50,37,'Reconnaît les couleurs','Reconoce colores'],
['lang',51,37,'Fait des actions sans lien entre elles','Hace acciones inconexas'],
['lang',52,41,'Nomme les couleurs','Denomina colores'],
['lang',53,46,'Distingue matin et après-midi','Distingue mañana y tarde'],
['lang',54,51,'Raconte des histoires','Explica historias'],
['lang',55,55,'Répète des phrases','Repite frases'],
['lang',56,55,'Reconnaît les nombres','Reconoce números'],
// Manipulation
['man',57,2.5,'Joint les mains','Junta las manos'],
['man',58,4,'Dirige la main vers un objet','Dirige la mano a un objeto'],
['man',59,5.5,'Change un objet de main','Cambia objetos de mano'],
['man',60,6,'Retire un mouchoir de son visage','Se quita un pañuelo de la cara'],
['man',61,8,'Pince inférieure','Pinza inferior'],
['man',62,9,'Pince supérieure','Pinza superior'],
['man',63,11,'Montre avec l’index','Señala con el índice'],
['man',64,13.5,'Fait des gribouillis spontanés','Hace garabatos espontáneamente'],
['man',65,14,'Tourne les pages librement','Pasa páginas libremente'],
['man',66,14.5,'Tour de 2 cubes','Torre de 2 cubos'],
['man',67,16,'Met le capuchon d’un stylo','Tapa un bolígrafo'],
['man',68,18,'Tour de 4 cubes','Torre de 4 cubos'],
['man',69,27,'Tient un crayon','Agarra un lápiz'],
['man',70,30,'Copie un cercle','Copia un círculo'],
['man',71,32,'Reproduit un pont','Reproduce un puente'],
['man',72,42,'Plie un papier','Dobla un papel'],
['man',73,44,'Coupe avec des ciseaux','Corta con tijeras'],
['man',74,48,'Copie un carré','Copia un cuadrado'],
['man',75,48,'Reproduit une porte','Reproduce una puerta'],
// Posture
['post',76,1,'Redressement de la tête (sur le ventre)','Enderezamiento cefálico (decúbito prono)'],
['post',77,2,'Passe à la position assise','Pasa a sentarse'],
['post',78,2,'Se redresse sur les avant-bras (sur le ventre)','Se apoya en los antebrazos (decúbito prono)'],
['post',79,4,'Flexion de la tête','Flexión cefálica'],
['post',80,5.5,'Se retourne du ventre au dos','Se da la vuelta de decúbito prono a supino'],
['post',81,6.5,'Réactions parachute latérales','Reacciones paracaídas laterales'],
['post',82,7,'Position assise stable','Sedestación estable'],
['post',83,8,'Se tient debout avec appui','Se mantiene de pie con apoyo'],
['post',84,9,'Passe à la position assise sans aide','Pasa a sentarse sin ayuda'],
['post',85,12,'Fait 5 pas seul','Da 5 pasos solo'],
['post',86,12,'Marche libre','Marcha libre'],
['post',87,13,'Se met debout sans appui','Se pone de pie sin apoyo'],
['post',88,16,'Court librement','Carrera libre'],
['post',89,16,'Marche à reculons','Camina hacia atrás'],
['post',90,19,'Descend les escaliers','Baja escaleras'],
['post',91,22,'Tape dans un ballon','Chuta una pelota'],
['post',92,24.5,'Saute en avant','Salta hacia delante'],
['post',93,28,'Tient sur un pied','Se aguanta sobre un pie'],
['post',94,32,'Saute à pieds joints','Salta con los pies juntos'],
['post',95,40,'Saute en arrière','Salta hacia atrás'],
['post',96,44,'Équilibre sur un pied','Equilibrio sobre un pie'],
// Signaux d'alerte [cat, code, début, fin]
['sa','SA1',2,6,'Irritabilité permanente','Irritabilidad permanente'],
['sa','SA2',2,4,'Sursaut exagéré','Sobresalto exagerado'],
['sa','SA3',2,4,'Pouce adduit (rentré dans la paume)','Pulgar aducto'],
['sa','SA4',3,6,'Asymétrie de l’activité des mains','Asimetría de la actividad de las manos'],
['sa','SA5',4,8,'Passivité excessive','Pasividad excesiva'],
['sa','SA6',4,9,'Hypertonie des adducteurs','Hipertonía de aductores'],
['sa','SA7',5,12,'Réflexe persistant','Reflejo persistente'],
['sa','SA8',9,14,'Schéma de comportement répétitif','Patrón de conducta repetitivo'],
['sa','SA9',9,22,'Absence de déplacement autonome','Ausencia de desplazamiento autónomo'],
['sa','SA10',14,23,'Perte du babillage','Pérdida del balbuceo'],
['sa','SA11',18,30,'Passe constamment d’une activité à l’autre','Pasa constantemente de una actividad a otra'],
['sa','SA12',25,36,'Stéréotypies verbales','Estereotipias verbales'],
['sa','SA13',25,38,'Incapacité à développer le jeu symbolique','Incapacidad para desarrollar juego simbólico']
];
// Vaccins [mois, étiquette fr, étiquette es, [[fr,es],...]]
const V = [
 [0,'0 mois','0 meses',[['Immunisation contre le VRS (virus respiratoire syncytial) ¹','Inmunización frente al VRS (virus respiratorio sincitial) ¹']]],
 [2,'2 mois','2 meses',[
   ['Hexavalent (diphtérie, tétanos, coqueluche, polio, Hib, hépatite B)','Hexavalente (difteria, tétanos, tos ferina, polio, Hib, hepatitis B)'],
   ['Rotavirus ²','Rotavirus ²'],['Pneumocoque conjugué','Neumococo conjugada'],['Méningocoque B','Meningococo B']]],
 [4,'4 mois','4 meses',[
   ['Hexavalent','Hexavalente'],['Rotavirus ² (jusqu’à ≈ 6 mois)','Rotavirus ² (hasta ≈ 6 meses)'],
   ['Pneumocoque conjugué','Neumococo conjugada'],['Méningocoque C conjugué','Meningococo C conjugada'],['Méningocoque B','Meningococo B']]],
 [6,'6 à 59 mois','6 a 59 meses',[['Grippe, chaque année','Gripe, cada año']]],
 [11,'11 mois','11 meses',[['Hexavalent','Hexavalente'],['Pneumocoque conjugué','Neumococo conjugada']]],
 [12,'12 mois','12 meses',[
   ['Méningocoque conjugué tétravalent (ACWY)','Meningococo conjugada tetravalente (ACWY)'],['Méningocoque B','Meningococo B'],
   ['Triple virale (rougeole, rubéole, oreillons)','Triple vírica (sarampión, rubéola, parotiditis)']]],
 [15,'15 mois','15 meses',[['Varicelle','Varicela'],['Hépatite A','Hepatitis A']]],
 [36,'3 ans','3 años',[['Triple virale','Triple vírica'],['Varicelle','Varicela']]],
 [72,'6 ans','6 años',[['DTPa-PI (diphtérie, tétanos, coqueluche, polio)','DTPa-PI (difteria, tétanos, tos ferina, polio)'],['Hépatite A','Hepatitis A']]],
 [132,'11-12 ans','11-12 años',[
   ['dTpa','dTpa'],['Méningocoque conjugué tétravalent (ACWY) ³','Meningococo conjugada tetravalente (ACWY) ³'],
   ['Varicelle ⁴','Varicela ⁴'],['Hépatite A ⁴','Hepatitis A ⁴'],['Virus du papillome humain','Virus del papiloma humano']]]
];
const NOTES = {
 fr:['¹ Immunisation de tous les nourrissons de moins de 12 mois, lors de leur première saison épidémique du VRS. Nés avant le début de la saison (avril à septembre) : en septembre-octobre. Nés pendant la saison (octobre à mars) : de préférence avant la sortie de maternité.',
     '² Vaccination contre le rotavirus à partir de 2 mois, selon le schéma du vaccin disponible.',
     '³ Méningocoque conjugué tétravalent (ACWY) : à vacciner les adolescents de 11-12 ans qui n’ont reçu aucune dose du vaccin ACWY à partir de 10 ans, ou partiellement vaccinés (le schéma compte deux doses). Rattrapage jusqu’à 18 ans inclus.',
     '⁴ Hépatite A et varicelle : seulement pour les enfants de 11-12 ans non immunisés (non vaccinés ou sans antécédent de maladie).',
     'Note : la vaccination contre le SARS-CoV-2 est recommandée chaque année à l’automne, selon les recommandations en vigueur (plus de 60 ans et autres personnes à risque).',
     'Le calendrier comporte aussi une colonne « Herpès zoster » sans case colorée sur la photo.'],
 es:['¹ Inmunización de todos los lactantes menores de 12 meses, en su primera temporada epidémica del VRS. Nacidos antes del inicio de la temporada (abril a septiembre): en septiembre-octubre. Nacidos durante la temporada (octubre a marzo): preferentemente antes del alta de la maternidad.',
     '² Vacunación contra el rotavirus a partir de los 2 meses de edad, según la pauta de la vacuna disponible.',
     '³ Meningococo conjugada tetravalente (ACWY): se vacunan los adolescentes de 11-12 años que no hayan recibido ninguna dosis de la vacuna ACWY a partir de los 10 años, o parcialmente vacunados (la pauta consta de dos dosis). Rescate hasta los 18 años inclusive.',
     '⁴ Hepatitis A y varicela: solo en niños de 11-12 años no inmunizados (no vacunados o sin antecedentes de enfermedad).',
     'Nota: se recomienda la vacunación contra el SARS-CoV-2 cada año durante la campaña de otoño, según las recomendaciones vigentes (mayores de 60 años y otras personas con condiciones de riesgo).',
     'El calendario incluye también una columna «Herpes zóster» sin casilla coloreada en la foto.']
};
const BANDS = [[0,3],[3,6],[6,12],[12,24],[24,36],[36,60],[60,9999]];
const T = {
 fr:{title:'Développement et vaccins',q:'Rechercher (ex. marche, mots, hexavalent)…',l1:'Catégorie',l2:'Âge d’apparition',all:'Toutes',allAge:'Tous âges',
     mo:'mois',yr:'ans',from:'dès ≈',range:'≈',items:'éléments',one:'élément',none:'Aucun résultat.',
     src:'Sources : échelle Haizea-Llevant (modifiée d’après Fernández Álvarez E. et al., Tabla de desarrollo 0-5 años, Gobierno Vasco, 1991) et calendrier de vaccinations et immunisations systématiques de la Generalitat de Catalunya (061 Salut Respon, canalsalut.gencat.cat). Les âges de développement sont approximatifs, lus sur l’échelle ; ils sont indicatifs et ne remplacent pas l’avis du pédiatre.',
     notes:'Notes du calendrier vaccinal',alertTag:'Alerte si présent'},
 es:{title:'Desarrollo y vacunas',q:'Buscar (p. ej. marcha, palabras, hexavalente)…',l1:'Categoría',l2:'Edad de aparición',all:'Todas',allAge:'Todas las edades',
     mo:'meses',yr:'años',from:'desde ≈',range:'≈',items:'elementos',one:'elemento',none:'Sin resultados.',
     src:'Fuentes: escala Haizea-Llevant (modificada de Fernández Álvarez E. y cols., Tabla de desarrollo 0-5 años, Gobierno Vasco, 1991) y calendario de vacunaciones e inmunizaciones sistemáticas de la Generalitat de Catalunya (061 Salut Respon, canalsalut.gencat.cat). Las edades de desarrollo son aproximadas, leídas en la escala; son orientativas y no sustituyen la opinión del pediatra.',
     notes:'Notas del calendario de vacunación',alertTag:'Alerta si está presente'}
};

// ---------- Textes de l'interface ----------
Object.assign(T.fr,{
  ageLabel:'Mon enfant a',ageUnit:'mois',ageHint:'Indique l’âge pour voir ce qui arrive bientôt.',
  viewSoon:'Bientôt',viewAll:'Tout',filters:'Filtres',stAll:'Tous',stTodo:'Non acquis',stDone:'Acquis',
  lStatus:'Statut',recent:'Vient d’apparaître',soon:'Arrive bientôt',ongoing:'Alertes à surveiller maintenant',
  tagRecent:'récent',tagSoon:'bientôt',acquired:'acquis',done:'fait',minus:'Moins un mois',plus:'Plus un mois',
  needAge:'Renseigne l’âge de ton enfant pour afficher la vue « Bientôt ».',nothingSoon:'Rien de prévu dans cette période.',
  reset:'Tout décocher',confirmReset:'Décocher tous les éléments ?',saved:'Sauvegardé sur ce téléphone'});
Object.assign(T.es,{
  ageLabel:'Mi hijo/a tiene',ageUnit:'meses',ageHint:'Indica la edad para ver lo que llega pronto.',
  viewSoon:'Pronto',viewAll:'Todo',filters:'Filtros',stAll:'Todos',stTodo:'No adquiridos',stDone:'Adquiridos',
  lStatus:'Estado',recent:'Acaba de aparecer',soon:'Llega pronto',ongoing:'Señales de alerta a vigilar ahora',
  tagRecent:'reciente',tagSoon:'pronto',acquired:'adquiridos',done:'hecho',minus:'Un mes menos',plus:'Un mes más',
  needAge:'Indica la edad de tu hijo/a para mostrar la vista «Pronto».',nothingSoon:'Nada previsto en este periodo.',
  reset:'Desmarcar todo',confirmReset:'¿Desmarcar todos los elementos?',saved:'Guardado en este teléfono'});

// ---------- État (sauvegardé sur le téléphone) ----------
const WINDOW=3; // mois avant / après l'âge de l'enfant
const KEY={lang:'dev-lang',age:'dev-age',view:'dev-view',done:'dev-done'};
const store={
  get(k){try{return localStorage.getItem(k);}catch(e){return null;}},
  set(k,v){try{localStorage.setItem(k,v);}catch(e){}},
  del(k){try{localStorage.removeItem(k);}catch(e){}}
};
let lang=store.get(KEY.lang)==='es'?'es':'fr';
let age=(()=>{const n=parseFloat(store.get(KEY.age));return isFinite(n)&&n>=0&&n<=216?n:null;})();
let view=store.get(KEY.view)==='all'||store.get(KEY.view)==='soon'?store.get(KEY.view):(age!==null?'soon':'all');
let done=new Set((()=>{try{return JSON.parse(store.get(KEY.done)||'[]');}catch(e){return [];}})());
let cat='all', band=-1, status='all', q='';

const $=id=>document.getElementById(id);
const num=x=>Number.isInteger(x)?x:String(x).replace('.',',');
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
const fmt=(m,l)=>{const t=T[l];return (m>=24&&m%12===0)?(m/12)+' '+t.yr:num(m)+' '+t.mo;};
const bandLbl=(b,l)=>{const t=T[l],[s,e]=b,f=m=>m>=24?(m/12)+' '+t.yr:m+' '+t.mo;
  return e>=9999?'5 '+t.yr+' +':f(s)+' – '+f(e);};
const bandOf=a=>BANDS.findIndex(b=>a>=b[0]&&a<b[1]);

// ---------- Liste complète ----------
const ALL=[];
for(const r of I){
  if(r[0]==='sa') ALL.push({k:'sa',cat:'sa',id:r[1],key:'s'+r[1],a:r[2],b:r[3],fr:r[4],es:r[5]});
  else ALL.push({k:'it',cat:r[0],id:r[1],key:'i'+r[1],a:r[2],fr:r[3],es:r[4]});
}
for(const v of V) ALL.push({k:'vac',cat:'vac',id:'💉',key:'v'+v[0],a:v[0],lab:v,list:v[3]});
ALL.sort((x,y)=>x.a-y.a||String(x.id).localeCompare(String(y.id),undefined,{numeric:true}));
const trackable=e=>e.k!=='sa';

// ---------- Position par rapport à l'âge de l'enfant ----------
function phase(e){ // recent | soon | ongoing | null
  if(age===null) return null;
  if(e.k==='sa') return (e.a<=age&&e.b>=age)?'ongoing':null;
  if(e.a<=age&&e.a>=age-WINDOW) return 'recent';
  if(e.a>age&&e.a<=age+WINDOW) return 'soon';
  return null;
}

// ---------- Construction des filtres (une seule fois par langue) ----------
function buildChips(){
  const t=T[lang];
  $('cats').innerHTML=['all','soc','lang','man','post','sa','vac'].map(c=>
    `<button class="chip" data-c="${c}">${c==='all'?t.all:CATS[c][lang]}</button>`).join('');
  $('ages').innerHTML=[`<button class="chip" data-b="-1">${t.allAge}</button>`]
    .concat(BANDS.map((b,i)=>`<button class="chip" data-b="${i}">${bandLbl(b,lang)}</button>`)).join('');
  $('sts').innerHTML=[['all',t.stAll],['todo',t.stTodo],['done',t.stDone]].map(([k,l])=>
    `<button class="chip" data-s="${k}">${l}</button>`).join('');
}
function pressed(){
  document.querySelectorAll('[data-c]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.c===cat));
  document.querySelectorAll('[data-b]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.b===band));
  document.querySelectorAll('[data-s]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.s===status));
  document.querySelectorAll('[data-v]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===view));
  document.querySelectorAll('.lang button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.l===lang));
}
function statics(){
  const t=T[lang];
  document.documentElement.lang=lang; document.title=t.title;
  $('title').textContent=t.title; $('q').placeholder=t.q;
  $('ageLabel').textContent=t.ageLabel; $('ageUnit').textContent=t.ageUnit;
  $('minus').setAttribute('aria-label',t.minus); $('plus').setAttribute('aria-label',t.plus);
  $('fsum').textContent=t.filters; $('l1').textContent=t.l1; $('l2').textContent=t.l2; $('l3').textContent=t.lStatus;
  $('vSoon').textContent=t.viewSoon; $('vAll').textContent=t.viewAll;
  $('reset').textContent=t.reset; $('src').textContent=t.src;
}

// ---------- Rendu ----------
function card(e){
  const t=T[lang], col=CATS[e.cat].col, ph=phase(e), isDone=done.has(e.key);
  const box=trackable(e)?`<input type="checkbox" class="ck" data-k="${e.key}" ${isDone?'checked':''} aria-label="${t.done}">`:'<span class="ck-sp"></span>';
  const tag=ph==='recent'?`<span class="tag recent">${t.tagRecent}</span>`:ph==='soon'?`<span class="tag soon">${t.tagSoon}</span>`:'';
  const cls='card'+(isDone?' is-done':'')+(ph?' ph-'+ph:'');
  if(e.k==='vac'){
    return `<label class="${cls}" style="--c:${col}">${box}<div class="t"><strong>${lang==='fr'?e.lab[1]:e.lab[2]}</strong>${tag}
      <ul class="vlist">${e.list.map(x=>`<li>${x[lang==='fr'?0:1]}</li>`).join('')}</ul><span class="cat">${CATS.vac[lang]}</span></div></label>`;
  }
  const a=e.k==='sa'?`${t.range} ${num(e.a)}–${num(e.b)} ${t.mo}`:`${t.from} ${fmt(e.a,lang)}`;
  const inner=`<div class="n">${e.id}</div><div class="t">${e[lang]}${tag}<span class="cat">${CATS[e.cat][lang]}${e.k==='sa'?' · '+t.alertTag:''}</span></div><div class="a">${a}</div>`;
  return trackable(e)?`<label class="${cls}" style="--c:${col}">${box}${inner}</label>`:`<div class="${cls}" style="--c:${col}"><span class="ck-sp"></span>${inner}</div>`;
}

function render(){
  const t=T[lang], nq=norm(q.trim());
  const soonView=view==='soon';
  $('needAge').hidden=!(soonView&&age===null);
  const rows=ALL.filter(e=>{
    if(soonView){ if(age===null||!phase(e)) return false; }
    if(cat!=='all'&&e.cat!==cat) return false;
    if(!soonView&&band!==-1&&bandOf(e.a)!==band) return false;
    if(trackable(e)){
      if(status==='todo'&&done.has(e.key)) return false;
      if(status==='done'&&!done.has(e.key)) return false;
    } else if(status==='done') return false;
    if(nq){
      const txt=e.k==='vac'?e.list.map(x=>x[0]+' '+x[1]).join(' ')+' '+e.lab[1]+' '+e.lab[2]:e.fr+' '+e.es;
      if(!norm(txt).includes(nq)) return false;
    }
    return true;
  });
  const total=ALL.filter(trackable).length, nd=[...done].filter(k=>ALL.some(e=>e.key===k)).length;
  $('count').textContent=`${rows.length} ${rows.length===1?t.one:t.items} · ${nd}/${total} ${t.acquired}`;
  let html='';
  if(soonView&&age!==null){
    for(const [ph,label] of [['ongoing',t.ongoing],['recent',t.recent],['soon',t.soon]]){
      const g=rows.filter(e=>phase(e)===ph);
      if(g.length) html+=`<h2>${label}</h2>`+g.map(card).join('');
    }
    if(!rows.length) html=`<div class="empty">${t.nothingSoon}</div>`;
  } else if(!soonView){
    let last=-2;
    for(const e of rows){
      const bi=bandOf(e.a);
      if(bi!==last){last=bi;html+=`<h2>${bandLbl(BANDS[bi],lang)}</h2>`;}
      html+=card(e);
    }
    if(!rows.length) html=`<div class="empty">${t.none}</div>`;
  }
  $('list').innerHTML=html;
  const n=$('notes'), showNotes=!soonView&&(cat==='all'||cat==='vac');
  n.hidden=!showNotes;
  if(showNotes) n.innerHTML=`<strong>${t.notes}</strong>`+NOTES[lang].map(x=>`<p>${x}</p>`).join('');
  $('reset').hidden=done.size===0;
  pressed();
}

// ---------- Âge de l'enfant ----------
function setAge(v){
  age=(v===null||!isFinite(v))?null:Math.min(216,Math.max(0,v));
  if(age===null) store.del(KEY.age); else store.set(KEY.age,String(age));
  $('age').value=age===null?'':num(age);
  if(age!==null&&store.get(KEY.view)===null) view='soon';
  render();
}

// ---------- Événements ----------
document.addEventListener('click',e=>{
  const b=e.target.closest('button'); if(!b) return;
  if(b.dataset.l){lang=b.dataset.l;store.set(KEY.lang,lang);statics();buildChips();}
  else if(b.dataset.c) cat=b.dataset.c;
  else if(b.dataset.b!==undefined) band=+b.dataset.b;
  else if(b.dataset.s) status=b.dataset.s;
  else if(b.dataset.v){view=b.dataset.v;store.set(KEY.view,view);}
  else if(b.id==='minus') return setAge((age===null?0:Math.ceil(age))-1<0?0:(age===null?0:Math.ceil(age))-1);
  else if(b.id==='plus') return setAge((age===null?-1:Math.floor(age))+1);
  else if(b.id==='reset'){ if(confirm(T[lang].confirmReset)){done.clear();store.set(KEY.done,'[]');} }
  else return;
  render();
});
document.addEventListener('change',e=>{
  const c=e.target.closest('.ck'); if(!c) return;
  c.checked?done.add(c.dataset.k):done.delete(c.dataset.k);
  store.set(KEY.done,JSON.stringify([...done]));
  render();
});
$('age').addEventListener('input',e=>{
  const raw=e.target.value.trim(), v=parseFloat(raw.replace(',','.'));
  if(raw===''){age=null;store.del(KEY.age);render();return;}
  if(isFinite(v)){
    age=Math.min(216,Math.max(0,v)); store.set(KEY.age,String(age));
    if(store.get(KEY.view)===null) view='soon';
    render();
  }
});
$('q').addEventListener('input',e=>{q=e.target.value;render();});

statics(); buildChips(); if(age!==null) $('age').value=num(age); render();
