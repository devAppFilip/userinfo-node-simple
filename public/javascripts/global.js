// Userlist data array for filling in info box
var userListData = [];

// id for PUT method
var _id;

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Add User button click
    $('#btnAddUser').on('click', addUser);

    // Delete user link clicked
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

    // Update add user box
    $('#userList table tbody').on('click', 'td a.linkupdateuser', populateUserBox);

    // Update User button clicked
    $('#btnUpdateUser').on('click', updateUser);

});

// Functions =============================================================

// Fill table with data
function populateTable(){
  var tableContent = '';

  // jQuery AJAX call for json
  $.getJSON('/users/userlist', function(data){

    userListData = data;

    // For each item in JSON
    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
      tableContent += '<td>' + this.email + '</td>';
      tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
      tableContent += '<td><a href="#" class="linkupdateuser" rel="' + this._id + '">update</a></td>';
      tableContent += '</tr>';
    });

    // Inject string content in table
    $('#userList table tbody').html(tableContent);
  });
}

//Show user info
function showUserInfo(event){

  //Prevent link from firing
  event.preventDefault();

  // Retreive username from link rel attribute
  var thisUserName = $(this).attr('rel');

  // Get index of object based on id value
  var arrayPosition = userListData.map(function(arrayItem){
    return arrayItem.username;
  }).indexOf(thisUserName);

  // Get User object
  var thisUserObject = userListData[arrayPosition];

  // Populate info box
  $('#userInfoName').text(thisUserObject.fullname);
  $('#userInfoAge').text(thisUserObject.age);
  $('#userInfoGender').text(thisUserObject.gender);
  $('#userInfoLocation').text(thisUserObject.location);
}

// Add User
function addUser(event){
  event.preventDefault();

  // Basic validation
  var errorCount = 0;
  $('#addUser input').each(function(index,val){
    if($(this).val() === ''){
      errorCount++;
    }
  });

  // Check if errorCount at 0
  if(errorCount === 0){

    // Compile all info in one object
    var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }

    // Use AJAX to post the object to service
    $.ajax({
      type: 'POST',
      data: newUser,
      url: '/users/adduser',
      dataType: 'JSON'
    }).done(function(response){

      // Check if successful
      if(response.msg === ''){

        // Clear input field
        $('#addUser fieldset input').val('');

        // Update the table
        populateTable();
      } else{
        alert("Error: " + response.msg);
      }
    });
  } else{
    // Require all fields
    alert('Please fill in all fields');
    return false;
  }
}

// Delete user
function deleteUser(event){
  event.preventDefault();

  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this user?');

  // Check if client confirmed
  if(confirmation === true){

    // AJAX delete
    $.ajax({
      type: 'DELETE',
      url: 'users/deleteuser/' + $(this).attr('rel')
    }).done(function(response){

      // Check if successful
      if(response.msg = ''){

      } else {
        alert('Error: ' + response.msg);
      }

      // Update table
      populateTable();
    });
  } else {
    // Did not confirm
    return false;
  }
}

// Update user
function populateUserBox(event){
  event.preventDefault();

  // Get User object
  var thisUserObject;
  var id = $(this).attr('rel');

  // GET userlist
  $.getJSON('users/userlist', function(data){

    // Go over JSON list
    $.each(data, function(i, item){
      if(item._id === id){
        thisUserObject = item;

        //console.log(thisUserObject);

        // Populate form with user data
        document.getElementById('inputUserName').value = thisUserObject.username;
        document.getElementById('inputUserEmail').value = thisUserObject.email;
        document.getElementById('inputUserFullname').value = thisUserObject.fullname;
        document.getElementById('inputUserAge').value = thisUserObject.age;
        document.getElementById('inputUserLocation').value = thisUserObject.location;
        document.getElementById('inputUserGender').value = thisUserObject.gender;
        _id = thisUserObject._id;
      }
    });
  });
}

function updateUser(event){
  event.preventDefault();

  // Compile all info in one object
  var updateUser = {
          'username': $('#addUser fieldset input#inputUserName').val(),
          'email': $('#addUser fieldset input#inputUserEmail').val(),
          'fullname': $('#addUser fieldset input#inputUserFullname').val(),
          'age': $('#addUser fieldset input#inputUserAge').val(),
          'location': $('#addUser fieldset input#inputUserLocation').val(),
          'gender': $('#addUser fieldset input#inputUserGender').val()
  }

  console.log('users/updateuser/' + document.getElementById('inputUserName').value);

  // TODO doesn't work
  // AJAX call to user update service
  $.ajax({
    type: 'PUT',
    data: updateUser,
    url: 'users/updateuser/' + _id,
    dataType: 'JSON'
  }).done(function(response){
    // Check if successful
    if(response.msg = ''){

    } else {
      alert('Error: ' + response.msg);
    }

    // Update table
    populateTable();
  });
}
