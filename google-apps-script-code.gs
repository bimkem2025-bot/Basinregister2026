var CONFIG = {
  spreadsheetId: '1HWNKazkmqHN9xvEV18WxImkxKFzzL64_Ab16v4px4Pk',
  sourceSheet: 'cur',
  sourceRange: 'E2:E',
  targetSheet: 'register_input'
};

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'health';

  if (action === 'listClients') {
    return jsonOutput({ ok: true, data: getClientOptions_() });
  }

  return jsonOutput({ ok: true, message: 'GAS register service ready.' });
}

function doPost(e) {
  var body = safeParse_(e && e.postData && e.postData.contents);
  var action = body.action;

  if (action === 'checkClient') {
    var keyword = String(body.keyword || '').trim();
    var clients = getClientOptions_();
    var match = clients.find(function(item) {
      return item.toLowerCase() === keyword.toLowerCase();
    });

    return jsonOutput({ ok: true, exists: Boolean(match), match: match || '' });
  }

  if (action === 'createClient') {
    var row = appendClient_(body.payload || {});
    return jsonOutput({ ok: true, row: row });
  }

  return jsonOutput({ ok: false, error: 'Unknown action: ' + action });
}

function getClientOptions_() {
  var sheet = SpreadsheetApp.openById(CONFIG.spreadsheetId).getSheetByName(CONFIG.sourceSheet);
  if (!sheet) return [];

  var values = sheet.getRange(CONFIG.sourceRange).getDisplayValues();
  return values
    .map(function(r) { return String(r[0] || '').trim(); })
    .filter(function(v) { return v !== ''; });
}

function appendClient_(payload) {
  var spreadsheet = SpreadsheetApp.openById(CONFIG.spreadsheetId);
  var sheet = spreadsheet.getSheetByName(CONFIG.targetSheet) || spreadsheet.insertSheet(CONFIG.targetSheet);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp',
      'Nama Klien',
      'NIK',
      'Tempat Lahir',
      'Tanggal Lahir',
      'Tanggal Acuan',
      'Usia Hari Ini',
      'Usia Acuan',
      'Jenis Kelamin',
      'Agama',
      'Kewarganegaraan',
      'Pendidikan',
      'Pekerjaan',
      'Alamat',
      'Status Pernikahan',
      'Telp Klien',
      'Telp Penanggung Jawab',
      'Perkara/Pasal',
      'Lama Pidana',
      'Registers JSON'
    ]);
  }

  sheet.appendRow([
    new Date(),
    payload.namaKlien || '',
    payload.nik || '',
    payload.tempatLahir || '',
    payload.tanggalLahir || '',
    payload.tanggalAcuan || '',
    payload.usiaHariIni || '',
    payload.usiaAcuan || '',
    payload.jenisKelamin || '',
    payload.agama || '',
    payload.kewarganegaraan || '',
    payload.pendidikan || '',
    payload.pekerjaan || '',
    payload.alamat || '',
    payload.statusPernikahan || '',
    payload.telpKlien || '',
    payload.telpPenanggungJawab || '',
    payload.perkaraPasal || '',
    payload.lamaPidana || '',
    JSON.stringify(payload.registers || [])
  ]);

  return sheet.getLastRow();
}

function jsonOutput(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function safeParse_(text) {
  try {
    return JSON.parse(text || '{}');
  } catch (err) {
    return {};
  }
}
