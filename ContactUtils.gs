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
  
  var cc = 1;
  var arr = [];
  config.init();
  
  var sheetUtils = new SheetUtils(config['sid']);
  
  for (i in contacts) {
    var js = contact2json(contacts[i]);
    var row = [js['Id'], js['FullName'], js['PrimaryEmail'], js['Phones'],JSON.stringify(js)];
    //insertRow(row);    
    arr.push(row);
    if (arr.length > 100) {
      sheetUtils.insertRows(arr);
      arr = [];
    }
    //if (cc > 100) break; cc++;
  }
  if (arr.length > 0)
    sheetUtils.insertRows(arr);
}

// json
function insertOrUpdate(jsonContact) {
  var contact = null;
  if (jsonContact['Id'] == undefined)
    contact = ContactsApp.createContact('', '', '');
  else 
    contact = ContactApp.getContactById(jsonContact['Id']);
  
  var xmap = {'Phones':'Phone', 'Emails':'Email','Companies':'Company','ContactGroups':'addToGroup',
              'Urls':'Url', 
              'CustomFields':'CustomField', 
              'Addresses':'','IMs':'IM' };
  
  for (i in jsonContact) {
    if (Array === jsonContact[i]) {
      // TODO i
      var arr = jsonContact[i];
      for (j in arr) {
        var param = '' + arr[j][''];
        var r = 'contact.add'+xmap[i] + '('+param+');';
        try{
          eval(r);}
        catch(e){}
      }
    } else eval('contact.set'+i+'("'+jsonContact[i]+'");');
  }
}

function contact2json(contact) {
  var json = {};
  
  var lst = ['Id', 'FamilyName', 'FullName', 'GivenName', 'MaidenName', 'MiddleName', 'Nickname', 'ShortName', 
             'Notes','PrimaryEmail', 
             'Prefix', 'Suffix', 'Initials', 'LastUpdated'];
  
  for (i in lst) 
    eval('json["'+lst[i]+'"] = contact.get'+lst[i] + '();');
  
  json['Emails'] = contact.getEmails().map(email2json);
  json['Phones'] = contact.getPhones().map(phone2json);
  json['Companies'] = contact.getCompanies().map(company2json);
  json['ContactGroups'] = contact.getContactGroups().map(contactGroups2json);
  json['Urls'] = contact.getUrls().map(url2json);
  json['CustomFields'] = contact.getCustomFields().map(custom2json);
  json['Addresses'] = contact.getAddresses().map(addr2json);
  json['IMs'] = contact.getIMs().map(im2json);
  /*  
  contact.getDates();       
  /**/  
  return json;
}

function email2json(email) {  return {'Address': email.getAddress(), 'DisplayName': email.getDisplayName()}; }
function phone2json(phone) {  return {'number':phone.getPhoneNumber(), 'label': phone.getLabel()}; }
function company2json(company) { return {'CompanyName':company.getCompanyName(), 'JobTitle':company.getJobTitle()}; }
function contactGroups2json(cg) { return {'Id':cg.getId(), 'Name':cg.getName()}; }
function url2json(url) { return {'Address':url.getAddress(), 'Label': url.getLabel()}; }
function custom2json(ct) {return {'Label':ct.getLabel(), 'Value':ct.getValue()}; }
function addr2json(addr) {return {'Label':addr.getLabel(), 'Address':addr.getAddress()}; }
function im2json(im) {return addr2json(im); }  // TODO check
