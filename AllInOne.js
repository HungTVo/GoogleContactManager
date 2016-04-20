

 // 

/*
 * author: thanhhungqb@gmail.com
 * date: Apr. 2016
 *
 * This file file contains configure for script
 * must be call init function one time (or more) at first call
 */
var config = {

	// Spreadsheet and sheet information
	'sid' : '16s8OUJPlTkX6sQDU4CeYAlOfI0QfGiJctfzEncLi33w', // undefined
	'contactSheetName' : 'contacts',
	'defaultSheetName' : 'tmp',

	/**
	 * Must be call before use config
	 */
	init : function() {
		if (this.sid == undefined) {
			this.sid = SpreadsheetApp.getActiveSpreadsheet().getId();
		}
	}
};

// first call to init
config.init();


 // 

/*
 * author: thanhhungqb@gmail.com
 * date: Apr. 2016
 *
 * This file contains many function to manage Google Contacts:
 * - export contacts to spreadsheet
 * - ...
 */
function exportContacts() {
	var contacts = ContactsApp.getContacts();

	var sheetUtils = new SheetUtils(config['sid'], 'contacts');

	for (i in contacts) {
		var js = contact2json(contacts[i]);
		var row = transformer['simpleRow'](js);
		sheetUtils.insertRowBuffer(row);
	}
	sheetUtils.flush();
}

// json TODO
function insertOrUpdate(jsonContact) {
	var contact = null;
	if (jsonContact['Id'] == undefined)
		contact = ContactsApp.createContact('', '', '');
	else
		contact = ContactApp.getContactById(jsonContact['Id']);

	var xmap = {
		'Phones' : 'Phone',
		'Emails' : 'Email',
		'Companies' : 'Company',
		'ContactGroups' : 'addToGroup',
		'Urls' : 'Url',
		'CustomFields' : 'CustomField',
		'Addresses' : '',
		'IMs' : 'IM'
	};

	for (i in jsonContact) {
		if (Array === jsonContact[i]) {
			// TODO i
			var arr = jsonContact[i];
			for (j in arr) {
				var param = '' + arr[j][''];
				var r = 'contact.add' + xmap[i] + '(' + param + ');';
				try {
					eval(r);
				} catch (e) {
				}
			}
		} else
			eval('contact.set' + i + '("' + jsonContact[i] + '");');
	}
}

/**
 * Convert Contact object of Google to json format
 * @param contact
 * @returns json format
 */
function contact2json(contact) {
	var json = {};

	var lst = [ 'Id', 'FamilyName', 'FullName', 'GivenName', 'MaidenName',
			'MiddleName', 'Nickname', 'ShortName', 'Notes', 'PrimaryEmail',
			'Prefix', 'Suffix', 'Initials', 'LastUpdated' ];

	for (i in lst)
		eval('json["' + lst[i] + '"] = contact.get' + lst[i] + '();');

	json['Emails'] = contact.getEmails().map(email2json);
	json['Phones'] = contact.getPhones().map(phone2json);
	json['Companies'] = contact.getCompanies().map(company2json);
	json['ContactGroups'] = contact.getContactGroups().map(contactGroups2json);
	json['Urls'] = contact.getUrls().map(url2json);
	json['CustomFields'] = contact.getCustomFields().map(custom2json);
	json['Addresses'] = contact.getAddresses().map(addr2json);
	json['IMs'] = contact.getIMs().map(im2json);
	/***************************************************************************
	 * contact.getDates(); /
	 **************************************************************************/
	return json;
}

function email2json(email) {
	return {
		'Address' : email.getAddress(),
		'DisplayName' : email.getDisplayName()
	};
}
function phone2json(phone) {
	return {
		'number' : phone.getPhoneNumber(),
		'label' : phone.getLabel()
	};
}
function company2json(company) {
	return {
		'CompanyName' : company.getCompanyName(),
		'JobTitle' : company.getJobTitle()
	};
}
function contactGroups2json(cg) {
	return {
		'Id' : cg.getId(),
		'Name' : cg.getName()
	};
}
function url2json(url) {
	return {
		'Address' : url.getAddress(),
		'Label' : url.getLabel()
	};
}
function custom2json(ct) {
	return {
		'Label' : ct.getLabel(),
		'Value' : ct.getValue()
	};
}
function addr2json(addr) {
	return {
		'Label' : addr.getLabel(),
		'Address' : addr.getAddress()
	};
}
function im2json(im) {
	return addr2json(im);
} // TODO check


 // 

/**
* Class to manage sheet, include write, read contact data
* author: thanhhungqb@gmail.com
* Date: Apr. 2016
*/

function SheetUtils(sid, sname) {
  this.sid = sid;	// spreadsheet ID
  this.sname = sname; // sheet name
  
  if (this.sid == undefined)
	  this.sid = config['sid'];
  if (this.sname == undefined)
	  this.sname = config['defaultSheetName'];
  
  /**
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
  
  /**
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


 // 

/**
* author: thanhhungqb@gmail.com
* date: Apr. 2016
* This file define transformer class that can be used to convert contact object to many present.
* It can be useful when output to spreadsheet, export to csv file, ...
*/

var transformer = {
		simpleRow: function(contactJson) {
			var emails = contactJson['Emails'].map( function(x){return x['Address'];} ).join(';');
			var phones = contactJson['Phones'].map( function(x){return x['number']; } ).join(';');
			return [contactJson['Id'], contactJson['FullName'], emails, 
			        phones,JSON.stringify(contactJson)];
		}
};


 // 

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
	// config.init();
	var sheet = SpreadsheetApp.openById(sid['sid']);
	ScriptApp.newTrigger("onOpen").forSpreadsheet(sheet).onOpen().create();
}

/**
 * Create custom menu and attach to current open spreadsheet
 */
function onOpen() {
	var ui = SpreadsheetApp.getUi();
	ui.createMenu('Contact manager').addItem('Export contacts',
			'exportContacts').addItem('Import or Update contacts', 'ni')
			.addItem('Remove contacts', 'ni')
			.addSeparator().addSubMenu(
					ui.createMenu('Merge').addItem('Check to merge', 'ni')
							.addItem('Merge', 'ni')).addSubMenu(
					ui.createMenu('Clean').addItem('Contacts sheet',
							'cleanContactsSheet').addItem('Merge sheet', 'ni')
							.addItem('import sheet', 'ni')).addSubMenu(
					ui.createMenu('Nomalize').addItem('Phone number', 'ni') // remove
																			// +84
																			// if
																			// have,
																			// add
																			// -
					.addItem('Name', 'ni') // update name infor
					.addItem('--', 'ni')).addToUi();
}

function cleanContactsSheet() {
	config.init();
	var ss = SpreadsheetApp.openById(config['sid']).getSheetByName(
			config['contactSheetName']);
	ss.clear();
}

/* not implement yet */
function ni() {
	SpreadsheetApp.getUi().alert('Not Implement Yet!');
}


 // 

/*
 * author: thanhhungqb@gmail.com
 * date: Apr. 2016
 *
 * This file contains some unittest
 */

function runTest() {
	Logger.log(Object.getOwnPropertyNames(sheetUtilsTest.prototype));
	Logger.log(sheetUtilsTest);

	for (i in configTest)
		configTest[i]();
}

var sheetUtilsTest = {
	testSheetUtils_1 : function() {
		var sheetUtils = new SheetUtils(config['sid']);
		sheetUtils.insertRows([ [ 1, 2, 3 ] ], 'bcd');
		//sheetUtils.test('bcd');
	}
}

var configTest = {
	testInit : function() {
		// validate init run
		Logger.log(config['sid']);
	}
}
