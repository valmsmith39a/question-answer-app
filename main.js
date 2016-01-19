$(document).ready(init);

// Only change the DOM when firebase changes 

var ref = new Firebase('https://valtest.firebaseio.com/');
var postsRef = ref.child('posts');
var arrayOfRowContainersObjectsG=[];
var refIDG; 

var NowMoment = moment();


function init(){
	$template = $('#template');
	$('#add-post-button').on('click', addPostsButton);
	$('.posts-list').on('click', '#details-button', detailsButton);
	$('#save-comments').on('click', saveModalButton);
	$('#date-input').val(NowMoment.format('YYYY-M-D'));
}

function saveModalButton(){	
	var comments = $('#comments').val();
	var commentsObject = {
		'comment':comments
	};

	var commentsRefG = postsRef.child(refIDG).child('comments');
	commentsRefG.push(commentsObject);
	$('#comments').val('');
}

function detailsButton(){

	// Gets the text of the title from the row container in DOM
	var titleOfPost = $(this).closest('.row-container').find('#title-of-post').text();
	var contentOfPost = $(this).closest('.row-container').find('#content-of-post').text();
	var dateOfPost = $(this).closest('.row-container').find('#date-of-post').text();

	// Displays text in title section of modal
	$('#title-of-post-in-modal').text('Title: '+ titleOfPost);

	$('.content-of-post-in-modal').text('Content: '+ contentOfPost);

	$('.date-in-modal').text(dateOfPost);

	// Get ID of post in Firebase, which is stored in each row in DOM. 
	refIDG = $(this).closest('.row-container').attr('id');

	var commentsRefG = postsRef.child(refIDG).child('comments');

	// Get the comments associated with that post 
	commentsRefG.on('value', function(snapshot){

		var commentsArrayOfDOM = [];

		snapshot.forEach(function(childSnap){
			var post = childSnap.val();			
			var $comment = $('<div>').text(post.comment);
	
			commentsArrayOfDOM.push($comment);		
		});
		
		$('.comments-list').empty();
		$('.comments-list').append(commentsArrayOfDOM);
		$('#myModal').modal('toggle');
  });
}

function addPostsButton(){
	var date=$('#date-input').val();
  var title=$('#title-input').val();
  var content=$('#content-input').val();
  var postObject=initializeNewPostObject(date, title, content);
  
  writeToDatabase(postObject)
}

var commentsRefG;


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

postsRef.on('value', function(snapshot){
	arrayOfRowContainersObjectsG.splice(0, arrayOfRowContainersObjectsG.length);

	snapshot.forEach(function(childSnap){
			var post = childSnap.val();
			referenceID = childSnap.key();
			postsRef.child(referenceID);

			var $rowContainer = $('<div>').addClass('row row-container');
			$rowContainer.attr('id', referenceID);
			var $dateColumn = $('<div>').addClass('date-col col-md-2 col-sm-4 col-xs-6').text(post.date).attr('contenteditable', true).attr('id', 'date-of-post');
    	$rowContainer.append($dateColumn); 
    	var $titleColumn = $('<div>').addClass('title-col col-md-2 col-sm-4 col-xs-6').text(post.title).attr('contenteditable', true).attr('id', 'title-of-post');
			$rowContainer.append($titleColumn);
			var $contentColumn = $('<div>').addClass('title-col col-md-2 col-sm-4 col-xs-6').text(post.content).attr('contenteditable', true).attr('id', 'content-of-post');
			$rowContainer.append($contentColumn);
			var $detailsButton = $('<button>').addClass('btn btn-primary btn-sm').attr('data-toggle', 'modal').attr('data-target', 'myModal').attr('id', 'details-button').text('Details');
     	$rowContainer.append($detailsButton);

    	arrayOfRowContainersObjectsG.push($rowContainer);
	});

	$('.posts-list').empty();  	
	$('.posts-list').append(arrayOfRowContainersObjectsG);
	//$('.input-field').val('');  // Clears all the input fields
	$('.title-input').val('');
	$('.content-input').val('');
});
