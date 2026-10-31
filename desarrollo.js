// Données et logique de la page « Développement et vaccins »
'use strict';

/* ========= SYNCHRONISATION GOOGLE SHEETS (facultative) =========
 * API_URL : URL « /exec » de l'Apps Script (voir apps-script/Code.gs et le README).
 * La clé secrète n'est jamais dans le code : elle va dans le lien, https://…github.io/desarrollo-infantil/#k=TA_CLE
 * Sans API_URL ou sans clé, tout reste seulement sur le téléphone.
 */
const API_URL = 'https://script.google.com/macros/s/AKfycbz0swANagnjPZErft_7n6CYePFPgfyi6n7pzJ9W1VZf5R4cuHqo_N08Q_RHxirc5pGV/exec';
/* =============================================================== */
// ---------- Données ----------
// Items : [catégorie, n°, âge 50 %, âge 75 %, âge 95 % (mois), fr, es]
// Lus sur l'échelle Haizea-Llevant : début de barre = 50 %, passage blanc/gris = 75 %, fin = 95 %.
// null = au-delà de 60 mois (barre coupée par le bord du tableau).
// Alertes : [« sa », code, début, fin (mois), fr, es]
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
['soc',1,1,1,3,'Réagit à la voix','Reacciona a la voz'],
['soc',2,1,2,3,'Sourit à la mère / au père','Sonríe a la madre / al padre'],
['soc',3,2,3,4.5,'Reconnaît le biberon','Reconoce el biberón'],
['soc',4,2,3,4.5,'Regarde ses mains','Se mira las manos'],
['soc',5,2.5,3,4.5,'Poursuite optique verticale','Seguimiento óptico vertical'],
['soc',6,3.5,4,5.5,'Poursuite optique horizontale','Seguimiento óptico horizontal'],
['soc',7,6,6.5,8,'Cherche un objet tombé','Busca un objeto caído'],
['soc',8,5.5,7,8,'Mange un biscuit','Come una galleta'],
['soc',9,6.5,8,12,'Joue à cache-cache','Juega al escondite'],
['soc',10,7.5,8.5,10.5,'Cherche un objet disparu','Busca un objeto desaparecido'],
['soc',11,9,11,13,'Imite des gestes simples','Imita gestos sencillos'],
['soc',12,8,13,16,'Aide quand on l’habille','Ayuda cuando lo visten'],
['soc',13,12,14,17.5,'Porte un verre à la bouche','Se lleva un vaso a la boca'],
['soc',14,14,15.5,18.5,'Imite les tâches ménagères','Imita tareas del hogar'],
['soc',15,14,16,21,'Mange à la cuillère','Come con cuchara'],
['soc',16,16,21,26,'Aide à ranger les jouets','Ayuda a recoger los juguetes'],
['soc',17,18,26,30,'Donne à manger aux poupées','Da de comer a los muñecos'],
['soc',18,20,26,31,'Enlève son pantalon','Se quita los pantalones'],
['soc',19,28,33,38,'Dramatise des séquences','Dramatiza secuencias'],
['soc',20,28,36,43,'Enfile des vêtements ouverts','Se pone prendas abiertas'],
['soc',21,29,31,38,'Va aux toilettes','Va al váter'],
['soc',22,34,39,46,'Déboutonne ses boutons','Se desabrocha los botones'],
['soc',23,34,38,48,'Manipule des marionnettes','Manipula marionetas'],
['soc',24,40,47,54,'Rend la nourriture comestible','Hace comestible la comida'],
['soc',25,49,52,60,'Dessine une personne','Dibuja una persona'],
// Langage
['lang',26,2,2,5,'Est attentif à la conversation','Presta atención a la conversación'],
['lang',27,3,4,5.5,'Fait des rires','Hace risas'],
['lang',28,5.5,6,8,'Babille','Balbucea'],
['lang',29,7.5,8.5,9.5,'Ma-ma / pa-pa non spécifique','Ma-ma / pa-pa inespecífico'],
['lang',30,8.5,10.5,15,'Comprend une interdiction','Comprende una prohibición'],
['lang',31,9,10.5,12,'Reconnaît son prénom','Reconoce su nombre'],
['lang',32,10,11,13.5,'Comprend le sens de quelques mots','Comprende el significado de algunas palabras'],
['lang',33,10.5,14,18.5,'Obéit à un ordre donné par gestes','Obedece una orden por gestos'],
['lang',34,11.5,13,16,'Dit maman / papa','Dice mamá / papá'],
['lang',35,17,20,24,'Utilise un mot','Utiliza una palabra'],
['lang',36,17,21,24,'Montre une partie du corps','Señala una parte del cuerpo'],
['lang',37,19,23,25,'Nomme un objet dessiné','Nombra un objeto dibujado'],
['lang',38,19,22,25,'Exécute 2 ordres','Ejecuta 2 órdenes'],
['lang',39,21,23,25,'Combine 2 mots','Combina 2 palabras'],
['lang',40,22,23,36,'Utilise des pronoms','Utiliza pronombres'],
['lang',41,22,28,33,'Nomme 5 images','Nombra 5 imágenes'],
['lang',42,25,29,35,'Identifie des objets par leur usage','Identifica objetos por su uso'],
['lang',43,27,31,34,'Phrases de 3 mots','Frases de 3 palabras'],
['lang',44,27,31,39,'Mémorise une image simple','Memoriza una imagen sencilla'],
['lang',45,29,35,41,'Compte jusqu’à 2','Cuenta hasta 2'],
['lang',46,29,34,41,'Nomme 10 images','Nombra 10 imágenes'],
['lang',47,30,35,43,'Utilise le verbe « être »','Utiliza el verbo ser'],
['lang',48,33,36,44,'Distingue long et court','Distingue largo y corto'],
['lang',49,34,41,47,'Répond de façon cohérente','Responde coherentemente'],
['lang',50,37,41,44,'Reconnaît les couleurs','Reconoce colores'],
['lang',51,37,43,50,'Fait des actions sans lien entre elles','Hace acciones inconexas'],
['lang',52,40,44,51,'Nomme les couleurs','Denomina colores'],
['lang',53,44,50,56,'Distingue matin et après-midi','Distingue mañana y tarde'],
['lang',54,48,55,60,'Raconte des histoires','Explica historias'],
['lang',55,53,null,null,'Répète des phrases','Repite frases'],
['lang',56,53,null,null,'Reconnaît les nombres','Reconoce números'],
// Manipulation
['man',57,2,3,4,'Joint les mains','Junta las manos'],
['man',58,4,4.5,6,'Dirige la main vers un objet','Dirige la mano a un objeto'],
['man',59,5.5,6,8,'Change un objet de main','Cambia objetos de mano'],
['man',60,5.5,6.5,7.5,'Retire un mouchoir de son visage','Se quita un pañuelo de la cara'],
['man',61,7,8,10,'Pince inférieure','Pinza inferior'],
['man',62,8.5,11.5,13.5,'Pince supérieure','Pinza superior'],
['man',63,10,12.5,16,'Montre avec l’index','Señala con el índice'],
['man',64,13,15,22,'Fait des gribouillis spontanés','Hace garabatos espontáneamente'],
['man',65,15,16,21,'Tourne les pages librement','Pasa páginas libremente'],
['man',66,15,16.5,21,'Tour de 2 cubes','Torre de 2 cubos'],
['man',67,16,20,25,'Met le capuchon d’un stylo','Tapa un bolígrafo'],
['man',68,17,20,24,'Tour de 4 cubes','Torre de 4 cubos'],
['man',69,27,30,37,'Tient un crayon','Agarra un lápiz'],
['man',70,30,34,43,'Copie un cercle','Copia un círculo'],
['man',71,31,37,42,'Reproduit un pont','Reproduce un puente'],
['man',72,40,50,56,'Plie un papier','Dobla un papel'],
['man',73,42,48,55,'Coupe avec des ciseaux','Corta con tijeras'],
['man',74,42,51,55,'Copie un carré','Copia un cuadrado'],
['man',75,46,51,56,'Reproduit une porte','Reproduce una puerta'],
// Posture
['post',76,1,1,3.5,'Redressement de la tête (sur le ventre)','Enderezamiento cefálico (decúbito prono)'],
['post',77,2,3,4,'Passe à la position assise','Pasa a sentarse'],
['post',78,2,3,5,'Se redresse sur les avant-bras (sur le ventre)','Se apoya en los antebrazos (decúbito prono)'],
['post',79,4,5,7.5,'Flexion de la tête','Flexión cefálica'],
['post',80,6,7,9,'Se retourne du ventre au dos','Se da la vuelta de decúbito prono a supino'],
['post',81,6.5,7,9,'Réactions parachute latérales','Reacciones paracaídas laterales'],
['post',82,7.5,8,9.5,'Position assise stable','Sedestación estable'],
['post',83,8,9,11,'Se tient debout avec appui','Se mantiene de pie con apoyo'],
['post',84,9,10.5,13,'Passe à la position assise sans aide','Pasa a sentarse sin ayuda'],
['post',85,12,13,15.5,'Fait 5 pas seul','Da 5 pasos solo'],
['post',86,13,14,16,'Marche libre','Marcha libre'],
['post',87,13,14.5,16.5,'Se met debout sans appui','Se pone de pie sin apoyo'],
['post',88,15,16,20,'Court librement','Carrera libre'],
['post',89,15,17,22,'Marche à reculons','Camina hacia atrás'],
['post',90,20,21,25,'Descend les escaliers','Baja escaleras'],
['post',91,21,22.5,26,'Tape dans un ballon','Chuta una pelota'],
['post',92,22,28,37,'Saute en avant','Salta hacia delante'],
['post',93,27,34,41,'Tient sur un pied','Se aguanta sobre un pie'],
['post',94,30,34,43,'Saute à pieds joints','Salta con los pies juntos'],
['post',95,38,45,50,'Saute en arrière','Salta hacia atrás'],
['post',96,41,45,53,'Équilibre sur un pied','Equilibrio sobre un pie'],
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
     '³ Méningocoque conjugué tétravalent (ACWY) : à vacciner les adolescents de 11-12 ans qui n’ont reçu aucune dose du vaccin ACWY à partir de 10 ans. Rattrapage jusqu’à 18 ans inclus.',
     '⁴ Hépatite A et varicelle : seulement à 11-12 ans pour les enfants non immunisés (non vaccinés ou sans antécédent de la maladie) ou partiellement vaccinés (le schéma compte deux doses).',
     'Note : la vaccination contre le SARS-CoV-2 est recommandée chaque année à l’automne, selon les recommandations en vigueur (plus de 60 ans et autres personnes à risque).',
     'Le calendrier comporte aussi une colonne « Herpès zoster » sans case colorée sur la photo.'],
 es:['¹ Inmunización de todos los lactantes menores de 12 meses, en su primera temporada epidémica del VRS. Nacidos antes del inicio de la temporada (abril a septiembre): en septiembre-octubre. Nacidos durante la temporada (octubre a marzo): preferentemente antes del alta de la maternidad.',
     '² Vacunación contra el rotavirus a partir de los 2 meses de edad, según la pauta de la vacuna disponible.',
     '³ Meningococo conjugada tetravalente (ACWY): se vacunan los adolescentes de 11-12 años que no hayan recibido ninguna dosis de la vacuna ACWY a partir de los 10 años. Rescate hasta los 18 años inclusive.',
     '⁴ Hepatitis A y varicela: solo a los 11-12 años en niños no inmunizados (no vacunados o sin antecedentes de la enfermedad) o parcialmente vacunados (la pauta consta de dos dosis).',
     'Nota: se recomienda la vacunación contra el SARS-CoV-2 cada año durante la campaña de otoño, según las recomendaciones vigentes (mayores de 60 años y otras personas con condiciones de riesgo).',
     'El calendario incluye también una columna «Herpes zóster» sin casilla coloreada en la foto.']
};
const BANDS = [[0,3],[3,6],[6,12],[12,24],[24,36],[36,60],[60,9999]];

// ---------- Textes de l'interface ----------
const T = {
 fr:{
  title:'Développement et vaccins', birth:'Né(e) le', ageIs:'a', q:'Rechercher (ex. marche, mots, hexavalent)…',
  filters:'Filtres', l1:'Catégorie', l2:'Âge d’apparition', l3:'Statut', all:'Toutes', allAge:'Tous âges',
  stAll:'Tous', stTodo:'Non acquis', stDone:'Acquis', viewSoon:'Bientôt', viewAll:'Tout',
  tabLearn:'Apprentissages', tabSa:'Alertes', tabVac:'Vaccins',
  mo:'mois', mo1:'mois', yr:'ans', yr1:'an', day:'jours', day1:'jour', and:'et',
  after60:'la plupart après 60 mois', between:'entre', and2:'et',
  legend:'« vers » : 50 % des enfants le font · « la plupart » : 95 %',
  items:'éléments', one:'élément', none:'Aucun résultat.', acquired:'acquis', doneV:'faits',
  doneOn:'acquis le', doneOnV:'fait le', doneNoDate:'acquis', doneNoDateV:'fait', mark:'Marquer comme acquis',
  sNow:'En cours d’acquisition', sSoon:'Arrive dans les 3 prochains mois', sCheck:'À vérifier',
  sCheckHint:'La plupart des enfants (95 %) le font déjà à cet âge. Coche-le s’il est acquis ; sinon, parles-en au pédiatre.',
  sSaNow:'À surveiller à cet âge', sSaHint:'À signaler au pédiatre si l’un de ces signes est présent.',
  sVacNow:'À faire maintenant', sVacSoon:'Dans les 3 prochains mois', sVacCheck:'Doses passées non cochées',
  tags:{it:{now:'en cours',soon:'bientôt',check:'à vérifier'},vac:{now:'à faire',soon:'bientôt',check:'non cochée'},sa:{now:'à cet âge'}},
  alertTag:'à signaler si présent',
  needAge:'Indique la date de naissance pour voir ce qui est en cours et ce qui arrive bientôt.',
  nothingSoon:'Rien de prévu dans cette période.', reset:'Tout décocher', confirmReset:'Décocher tous les éléments ?',
  notes:'Notes du calendrier vaccinal',
  syncOk:'☁ Synchronisé avec Google Sheets', syncSaving:'Enregistrement…', syncOffline:'Hors ligne : sera envoyé plus tard', syncError:'Synchronisation refusée : vérifie la clé du lien',
  src:'Sources : échelle Haizea-Llevant (modifiée d’après Fernández Álvarez E. et al., Tabla de desarrollo 0-5 años, Gobierno Vasco, 1991) et calendrier de vaccinations et immunisations systématiques de la Generalitat de Catalunya (061 Salut Respon, canalsalut.gencat.cat). Âges lus sur l’échelle : début de la barre = 50 % des enfants, fin = 95 %. Indicatif, ne remplace pas l’avis du pédiatre. Les données restent sur ce téléphone.'
 },
 es:{
  title:'Desarrollo y vacunas', birth:'Nació el', ageIs:'tiene', q:'Buscar (p. ej. marcha, palabras, hexavalente)…',
  filters:'Filtros', l1:'Categoría', l2:'Edad de aparición', l3:'Estado', all:'Todas', allAge:'Todas las edades',
  stAll:'Todos', stTodo:'No adquiridos', stDone:'Adquiridos', viewSoon:'Pronto', viewAll:'Todo',
  tabLearn:'Aprendizajes', tabSa:'Alertas', tabVac:'Vacunas',
  mo:'meses', mo1:'mes', yr:'años', yr1:'año', day:'días', day1:'día', and:'y',
  after60:'la mayoría después de los 60 meses', between:'entre', and2:'y',
  legend:'«hacia»: 50 % de los niños lo hacen · «la mayoría»: 95 %',
  items:'elementos', one:'elemento', none:'Sin resultados.', acquired:'adquiridos', doneV:'hechas',
  doneOn:'adquirido el', doneOnV:'hecha el', doneNoDate:'adquirido', doneNoDateV:'hecha', mark:'Marcar como adquirido',
  sNow:'En proceso de adquisición', sSoon:'Llega en los próximos 3 meses', sCheck:'A revisar',
  sCheckHint:'La mayoría de los niños (95 %) ya lo hacen a esta edad. Márcalo si ya lo hace; si no, coméntalo con el pediatra.',
  sSaNow:'A vigilar a esta edad', sSaHint:'Avisar al pediatra si alguna de estas señales está presente.',
  sVacNow:'A poner ahora', sVacSoon:'En los próximos 3 meses', sVacCheck:'Dosis pasadas sin marcar',
  tags:{it:{now:'en curso',soon:'pronto',check:'a revisar'},vac:{now:'pendiente',soon:'pronto',check:'sin marcar'},sa:{now:'a esta edad'}},
  alertTag:'avisar si está presente',
  needAge:'Indica la fecha de nacimiento para ver lo que está en curso y lo que llega pronto.',
  nothingSoon:'Nada previsto en este periodo.', reset:'Desmarcar todo', confirmReset:'¿Desmarcar todos los elementos?',
  notes:'Notas del calendario de vacunación',
  syncOk:'☁ Sincronizado con Google Sheets', syncSaving:'Guardando…', syncOffline:'Sin conexión: se enviará más tarde', syncError:'Sincronización rechazada: revisa la clave del enlace',
  src:'Fuentes: escala Haizea-Llevant (modificada de Fernández Álvarez E. y cols., Tabla de desarrollo 0-5 años, Gobierno Vasco, 1991) y calendario de vacunaciones e inmunizaciones sistemáticas de la Generalitat de Catalunya (061 Salut Respon, canalsalut.gencat.cat). Edades leídas en la escala: inicio de la barra = 50 % de los niños, final = 95 %. Orientativo, no sustituye la opinión del pediatra. Los datos se quedan en este teléfono.'
 }
};

// ---------- Stockage sur le téléphone ----------
const WINDOW=3; // mois
const KEY={lang:'dev-lang',birth:'dev-birth',age:'dev-age',view:'dev-view',done:'dev-done',tab:'dev-tab'};
const store={
  get(k){try{return localStorage.getItem(k);}catch(e){return null;}},
  set(k,v){try{localStorage.setItem(k,v);}catch(e){}},
  del(k){try{localStorage.removeItem(k);}catch(e){}}
};

// ---------- Dates ----------
const DAY=86400000, MONTH_DAYS=30.4375;
const pad=n=>String(n).padStart(2,'0');
const toISO=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const parseISO=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d);};
const isISO=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s);
const todayISO=()=>toISO(new Date());

// ---------- État ----------
let lang=store.get(KEY.lang)==='es'?'es':'fr';
let birth=isISO(store.get(KEY.birth))?store.get(KEY.birth):null;
if(!birth){ // reprise de l'ancien réglage « âge en mois »
  const a=parseFloat(store.get(KEY.age));
  if(isFinite(a)&&a>=0&&a<=216){const d=new Date();d.setDate(d.getDate()-Math.round(a*MONTH_DAYS));birth=toISO(d);store.set(KEY.birth,birth);}
}
let done=(()=>{ // clé -> date « AAAA-MM-JJ » ('' si cochée avant l'ajout des dates)
  try{const v=JSON.parse(store.get(KEY.done)||'{}');
    if(Array.isArray(v)){const o={};v.forEach(k=>o[k]='');return o;}
    return v&&typeof v==='object'?v:{};}catch(e){return {};}
})();
const saveDone=()=>store.set(KEY.done,JSON.stringify(done));
const isDone=e=>Object.prototype.hasOwnProperty.call(done,e.key);
let view=['all','soon'].includes(store.get(KEY.view))?store.get(KEY.view):(birth?'soon':'all');
let tab=['learn','sa','vac'].includes(store.get(KEY.tab))?store.get(KEY.tab):'learn';
let cat='all', band=-1, status='all', q='';

const $=id=>document.getElementById(id);
const num=x=>Number.isInteger(x)?String(x):String(x).replace('.',',');
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
const plural=(n,one,many)=>n+' '+(n===1?one:many);

// Âge exact à partir de la date de naissance
function age(){
  if(!birth) return null;
  const b=parseISO(birth), t=new Date(); t.setHours(0,0,0,0);
  if(t<b) return {m:0,d:0,total:0};
  let m=(t.getFullYear()-b.getFullYear())*12+(t.getMonth()-b.getMonth());
  let anchor=new Date(b.getFullYear(),b.getMonth()+m,b.getDate());
  if(anchor>t){m--;anchor=new Date(b.getFullYear(),b.getMonth()+m,b.getDate());}
  const d=Math.round((t-anchor)/DAY);
  return {m,d,total:m+d/MONTH_DAYS};
}
function ageText(a){
  const t=T[lang];
  if(a.m<24){
    const mm=plural(a.m,t.mo1,t.mo);
    return a.d?`${mm} ${t.and} ${plural(a.d,t.day1,t.day)}`:mm;
  }
  const y=Math.floor(a.m/12), r=a.m%12, yy=plural(y,t.yr1,t.yr);
  return r?`${yy} ${t.and} ${plural(r,t.mo1,t.mo)}`:yy;
}
const fmtM=m=>num(m)+' '+(m===1?T[lang].mo1:T[lang].mo);
// « vers 6 mois » / « hacia los 6 meses » ; « la plupart à 9 mois » / « la mayoría a los 9 meses »
const at50=m=>lang==='fr'?'vers '+fmtM(m):(m===1?'hacia el primer mes':'hacia los '+fmtM(m));
const at95=m=>lang==='fr'?'la plupart à '+fmtM(m):(m===1?'la mayoría al mes':'la mayoría a los '+fmtM(m));
const fmtDate=s=>parseISO(s).toLocaleDateString(lang==='fr'?'fr-FR':'es-ES',{day:'2-digit',month:'2-digit',year:'numeric'});
const bandLbl=b=>{const t=T[lang],[s,e]=b,f=m=>m>=24?(m/12)+' '+t.yr:m+' '+t.mo;
  return e>=9999?'5 '+t.yr+' +':f(s)+' – '+f(e);};
const bandOf=a=>BANDS.findIndex(b=>a>=b[0]&&a<b[1]);

// ---------- Liste complète ----------
const ALL=[];
for(const r of I){
  if(r[0]==='sa') ALL.push({k:'sa',cat:'sa',key:'s'+r[1],a:r[2],b:r[3],fr:r[4],es:r[5]});
  else ALL.push({k:'it',cat:r[0],key:'i'+r[1],a:r[2],p75:r[3],p95:r[4],fr:r[5],es:r[6]});
}
for(const v of V) ALL.push({k:'vac',cat:'vac',key:'v'+v[0],a:v[0],until:v[0]===6?59:v[0]+WINDOW,lab:v,list:v[3]});
ALL.sort((x,y)=>x.a-y.a||(x.p95??99)-(y.p95??99));
const trackable=e=>e.k!=='sa';
const tabOf=e=>e.k==='it'?'learn':e.k;
const TAB_COL={learn:'var(--accent)',sa:'var(--sa)',vac:'var(--vac)'};

// ---------- Où en est l'enfant pour chaque élément ----------
function phase(e,A){ // now | soon | check | null
  if(A===null) return null;
  if(e.k==='sa') return (A>=e.a&&A<=e.b)?'now':null;
  if(e.k==='it'){
    if(e.p95!==null&&A>e.p95) return isDone(e)?null:'check';
    if(A>=e.a) return 'now';
    return e.a-A<=WINDOW?'soon':null;
  }
  if(A>=e.a&&A<=e.until) return 'now';
  if(e.a>A&&e.a-A<=WINDOW) return 'soon';
  return (A>e.until&&!isDone(e))?'check':null;
}

// ---------- Construction de l'interface ----------
function buildChips(){
  const t=T[lang];
  const chip=(attr,val,label,col)=>`<button class="chip" type="button" ${attr}="${val}" style="--c:${col}">${label}</button>`;
  $('tabs').innerHTML=[['learn',t.tabLearn],['sa',t.tabSa],['vac',t.tabVac]].map(([k,l])=>chip('data-t',k,l,TAB_COL[k])).join('');
  $('cats').innerHTML=chip('data-c','all',t.all,'var(--accent)')+['soc','lang','man','post'].map(c=>chip('data-c',c,CATS[c][lang],CATS[c].col)).join('');
  const bandCols=['var(--soc)','var(--lang)','var(--man)','var(--post)','var(--vac)','var(--sa)','var(--accent)'];
  $('ages').innerHTML=chip('data-b','-1',t.allAge,'var(--accent)')+BANDS.map((b,i)=>chip('data-b',i,bandLbl(b),bandCols[i])).join('');
  $('sts').innerHTML=[['all',t.stAll,'var(--accent)'],['todo',t.stTodo,'var(--soc)'],['done',t.stDone,'var(--man)']].map(([k,l,c])=>chip('data-s',k,l,c)).join('');
}
function statics(){
  const t=T[lang];
  document.documentElement.lang=lang; document.title=t.title;
  $('title').textContent=t.title; $('q').placeholder=t.q; $('birthLabel').textContent=t.birth;
  $('fsum').textContent=t.filters; $('l1').textContent=t.l1; $('l2').textContent=t.l2; $('l3').textContent=t.l3;
  $('vSoon').textContent=t.viewSoon; $('vAll').textContent=t.viewAll;
  $('reset').textContent=t.reset; $('src').textContent=t.src;
  $('birth').max=todayISO();
}
function pressed(){
  const set=(sel,fn)=>document.querySelectorAll(sel).forEach(b=>b.setAttribute('aria-pressed',fn(b)));
  set('[data-t]',b=>b.dataset.t===tab); set('[data-c]',b=>b.dataset.c===cat);
  set('[data-b]',b=>+b.dataset.b===band); set('[data-s]',b=>b.dataset.s===status);
  set('[data-v]',b=>b.dataset.v===view); set('.lang button',b=>b.dataset.l===lang);
}

// ---------- Cartes ----------
function card(e,A){
  const t=T[lang], col=CATS[e.cat].col, ph=phase(e,A), d=isDone(e);
  const tag=ph?`<span class="tag ${ph}">${t.tags[e.k][ph]}</span>`:'';
  const box=trackable(e)?`<input type="checkbox" class="ck" data-k="${e.key}" ${d?'checked':''} aria-label="${t.mark}">`:'';
  const when=d?`<span class="when">✓ ${done[e.key]?(e.k==='vac'?t.doneOnV:t.doneOn)+' '+fmtDate(done[e.key]):(e.k==='vac'?t.doneNoDateV:t.doneNoDate)}</span>`:'';
  const cls=`card${d?' is-done':''}${ph?' ph-'+ph:''}`;
  let body;
  if(e.k==='vac'){
    body=`<strong>${lang==='fr'?e.lab[1]:e.lab[2]}</strong>${tag}<ul class="vlist">${e.list.map(x=>`<li>${x[lang==='fr'?0:1]}</li>`).join('')}</ul>${when}`;
  } else if(e.k==='sa'){
    body=`${e[lang]}${tag}<span class="meta">${t.between} ${num(e.a)} ${t.and2} ${fmtM(e.b)} · ${t.alertTag}</span>`;
  } else {
    const p95=e.p95===null?t.after60:at95(e.p95);
    body=`${e[lang]}${tag}<span class="meta">${at50(e.a)} · ${p95}</span><span class="cat">${CATS[e.cat][lang]}</span>${when}`;
  }
  const tagName=trackable(e)?'label':'div';
  return `<${tagName} class="${cls}" style="--c:${col}">${box}<div class="t">${body}</div></${tagName}>`;
}

// ---------- Rendu ----------
function render(){
  const t=T[lang], a=age(), A=a?a.total:null, nq=norm(q.trim()), soonView=view==='soon';
  $('ageTxt').textContent=a?`${t.ageIs} ${ageText(a)}`:'';
  $('needAge').hidden=!(soonView&&A===null); $('needAge').textContent=t.needAge;
  $('catBlock').hidden=tab!=='learn'; $('stBlock').hidden=tab==='sa'; $('ageBlock').hidden=soonView;
  const rows=ALL.filter(e=>{
    if(tabOf(e)!==tab) return false;
    if(soonView&&(A===null||!phase(e,A))) return false;
    if(tab==='learn'&&cat!=='all'&&e.cat!==cat) return false;
    if(!soonView&&band!==-1&&bandOf(e.a)!==band) return false;
    if(trackable(e)&&status!=='all'&&(status==='done')!==isDone(e)) return false;
    if(nq){
      const txt=e.k==='vac'?e.list.map(x=>x.join(' ')).join(' ')+' '+e.lab[1]+' '+e.lab[2]:e.fr+' '+e.es;
      if(!norm(txt).includes(nq)) return false;
    }
    return true;
  });
  const mine=ALL.filter(e=>tabOf(e)===tab&&trackable(e)), nd=mine.filter(isDone).length;
  $('count').textContent=`${rows.length} ${rows.length===1?t.one:t.items}`+(mine.length?` · ${nd}/${mine.length} ${tab==='vac'?t.doneV:t.acquired}`:'');
  $('legend').hidden=tab!=='learn'; $('legend').textContent=t.legend;
  let html='';
  if(soonView&&A!==null){
    const S={learn:[['check',t.sCheck,t.sCheckHint,true],['now',t.sNow],['soon',t.sSoon]],
             sa:[['now',t.sSaNow,t.sSaHint]],
             vac:[['now',t.sVacNow],['soon',t.sVacSoon],['check',t.sVacCheck,'',true]]}[tab];
    for(const [ph,label,hint,fold] of S){
      const g=rows.filter(e=>phase(e,A)===ph).sort((x,y)=>isDone(x)-isDone(y));
      if(!g.length) continue;
      const inner=(hint?`<p class="hint">${hint}</p>`:'')+g.map(e=>card(e,A)).join('');
      html+=fold?`<details class="fold ph-${ph}"><summary>${label} (${g.length})</summary>${inner}</details>`
                :`<h2>${label} <span class="n">${g.length}</span></h2>${inner}`;
    }
    if(!html) html=`<div class="empty">${t.nothingSoon}</div>`;
  } else if(!soonView){
    let last=-2;
    for(const e of rows){
      const bi=bandOf(e.a);
      if(bi!==last){last=bi;html+=`<h2>${bandLbl(BANDS[bi])}</h2>`;}
      html+=card(e,A);
    }
    if(!rows.length) html=`<div class="empty">${t.none}</div>`;
  }
  $('list').innerHTML=html;
  const n=$('notes'), showNotes=tab==='vac'&&!soonView;
  n.hidden=!showNotes;
  if(showNotes) n.innerHTML=`<strong>${t.notes}</strong>`+NOTES[lang].map(x=>`<p>${x}</p>`).join('');
  $('reset').hidden=!Object.keys(done).length;
  pressed();
}

// ---------- Synchronisation Google Sheets ----------
// Tout s'applique d'abord sur le téléphone ; les changements partent ensuite dans une file
// (gardée sur le téléphone) et sont renvoyés dès que la connexion revient. La Sheet fait foi.
const SKEY={key:'dev-sync-key',queue:'dev-sync-queue',synced:'dev-synced'};
function syncKey(){
  const h=new URLSearchParams(location.hash.slice(1)).get('k');
  if(h){store.set(SKEY.key,h);return h;}
  return store.get(SKEY.key)||'';
}
const SYNC=!!API_URL&&!!syncKey();
let syncQueue=(()=>{try{const q=JSON.parse(store.get(SKEY.queue)||'[]');return Array.isArray(q)?q:[];}catch(e){return [];}})();
let syncState=null, flushing=false;
const saveQueue=()=>store.set(SKEY.queue,JSON.stringify(syncQueue));
function labelOf(key){
  const e=ALL.find(x=>x.key===key); if(!e) return key;
  return e.k==='vac'?CATS.vac.fr+' · '+e.lab[1]:CATS[e.cat].fr+' · '+e.fr;
}
function setSync(st){
  syncState=st; const el=$('sync'); if(!el) return;
  el.hidden=!SYNC||!st; el.className='sync '+(st||'');
  if(st) el.textContent=T[lang]['sync'+st.charAt(0).toUpperCase()+st.slice(1)];
}
function pushSync(op){ if(!SYNC) return; syncQueue.push(op); saveQueue(); flush(); }
function applyServer(j){
  done=j.done&&typeof j.done==='object'?j.done:{}; saveDone();
  birth=isISO(j.birth)?j.birth:null;
  if(birth) store.set(KEY.birth,birth); else store.del(KEY.birth);
  $('birth').value=birth||'';
  render();
}
async function flush(){
  if(!SYNC||flushing) return; flushing=true;
  try{
    while(syncQueue.length){
      setSync('saving');
      let j;
      try{
        const r=await fetch(API_URL,{method:'POST',body:JSON.stringify({k:syncKey(),...syncQueue[0]})}); // text/plain : pas de pré-requête CORS
        j=await r.json();
      }catch(e){ setSync('offline'); return; }
      if(j.error==='unauthorized'){ setSync('error'); return; }
      syncQueue.shift(); saveQueue();          // une opération refusée pour une autre raison est abandonnée
      if(!j.error&&!syncQueue.length) applyServer(j);
    }
    setSync('ok');
  } finally { flushing=false; }
}
async function pull(){
  if(!SYNC) return;
  if(syncQueue.length) return flush();        // envoyer d'abord ce qui attend
  setSync('saving');
  let j;
  try{ j=await (await fetch(`${API_URL}?k=${encodeURIComponent(syncKey())}&t=${Date.now()}`)).json(); }
  catch(e){ setSync('offline'); return; }
  if(j.error){ setSync(j.error==='unauthorized'?'error':'offline'); return; }
  if(syncQueue.length) return flush();        // l'utilisateur a modifié entre-temps
  const empty=!Object.keys(j.done||{}).length&&!j.birth;
  if(empty&&!store.get(SKEY.synced)&&(Object.keys(done).length||birth)){
    // première synchronisation : on envoie ce qui était déjà sur le téléphone
    store.set(SKEY.synced,'1');
    const items={}; for(const k in done) items[k]={date:done[k],label:labelOf(k)};
    return pushSync({action:'import',done:items,birth:birth||''});
  }
  store.set(SKEY.synced,'1');
  applyServer(j); setSync('ok');
}
window.addEventListener('online',()=>flush());
document.addEventListener('visibilitychange',()=>{ if(!document.hidden) pull(); });

// ---------- Événements ----------
document.addEventListener('click',e=>{
  const b=e.target.closest('button'); if(!b) return;
  if(b.dataset.l){lang=b.dataset.l;store.set(KEY.lang,lang);statics();buildChips();setSync(syncState);}
  else if(b.dataset.t){tab=b.dataset.t;store.set(KEY.tab,tab);}
  else if(b.dataset.c) cat=b.dataset.c;
  else if(b.dataset.b!==undefined) band=+b.dataset.b;
  else if(b.dataset.s) status=b.dataset.s;
  else if(b.dataset.v){view=b.dataset.v;store.set(KEY.view,view);}
  else if(b.id==='reset'){ if(confirm(T[lang].confirmReset)){done={};saveDone();pushSync({action:'reset'});} }
  else return;
  render();
});
document.addEventListener('change',e=>{
  const c=e.target.closest('.ck'); if(!c) return;
  const k=c.dataset.k;
  if(c.checked){ done[k]=todayISO(); pushSync({action:'set',key:k,date:done[k],label:labelOf(k)}); }
  else { delete done[k]; pushSync({action:'unset',key:k}); }
  saveDone(); render();
});
$('birth').addEventListener('change',e=>{
  const v=e.target.value;
  if(isISO(v)&&v<=todayISO()){
    birth=v; store.set(KEY.birth,v); store.del(KEY.age); pushSync({action:'birth',birth:v});
    if(store.get(KEY.view)===null) view='soon';
  } else if(!v){ birth=null; store.del(KEY.birth); pushSync({action:'birth',birth:''}); }
  render();
});
$('q').addEventListener('input',e=>{q=e.target.value;render();});

statics(); buildChips(); if(birth) $('birth').value=birth; render(); pull();
