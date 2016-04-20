/*
* author: thanhhungqb@gmail.com
* date: Apr. 2016
*
* This file file contains configure for script
* must be call init function one time (or more) at first call
*/
var config = {
  
  // Spreadsheet and sheet information
  'sid': '16s8OUJPlTkX6sQDU4CeYAlOfI0QfGiJctfzEncLi33w', // undefined
  'contactSheetName': 'contacts',
  'defaultSheetName': 'tmp',
  
  /**
   * Must be call before use config
   */
  init: function() {
    if (this.sid == undefined) {
      this.sid = SpreadsheetApp.getActiveSpreadsheet().getId();
    }
  }
};

// first call to init
config.init();

