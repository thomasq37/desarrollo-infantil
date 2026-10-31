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

// « 2026-10-31 » <-> cellule date
function toCell_(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || '')) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function fromCell_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  return /^\d{4}-\d{2}-\d{2}$/.test(String(v)) ? String(v) : '';
}

function rows_(s) {
  const n = s.getLastRow() - 1;
  return n > 0 ? s.getRange(2, 1, n, s.getLastColumn()).getValues() : [];
}
function findRow_(s, key) {
  const keys = rows_(s).map(r => String(r[0]));
  const i = keys.indexOf(String(key));
  return i < 0 ? -1 : i + 2;
}

function state_() {
  const done = {};
  rows_(doneSheet_()).forEach(r => { if (r[0]) done[String(r[0])] = fromCell_(r[2]); });
  let birth = null;
  rows_(cfgSheet_()).forEach(r => { if (r[0] === 'naissance') birth = fromCell_(r[1]) || null; });
  return { done: done, birth: birth, updated: new Date().toISOString() };
}

function setDone_(s, key, date, label) {
  const row = findRow_(s, key);
  const values = [[key, label || key, toCell_(date)]];
  if (row > 0) s.getRange(row, 1, 1, 3).setValues(values);
  else s.appendRow(values[0]);
}

function setBirth_(iso) {
  const s = cfgSheet_();
  const row = findRow_(s, 'naissance');
  if (row > 0) s.getRange(row, 2).setValue(toCell_(iso));
  else s.appendRow(['naissance', toCell_(iso)]);
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
  s.getRange('C:C').setNumberFormat('dd/mm/yyyy');
}
