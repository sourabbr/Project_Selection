$(function() {
  
  var socket = io();
  
  $('form').submit(function(event) {
    event.preventDefault();
    let $guide = $('#Guide');
    let $title = $('#Title');
    if($guide.val()==''){
      $guide.focus();
      return;
    }
    if($title.val()==''){
      $title.focus();
      return;
    }
     
    const newProject = {
      guide: $guide.val(), 
      title: $title.val(),
      available: true
    }
    
    console.log(newProject);
    socket.emit('newProject',newProject);
    socket.emit('message', newProject.title);
    $title.val('');
    $title.focus();
    
  });
  
  socket.on('message', function(message) {
    $('<li></li>').text(message).appendTo('#list');
  });

});