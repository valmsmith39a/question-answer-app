$(document).ready(init);

// Only change the DOM when firebase changes 

var ref = new Firebase('https://valtest.firebaseio.com/');
var contactsRef = ref.child('contacts');



var arrayOfRowContainersObjectsG=[];
var arrayOfContactsObjectsG=[];
var newContactObjectG; 

function init(){
	//initializeLocalStorage(); 
	//updateArrayOfRowContainers();
	//displayContactsList();
	$('#add-contact-button').on('click', addContactButton);
	$('.contacts-list').on('click', '.delete-button', deleteContactButton);
	$('.contacts-list').on('click', '.edit-button', saveEditsButton);

	//$('.contacts-titles').on('click', '.name-output', sortFields);
	// $('.contacts-titles').on('click', '.phone-number-output', sortFields);
	// $('.contacts-titles').on('click', '.email-output', sortFields);
}

function addContactButton(){
	var name=$('#name-input').val();
  var phoneNumber=$('#phone-number-input').val();
  var email=$('#email-input').val();
  var contactObject=initializeNewContactObject(name, phoneNumber, email);

  debugger;
  console.log('add contact', contactObject);

  arrayOfContactsObjectsG.push(contactObject);
  writeToDatabase(contactObject)
  //saveToLocalStorage(arrayOfContactsObjectsG);
  //updateArrayOfRowContainers();
  //displayContactsList();
}

function deleteContactButton(){
	var indexOfElementToRemove = $(this).closest('.row-container').index();

	console.log('referenceID is:', referenceID);
	console.log('contacts ref', contactsRef.child(referenceID));

	var refID = $(this).closest('.row-container').attr('id');
	contactsRef.child(refID).remove();


	//arrayOfContactsObjectsG.splice(indexOfElementToRemove,1);
	//arrayOfRowContainersObjectsG.splice(indexOfElementToRemove,1);
	//saveToLocalStorage(arrayOfContactsObjectsG);
	//updateArrayOfRowContainers();
	//displayContactsList();
}

function saveEditsButton(){
	// Get edited contents 
	// Save to array of contacts objects 
	// Update array of row containers 
	// Save to local storage
	var indexOfElementEdited = $(this).closest('.row-container').index();
	debugger;
	console.log('index:', indexOfElementEdited);
  var contact = $(this).closest('.row-container'); 
	var name = contact.find('.name-col').text();
	var phoneNumber = contact.find('.phone-number-col').text();
	var email = contact.find('.email-col').text();	
	var editedContactObject = {
		"name":name,
		"phoneNumber":phoneNumber,
		"email":email
	}
	var refID = $(this).closest('.row-container').attr('id');

  contactsRef.child(refID).update({ name: 'Fred', phoneNumber: 'Flintstone'});

  // if want to just read just 1 time use .once()
    contactsRef.child(refID).once('value', function(snap){
    	console.log(snap.val());
    	debugger;
    })


  debugger
	//writeToDatabase(editedContactObject);
	//arrayOfContactsObjectsG.splice(indexOfElementEdited, 1, editedContactObject);
	//updateArrayOfRowContainers();
	//saveToLocalStorage();
	//displayContactsList();
}

function writeToDatabase(contactObject){

	var refID = $(this).closest('.row-container').attr('id');



	contactsRef.push(contactObject);
	debugger;
}

function initializeNewContactObject(name, phoneNumber, email){
	newContactObjectG={
		"name":name,
		"phoneNumber":phoneNumber,
		"email":email
	};
	return newContactObjectG; 
}

var referenceID;

contactsRef.on('value', function(snapshot){
	debugger;
	console.log('inside firebase ref.on');
	console.log('snapshot is:', snapshot.val());


	snapshot.forEach(function(childSnap){
			var contact = childSnap.val();
			referenceID = childSnap.key();
			console.log('key is', referenceID);
			console.log('the child snap is', contact);
			contactsRef.child(referenceID);
			//contactsRef.child(referenceID).remove();

			var $rowContainer = $('<div>').addClass('row row-container');
			$rowContainer.attr('id', referenceID);
			console.log($rowContainer);
			debugger
			var $nameColumn = $('<div>').addClass('name-col col-md-2 col-sm-4 col-xs-6').text(contact.name).attr('contenteditable', true);
    	var $deleteButton = $('<div>').addClass('delete-button col-md-2 col-sm-4 col-xs-6');

    	var $deleteIcon = $('<i>').addClass('fa fa-trash');
    	$deleteButton.append($deleteIcon);
    	$rowContainer.append($deleteButton);
    	$rowContainer.append($nameColumn); 

var $editButton = $('<div>').addClass('edit-button col-md-2 col-sm-4 col-xs-6');
    var $editIcon = $('<i>').addClass('fa fa-floppy-o');
    $editButton.append($editIcon);
    $rowContainer.append($editButton);

    	arrayOfRowContainersObjectsG.push($rowContainer);

    	$('.contacts-list').append(arrayOfRowContainersObjectsG);
			$('.input-field').val('');  // Clears all the input fields


			debugger;
	});
  
	// to delete: 
	// get id so can go back later to delete 
	// get the firebase id of the contact 



	//var contactsObject = snapshot.val(); 


	//console.log('contacts object is: ', contactsObject);

	//var contact = snapshot.val().getValue(0);
	//console.log('contact is:', contact);
	debugger


});

function updateArrayOfRowContainers(){
	$('.contacts-list').empty(); 
	arrayOfRowContainersObjectsG.splice(0, arrayOfRowContainersObjectsG.length);

	arrayOfContactsObjectsG.map(function(contact){
		var $rowContainer = $('<div>').addClass('row row-container');
		var $nameColumn = $('<div>').addClass('name-col col-md-2 col-sm-4 col-xs-6').text(contact.name).attr('contenteditable', true);
    $rowContainer.append($nameColumn); 
    var $phoneNumberColumn = $('<div>').addClass('phone-number-col col-md-2 col-sm-4 col-xs-6').text(contact.phoneNumber).attr('contenteditable', true);
		$rowContainer.append($phoneNumberColumn);
		var $emailColumn = $('<div>').addClass('email-col col-md-2 col-sm-4 col-xs-6').text(contact.email).attr('contenteditable', true);
		$rowContainer.append($emailColumn);
    var $deleteButton = $('<div>').addClass('delete-button col-md-2 col-sm-4 col-xs-6');
    var $deleteIcon = $('<i>').addClass('fa fa-trash');
    $deleteButton.append($deleteIcon);
    $rowContainer.append($deleteButton);

    var $editButton = $('<div>').addClass('edit-button col-md-2 col-sm-4 col-xs-6');
    var $editIcon = $('<i>').addClass('fa fa-floppy-o');
    $editButton.append($editIcon);
    $rowContainer.append($editButton);
    
    arrayOfRowContainersObjectsG.push($rowContainer);
	});
}

function displayContactsList(){
	$('.contacts-list').append(arrayOfRowContainersObjectsG);
	$('.input-field').val('');  // Clears all the input fields
}