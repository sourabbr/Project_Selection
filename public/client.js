$(function() {
  
  var socket = io();
  
  $('form').submit(function(event) {
    event.preventDefault();
    var $input = $('input[type="text"]');
    var message = $input.val();
    socket.emit('message', message);
    $input.val('');
    $input.focus();
  });
  
  socket.on('message', function(message) {
    $('<li></li>').text(message).appendTo('ul');
  });
  
  socket.on('projects', function(projects) {
    
    for(let project of projects){
      $(`.${project.guide.split(' ').join('-')}`).text
      $('<li></li>').text().appendTo('ul');
    }
    
  });
  
  
  socket.on('registeredProject', function(registeredProject) {
    $('<li></li>').text(message).appendTo('ul');
  });
  
  
});
