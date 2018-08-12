function getUnique(array, key){
  return array.reduce(function(carry, item){
    if(item[key] && !~carry.indexOf(item[key])) carry.push(item[key]);
    return carry;
  }, []);
}

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
  
  socket.on('projects', function(projects) {
    $('#projectSelectionForm').html('');
    for(let guide of getUnique(projects,'guide')){
      $(`<h4>Guide: ${guide}</h4>
         <fieldset class="${guide.split(' ').join('-')}"></fieldset>
        `)
        .appendTo('#projectSelectionForm');
    }
    
    for(let project of projects){
      $(`<div class="radio">
         <label><input type="radio" name="selectedProject" value="${project.title}">${project.title}</label>
         </div>
        `)
        .appendTo(`fieldset.${project.guide.split(' ').join('-')}`);
    }
    
  });
  
  
  socket.on('registeredProject', function(registeredProject) {
    $('<li></li>').text(registeredProject).appendTo('ul');
  });
  
  
});
