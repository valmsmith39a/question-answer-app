$(document).ready(init);

// Only change the DOM when firebase changes 

var ref = new Firebase('https://valtest.firebaseio.com/');
var postsRef = ref.child('posts');
var arrayOfRowContainersObjectsG=[];
var refIDG; 

function init(){
	$template = $('#template');
	$('#add-post-button').on('click', addPostsButton);
	$('.posts-list').on('click', '#details-button', detailsButton);
	$('#save-comments').on('click', saveModalButton);
	//$('.contacts-list').on('click', '.delete-button', deleteContactButton);
	//$('.contacts-list').on('click', '.edit-button', saveEditsButton);
	//$('.contacts-titles').on('click', '.name-output', sortFields);
	//$('.contacts-titles').on('click', '.phone-number-output', sortFields);
	//$('.contacts-titles').on('click', '.email-output', sortFields);
}

function saveModalButton(){	
	var comments = $('#comments').val();
	var commentsObject = {
		'comment':comments
	};

	var commentsRefG = postsRef.child(refIDG).child('comments');
	commentsRefG.push(commentsObject);
}

function detailsButton(){
	refIDG = $(this).closest('.row-container').attr('id');

	var commentsRefG = postsRef.child(refIDG).child('comments');

	commentsRefG.on('value', function(snapshot){

	var commentsArrayOfDOM = [];

	snapshot.forEach(function(childSnap){
			var post = childSnap.val();			
			var $comment = $('<div>').text(post.comment);
			
			commentsArrayOfDOM.push($comment);
			
		});

	$('.comments-list').empty();
	$('.comments-list').append(commentsArrayOfDOM);
	$('#myModal').modal();
  });
}

function addPostsButton(){
	var date=$('#date-input').val();
  var title=$('#title-input').val();
  var content=$('#content-input').val();
  var postObject=initializeNewPostObject(date, title, content);
  
  writeToDatabase(postObject)
  //arrayOfPostObjectsG.push(contactObject);
  //saveToLocalStorage(arrayOfContactsObjectsG);
  //updateArrayOfRowContainers();
  //displayContactsList();
}

function deleteContactButton(){
	var indexOfElementToRemove = $(this).closest('.row-container').index();

	console.log('referenceID is:', referenceID);
	console.log('contacts ref', postsRef.child(referenceID));

	var refID = $(this).closest('.row-container').attr('id');
	postsRef.child(refID).remove();


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

  postsRef.child(refID).update({ name: 'Fred', phoneNumber: 'Flintstone'});

  // if want to just read just 1 time use .once()
    postsRef.child(refID).once('value', function(snap){
    	console.log(snap.val());
    })

	//writeToDatabase(editedContactObject);
	//arrayOfContactsObjectsG.splice(indexOfElementEdited, 1, editedContactObject);
	//updateArrayOfRowContainers();
	//saveToLocalStorage();
	//displayContactsList();
}

var commentsRefG;

/*
function writeToCommentsDatabase(commentsObject){

	var refID = $(this).closest('.row-container').attr('id');
	var commentsRefG = postsRef.child(refID).child('comments');
	commentsRefG.push(commentsObject);
	commentsRefG.push(commentsObject);
}
*/

function writeToDatabase(postObject){
	postsRef.push(postObject);
}

function initializeNewPostObject(date, title , content){
	newPostObjectG={
		"date":date,
		"title":title,
		"content":content
	};
	return newPostObjectG; 
}

var referenceID;
/*
commentsRefG.on('value', function(snapshot){
console.log('inside comments');
console.log('snapshot is: ', snapshot.val());
debugger;

snapshot.forEach(function(childSnap){

$commentsContainer = $('<div>').text('comments container');

$('.comments-list').append($commentsContainer);

debugger;

});
});
*/

postsRef.on('value', function(snapshot){
	snapshot.forEach(function(childSnap){
			var post = childSnap.val();
			referenceID = childSnap.key();
			postsRef.child(referenceID);

			var $rowContainer = $('<div>').addClass('row row-container');
			$rowContainer.attr('id', referenceID);
			console.log($rowContainer);
			var $dateColumn = $('<div>').addClass('date-col col-md-2 col-sm-4 col-xs-6').text(post.date).attr('contenteditable', true);
    	$rowContainer.append($dateColumn); 
    	var $titleColumn = $('<div>').addClass('title-col col-md-2 col-sm-4 col-xs-6').text(post.title).attr('contenteditable', true);
			$rowContainer.append($titleColumn);
			var $contentColumn = $('<div>').addClass('title-col col-md-2 col-sm-4 col-xs-6').text(post.content).attr('contenteditable', true);
			$rowContainer.append($contentColumn);
			var $detailsButton = $('<button>').addClass('btn btn-primary btn-sm').attr('data-toggle', 'modal').attr('data-target', 'myModal').attr('id', 'details-button').text('Details');

     	$rowContainer.append($detailsButton);

    	arrayOfRowContainersObjectsG.push($rowContainer);

    	$('.posts-list').append(arrayOfRowContainersObjectsG);
			$('.input-field').val('');  // Clears all the input fields
	});
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