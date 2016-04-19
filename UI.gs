/*
* author: thanhhungqb@gmail.com
* date: Apr. 2016
*
* This file contains UI
* A custom menu is added to active spreadsheet
* User can take action from this menu
*/

/**
 * Builder a trigger and attach to Spreadsheet gave by configure
 */
function setupCustomMenu() {
	config.init();
//var sheet = SpreadsheetApp.getActive();
var sheet = SpreadsheetApp.openById(sid['sid']);
 ScriptApp.newTrigger("onOpen")
   .forSpreadsheet(sheet)
   .onOpen()
   .create();
}

/**
 * Create custom menu and attach to current open spreadsheet
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Contact manager')
  .addItem('Export contacts', 'exportContacts')
  .addItem('Import or Update contacts', 'ni')
  .addSeparator()
  .addSubMenu(ui.createMenu('Merge')
              .addItem('Check to merge', 'ni')
              .addItem('Merge', 'ni'))
  .addSubMenu(ui.createMenu('Clean')
              .addItem('Contacts sheet', 'cleanContactsSheet')
              .addItem('Merge sheet', 'ni')
              .addItem('import sheet', 'ni'))  
  .addSubMenu(ui.createMenu('Nomalize')
              .addItem('Phone number', 'ni') // remove +84 if have, add -
              .addItem('Name', 'ni') // update name infor
              .addItem('--', 'ni')) 
  .addToUi();
}

function cleanContactsSheet() {
  config.init();
  var ss = SpreadsheetApp.openById(config['sid']).getSheetByName(config['contactSheetName']);
  ss.clear();
}

/* not implement yet */
function ni() {
  SpreadsheetApp.getUi().alert('Not Implement Yet!');  
}
