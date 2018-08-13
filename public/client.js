function getUnique(array, key){
  return array.reduce(function(carry, item){
    if(item[key] && !~carry.indexOf(item[key])) carry.push(item[key]);
    return carry;
  }, []);
}

$(function() {
  
  const socket = io();
  
  $('form').submit(function(event) {
    event.preventDefault();
    let $selectedProject = $('form input[name=selectedProject]:checked')
    let title = $selectedProject.val();
    socket.emit('registeredProject', registeredProject);
    $selectedProject.val('');
    $selectedProject.focus();
  });
  
  socket.on('loadProjects', function(projects) {
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
