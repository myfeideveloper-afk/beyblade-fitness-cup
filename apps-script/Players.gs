/**
 * Beyblade Fitness Cup: live list of joined nicknames for the registration page.
 *
 * Why: the "Publish to web" CSV link is served from Google's cache, so a new registration can take a while to show up
 * for visitors. This script reads the sheet directly every time, so the list is always current.
 *
 * Setup (about 2 minutes):
 *  1. Open the Google Sheet that holds the form responses (the one with your "nickname" tab).
 *  2. Extensions > Apps Script. Delete the sample code, paste this whole file, press Save.
 *  3. Press Deploy > New deployment > type: Web app.
 *       Execute as: Me
 *       Who has access: Anyone
 *     Press Deploy and allow the permissions it asks for.
 *  4. Copy the "Web app" URL and paste it into DUPLICATE_CHECK.api in index.html.
 *
 * About the permission screen: the script has to open your sheet to read it, so Google asks YOU (the owner) once.
 * Because it is your own unverified script, Google shows "Google hasn't verified this app": press Advanced, then
 * "Go to <project name> (unsafe)", then Allow. Your visitors are never asked for anything.
 * Permission: the script is limited to this one spreadsheet ("@OnlyCurrentDoc" below). Google cannot give a script
 * read-only access with SpreadsheetApp.getActiveSpreadsheet, so do NOT add a "spreadsheets.readonly" scope: it makes the
 * web app fail. If you added one to appsscript.json, set it to this (or delete the oauthScopes line):
 *   "oauthScopes": ["https://www.googleapis.com/auth/spreadsheets.currentonly"]
 * The code below only reads; it never writes or deletes.
 *
 * It only returns nicknames (no names, no other columns). If you change this file later,
 * use Deploy > Manage deployments > Edit > New version.
 */
/** @OnlyCurrentDoc */
const TAB_GID = 1631540710;      // the tab that has the "nickname" column (the number after gid= in the sheet address)

function doGet() {
  SpreadsheetApp.flush();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets().filter(function (s) { return s.getSheetId() === TAB_GID; })[0];
  let nicknames = [];
  if (sheet) {
    const rows = sheet.getDataRange().getValues();
    const head = (rows[0] || []).map(function (h) { return String(h).trim().toLowerCase(); });
    let col = head.indexOf("nickname");
    if (col < 0) col = 0;
    nicknames = rows.slice(1).map(function (r) { return String(r[col] || "").trim(); }).filter(Boolean);
  }
  return ContentService.createTextOutput(JSON.stringify({ nicknames: nicknames })).setMimeType(ContentService.MimeType.JSON);
}
