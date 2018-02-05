$(function() {
  
  var socket = io();
  
  $('form').submit(function(event) {
    event.preventDefault();
    var message = $('input').val();
    socket.emit('message', message);
    $('input').val('');
    $('input').focus();
  });

});
