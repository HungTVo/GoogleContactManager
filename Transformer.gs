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
