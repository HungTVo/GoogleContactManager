/**
* Class to manage sheet, include write, read contact data
* author: thanhhungqb@gmail.com
* Date: Apr. 2016
*/

function SheetUtils(sid, sname) {
  this.sid = sid;
  this.sname = sname;
  
  if (this.sid == undefined)
	  this.sid = config['sid'];
  if (this.sname == undefined)
	  this.sname = config['defaultSheetName'];
  
  /*
  * insert many rows to current spreadsheet with shet name sname
  * @param rows [[],[],...]
  * @param sname [option] sheetname, if omit, then default name are use
  */
  this.insertRows = function (rows) {
    var cntName = this.sname;
    
    var ss = SpreadsheetApp.openById(this.sid).getSheetByName(cntName);
    if (ss == null)
      ss = SpreadsheetApp.openById(this.sid).insertSheet(cntName);
    ss.getRange(1+ss.getLastRow(), 1, rows.length, rows[0].length).setValues(rows);
  }
  
  /*
  * Same insertRows method but apply for one row only
  */
  this.insertRow = function (row) {
    var cntName = this.sname;
    
    var ss = SpreadsheetApp.openById(this.sid).getSheetByName(cntName);
    if (ss == null)
      ss = SpreadsheetApp.openById(this.sid).insertSheet(cntName);
    ss.getRange(1+ss.getLastRow(), 1, 1, row.length).setValues([row]);
  }
  
  this.buffer = [];
  /**
   * This function use to write buffer than direct to spreadsheet. It automatic manage write data.
   * Do not forget call flush at the end of program to make sure all data write to spreadsheet
   * @param row is one row data to write
   */
  this.insertRowBuffer = function (row) {
	  this.buffer.push(row);
	  if (this.buffer.length > 100) {
		  this.insertRows(this.buffer);
		  this.buffer = [];
	  }
  }
  
  /**
   * This function flush all data on buffer and write to spreadsheet
   */
  this.flush = function() {
	  if (this.buffer.length > 100) {
		  this.insertRows(this.buffer);
		  this.buffer = [];
	  }	  
  }
}
