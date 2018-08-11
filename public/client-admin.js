$(function() {
  
  var socket = io();
  
  $('form').submit(function(event) {
    event.preventDefault();
    let guide = $('input[name="Guide"]').val();
    let title = $('input[name="Title"]').val();
    if(guide==""
    
    const message = {guide, title}
    console.log(message);
    socket.emit('message', message);
  });
  
  socket.on('message', function(message) {
    $('<li></li>').text(message).appendTo('ul');
  });

});