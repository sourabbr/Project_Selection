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
    var $selectedProject = $('form input[name=selectedProject]:checked');
    var title = $selectedProject.val();
    if(title===undefined){
      alert("Please Select a Project");
      return;
    }
    var guide = $selectedProject.parent().parent().parent().attr('value');
    var $team = $('textarea#team-members')
    if($team.val().trim().length===0){
      $team.focus();
      return;
    }
    var teamMembers = $team.val().split('\n');
    socket.emit('registeredProject', {title,guide,teamMembers});
  });
  
  socket.on('loadProjects', function(projects) {
    $('#projectSelectionForm').html('');
    for(var guide of getUnique(projects,'guide')){
      $(`<hr><h6>Guide: ${guide}</h6>
         <fieldset value="${guide}" class="${guide.split(' ').join('-')}"></fieldset>
        `)
        .appendTo('#projectSelectionForm');
    }
    
    for(var project of projects){
      $(`<div class="radio">
         <label><input type="radio" name="selectedProject" value="${project.title}"> ${project.title}</label>
         </div>
        `)
        .appendTo(`fieldset.${project.guide.split(' ').join('-')}`);
    }
    
  });
  
  
  socket.on('registeredProject', function(registeredProject) {
    $('<li></li>').text(registeredProject.title).appendTo('ul#registeredProjectsList');
  });
  
  
});
