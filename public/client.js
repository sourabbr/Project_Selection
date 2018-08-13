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
    var $selectedProject = $('form input[name=selectedProject]:checked')
    var message = $selectedProject.val();
    socket.emit('message', message);
    $selectedProject.val('');
    $selectedProject.focus();
  });
  
  socket.on('projects', function(projects) {
    $('#projectSelectionForm').html('');
    for(let guide of getUnique(projects,'guide')){
      $(`<hr><h6>Guide: ${guide}</h6>
         <fieldset class="${guide.split(' ').join('-')}"></fieldset>
        `)
        .appendTo('#projectSelectionForm');
    }
    
    for(let project of projects){
      $(`<div class="radio">
         <label><input type="radio" name="selectedProject" value="${project.title}"> ${project.title}</label>
         </div>
        `)
        .appendTo(`fieldset.${project.guide.split(' ').join('-')}`);
    }
    
  });
  
  
  socket.on('registeredProject', function(registeredProject) {
    $('<li></li>').text(registeredProject).appendTo('ul#registeredProjectsList');
  });
  
  
});
