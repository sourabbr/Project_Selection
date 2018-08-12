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
     
    const message = {
      guide: $guide.val(), 
      title: $title.val()
    }
    
    console.log(message);
    socket.emit('newProject',message);
    socket.emit('message', message.title);
    $title.val('');
    $title.focus();
    
  });
  
  socket.on('message', function(message) {
    $('<li></li>').text(message).appendTo('#list');
  });

});