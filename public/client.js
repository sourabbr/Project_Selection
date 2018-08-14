function getUnique(array, key){
  return array.reduce(function(carry, item){
    if(item[key] && !~carry.indexOf(item[key])) carry.push(item[key]);
    return carry;
  }, []);
}

$(function() {
  
  var socket = io();
  window.addEventListener("focus", () => socket.connect());
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
    // if(confirm("I confirm that I have verified my details and understand that my choice is finalized")===false)
    //   return;
    socket.emit('registeredProject', {title,guide,teamMembers});
    $('input').remove();
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
      $(`<div class="radio" id="${project.title.split(' ').join('-')}">
         <label><input type="radio" name="selectedProject" value="${project.title}"> ${project.title}</label>
         </div>
        `)
        .appendTo(`fieldset.${project.guide.split(' ').join('-')}`);
    }
    
  });
  
  socket.on('addProject', function(project){
    $(`<div class="radio" id="${project.title.split(' ').join('-')}">
         <label><input type="radio" name="selectedProject" value="${project.title}"> ${project.title}</label>
         </div>
        `)
        .appendTo(`fieldset.${project.guide.split(' ').join('-')}`);
  });
  
  socket.on('registeredProject', function(project) {
    $(`#${project.title.split(' ').join('-')}`).remove(2000);
    $('<li></li>').text(project.title).appendTo('ul#registeredProjectsList');
  });
  
  
});
