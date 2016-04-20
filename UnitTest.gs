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
