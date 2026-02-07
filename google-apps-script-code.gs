function doGet(e) {
  return ContentService.createTextOutput('Hello, World!');
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  return ContentService.createTextOutput('Data received: ' + JSON.stringify(data));
}

function createRecord(record) {
  // Logic to create a record in the database
}

function readRecord(id) {
  // Logic to read a record from the database
}

function updateRecord(id, record) {
  // Logic to update a record in the database
}

function deleteRecord(id) {
  // Logic to delete a record from the database
}

function setCORSHeaders() {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  return headers;
}

function handleOptions() {
  var headers = setCORSHeaders();
  return ContentService.createTextOutput('').setHeaders(headers);
}

function handleRequest(e) {
  if (e.httpMethod === 'OPTIONS') {
    return handleOptions();
  }
  var headers = setCORSHeaders();
  if (e.httpMethod === 'GET') {
    return doGet(e).setHeaders(headers);
  } else if (e.httpMethod === 'POST') {
    return doPost(e).setHeaders(headers);
  }
}

// Main entry point
function main(e) {
  return handleRequest(e);
}