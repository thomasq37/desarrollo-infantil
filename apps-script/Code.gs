/**
 * Desarrollo infantil — stockage des cases cochées dans une Google Sheet.
 *
 * Installation : voir le README du dépôt (section « Synchronisation Google Sheets »).
 * Propriété du script obligatoire : KEY = la clé secrète mise dans le lien (#k=…).
 *
 * Onglet « Acquis »   : clé | élément | date   (une ligne par élément coché)
 * Onglet « Réglages » : réglage | valeur       (ligne « naissance »)
 */
const SHEET_DONE = 'Acquis';
const SHEET_CFG = 'Réglages';

function doGet(e) {
  return handle_(e.parameter.k, () => state_());
}

function doPost(e) {
  let body = {};
  try { body = JSON.parse((e.postData && e.postData.contents) || '{}'); } catch (err) { return out_({ error: 'json' }); }
  return handle_(body.k, () => { apply_(body); return state_(); });
}

function handle_(k, fn) {
  const key = PropertiesService.getScriptProperties().getProperty('KEY');
  if (!key || k !== key) return out_({ error: 'unauthorized' });
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try { return out_(fn()); }
  catch (err) { return out_({ error: String(err && err.message || err) }); }
  finally { lock.releaseLock(); }
}

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function sheet_(name, header) {
  const ss = SpreadsheetApp.getActive();
  let s = ss.getSheetByName(name);
  if (!s) {
    s = ss.insertSheet(name);
    s.appendRow(header);
    s.setFrozenRows(1);
    s.getRange(1, 1, 1, header.length).setFontWeight('bold');
  }
  return s;
}
const doneSheet_ = () => sheet_(SHEET_DONE, ['clé', 'élément', 'date']);
const cfgSheet_ = () => sheet_(SHEET_CFG, ['réglage', 'valeur']);

// Les dates sont écrites en texte « 2026-10-31 » (format de cellule « texte brut ») :
// aucune conversion de fuseau horaire, et la page relit exactement ce qu'elle a envoyé.
const isIso_ = s => /^\d{4}-\d{2}-\d{2}$/.test(String(s || ''));
const pad_ = n => String(n).padStart(2, '0');
function writeDate_(range, iso) {
  range.setNumberFormat('@').setValue(isIso_(iso) ? iso : '');
}
// Relit aussi les anciennes cellules au format date, ou une date tapée à la main (15/12/2025)
function fromCell_(v, shown) {
  if (v && typeof v.getTime === 'function') return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const s = String(shown !== undefined && shown !== '' ? shown : v).trim();
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return m[1] + '-' + pad_(m[2]) + '-' + pad_(m[3]);
  m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return m[3] + '-' + pad_(m[2]) + '-' + pad_(m[1]);
  return '';
}

function rows_(s) {
  const n = s.getLastRow() - 1;
  if (n <= 0) return [];
  const rng = s.getRange(2, 1, n, Math.max(3, s.getLastColumn()));
  const v = rng.getValues(), d = rng.getDisplayValues();
  return v.map((r, i) => ({ v: r, d: d[i] }));
}
function findRow_(s, key) {
  const keys = rows_(s).map(r => String(r.v[0]));
  const i = keys.indexOf(String(key));
  return i < 0 ? -1 : i + 2;
}

function state_() {
  const done = {};
  rows_(doneSheet_()).forEach(r => { if (r.v[0]) done[String(r.v[0])] = fromCell_(r.v[2], r.d[2]); });
  let birth = null;
  rows_(cfgSheet_()).forEach(r => { if (String(r.v[0]).trim() === 'naissance') birth = fromCell_(r.v[1], r.d[1]) || null; });
  return { done: done, birth: birth, updated: new Date().toISOString() };
}

function setDone_(s, key, date, label) {
  let row = findRow_(s, key);
  if (row < 0) { s.appendRow([key, label || key, '']); row = s.getLastRow(); }
  else s.getRange(row, 1, 1, 2).setValues([[key, label || key]]);
  writeDate_(s.getRange(row, 3), date);
}

function setBirth_(iso) {
  const s = cfgSheet_();
  let row = findRow_(s, 'naissance');
  if (row < 0) { s.appendRow(['naissance', '']); row = s.getLastRow(); }
  writeDate_(s.getRange(row, 2), iso);
}

function apply_(b) {
  const s = doneSheet_();
  switch (b.action) {
    case 'set':
      if (!b.key) throw new Error('key');
      setDone_(s, b.key, b.date, b.label);
      break;
    case 'unset': {
      const row = findRow_(s, b.key);
      if (row > 0) s.deleteRow(row);
      break;
    }
    case 'birth':
      setBirth_(b.birth);
      break;
    case 'reset':
      if (s.getLastRow() > 1) s.deleteRows(2, s.getLastRow() - 1);
      break;
    case 'import': {            // première synchronisation depuis un téléphone
      const items = b.done || {};
      Object.keys(items).forEach(k => {
        if (findRow_(s, k) < 0) setDone_(s, k, items[k].date, items[k].label);
      });
      if (b.birth && !state_().birth) setBirth_(b.birth);
      break;
    }
    default:
      throw new Error('action');
  }
}
