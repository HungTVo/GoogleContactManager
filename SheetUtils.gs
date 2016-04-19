/**
* Class to manage sheet, include write, read contact data
* author: thanhhungqb@gmail.com
* Date: Apr. 2016
*/

function SheetUtils(sid) {
  this.sid = sid;
  
  /*
  * insert many rows to current spreadsheet with shet name sname
  * @param rows [[],[],...]
  * @param sname [option] sheetname, if omit, then default name are use
  */
  this.insertRows = function (rows, sname) {
    var cntName = config['contactSheetName'];
    if (sname != undefined)
      cntName = sname;
    
    var ss = SpreadsheetApp.openById(this.sid).getSheetByName(cntName);
    if (ss == null)
      ss = SpreadsheetApp.openById(this.sid).insertSheet(cntName);
    ss.getRange(1+ss.getLastRow(), 1, rows.length, rows[0].length).setValues(rows);
  }
  
  /*
  * Same insertRows method but apply for one row only
  */
  this.insertRow = function (row, sname) {
    var cntName = config['contactSheetName'];
    if (sname != undefined)
      cntName = sname;
    
    var ss = SpreadsheetApp.openById(this.sid).getSheetByName(cntName);
    if (ss == null)
      ss = SpreadsheetApp.openById(this.sid).insertSheet(cntName);
    ss.getRange(1+ss.getLastRow(), 1, 1, row.length).setValues([row]);
  }
}
