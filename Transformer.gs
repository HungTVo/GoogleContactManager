/**
* author: thanhhungqb@gmail.com
* date: Apr. 2016
* This file define transformer class that can be used to convert contact object to many present.
* It can be useful when output to spreadsheet, export to csv file, ...
*/

var transformer = {
		simpleRow: function(contactJson) {
			return [contactJson['Id'], contactJson['FullName'], contactJson['PrimaryEmail'], 
			        contactJson['Phones'],JSON.stringify(contactJson)];
		}
};
