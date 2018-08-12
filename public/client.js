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
      $(`<h4>${project.guide}</h4>
         <fieldset class="${project.guide.split(' ').join('-')}"></fieldset>
        `)
        .appendTo('.projectSelectionForm');
    }
    
    for(let project of projects){
      $(`<div class="radio">
         <label><input type="radio" name="selectedProject" value="${project.title}">${project.title}</label>
         </div>
        `)
        .appendTo(`fieldset.${project.guide.split(' ').join('-')}`);
      
      
      $('<li></li>').text().appendTo('ul');
    }
    
  });
  
  
  socket.on('registeredProject', function(registeredProject) {
    $('<li></li>').text(registeredProject).appendTo('ul');
  });
  
  
});
