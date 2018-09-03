const MIN_TEAM_MEMBERS = 3;
const MAX_TEAM_MEMBERS = 4;
var REGISTRATION_COMPLETE = false;
var socket;
$(document).ready(function () {

    window.socket = io();
    window.addEventListener("focus", function(){socket.connect()});

    $('form').submit(tryRegistration);

    socket.on('successfullyRegistered', successfullyRegistered);

    socket.on('loadState', loadState);

    socket.on('addProject', addProject);

    socket.on('takenProject', takenProject);
  
    socket.on('removeProject', removeProject);

    socket.on('displayAlert', function (message, type) {
        displayAlert(message, type);
    });

});
$.fn.scrollTo = function (speed) {
    if (typeof(speed) === 'undefined')
        speed = 1000;

    $('html, body').animate({
        scrollTop: parseInt($(this).offset().top)
    }, speed);
};
function hash(name) {
    return name.replace(/[^a-z0-9]/g, function(s) {
        var c = s.charCodeAt(0);
        if (c == 32) return '-';
        if (c >= 65 && c <= 90) return '_' + s.toLowerCase();
        return '__' + ('000' + c.toString(16)).slice(-4);
    });
}
function getUnique(array, key) {
    return array.reduce(function (carry, item) {
        if (item[key] && !~carry.indexOf(item[key])) carry.push(item[key]);
        return carry;
    }, []);
}

function validateUSN(usn) {
    // var pattern = /\d\w\w\d\d\w\w\d\d\d/i;
    var pattern = /1DS(15|16)IS\d\d\d/i;          //for ISE final year students
    return pattern.test(usn);
}

function displayAlert(message, type = 'info') {
    $('#alerts').html('');
    $(`<div class="alert alert-${type} alert-dismissible fade show" style="display:none">
      <button type="button" class="close" data-dismiss="alert">&times;</button>
      ${message}
    </div>
  `)
        .appendTo("#alerts")
        .slideDown()
        .scrollTo();
}
function loadState(state) {
    $('#projectSelectionForm').html('');
    $('#takenProjectsList').html('');
    var project,guide;
    for(var i=1;i<=3;i++)
    $(`<div style="display: none;" class="select">
         <label>Choice ${i}:</label>
         <select class="form-control selection projectSelectionOption" id="projectselectoption${i}">
          <option disabled selected value> -- select an option -- </option>
          </select></div>`)
                .appendTo(`#projectSelectionForm`).show(500);

    for (guide of getUnique(state.projects, 'guide')) {
        // $(`<hr><h6 style="display: none;">Guide: ${guide}</h6>
     $(`<optgroup value="${guide}" class="${hash(guide)}"></optgroup>`)
            .appendTo('.projectSelectionOption');
    }

    for (project of state.projects) {
        if (project.available) {
            $(`<option class="${hash(project.title)}" value="${project.title}">${project.title}</option>`)
                .appendTo(`optgroup.${hash(project.guide)}`);
        }
    }

    if (REGISTRATION_COMPLETE){
      $('input').remove();
      $('textarea').attr('disabled', 'disabled');
    }

    for (project of state.registrations) {
      $(` <li style="display: none;">${project.title}
        <br><small>Team: ${project.teamMembers.join(', ')}</small>
        </li>
      `).appendTo('ul#takenProjectsList').show(500);
    }
}

function addProject(project) {
  $(`<option class="${hash(project.title)}" value="${project.title}">${project.title}</option>`)
      .appendTo(`optgroup.${hash(project.guide)}`);
}

function removeProject(project) {
    console.log("Removing project");
    console.log(project);
    var doRemove=true;
    var $project=$(`.${hash(project.title)}`);
    for(var i=0;i<3;i++){
      if($project[i].selected){
        doRemove=false
        break;
      }
    }
    if(doRemove){
      $project.hide(500, function () {
          $(this).remove();
      });
      displayAlert(`Your Choice ${i+1} is now unavailable`,'danger');
    }
}


function takenProject(project) {
    removeProject(project);
    $(`<li style="display: none;">${project.title}
        <br><small>Team: ${project.teamMembers.join(', ')}
        </li></small>`)
      .appendTo('ul#takenProjectsList').show(500);
}


function successfullyRegistered(project) {
    $('input').hide(500, function () {
        $(this).remove();
        $('textarea').attr('disabled', 'disabled');
        REGISTRATION_COMPLETE = true;
    });
    setTimeout(function () {
        displayAlert(`Successfully Registered Project ${project}`, 'success');
    }, 1000);
}


function tryRegistration(event) {
    event.preventDefault();
  
    var $selectedProject1 = $("select#projectselectoption1 > optgroup > option:selected");
    var $selectedProject2 = $("select#projectselectoption2 > optgroup > option:selected");
    var $selectedProject3 = $("select#projectselectoption3 > optgroup > option:selected");

    var title1 = $selectedProject1.val();
    var title2 = $selectedProject2.val();
    var title3 = $selectedProject3.val();
  
    if (title1 === undefined || title2 === undefined || title3 === undefined) {
        displayAlert("Please Select Three Project Options");
        return;
    }
  
    var guide1 = $selectedProject1.parent().attr('value');
    var guide2 = $selectedProject2.parent().attr('value');
    var guide3 = $selectedProject3.parent().attr('value');
  
    var $team = $('textarea#team-members');
    if ($team.val().trim().length === 0) {
        $team.focus();
        return;
    }
    var teamMembers = $team.val().trim().split('\n');
    var teamMemberSet=new Set(teamMembers);
    teamMembers=[...teamMemberSet];
    for (var i = 0; i < teamMembers.length; i++) {
        if (!validateUSN(teamMembers[i])) {
            displayAlert("Please Enter Valid USNs only, one in each line, no other text or commas", 'warning');
            $team.focus();
            return;
        }
        else {
            teamMembers[i] = teamMembers[i].toUpperCase();
        }
    }
    if (teamMembers.length < MIN_TEAM_MEMBERS || teamMembers.length > MAX_TEAM_MEMBERS)
    {
      displayAlert(`Your team must have minimum ${MIN_TEAM_MEMBERS} and maximum ${MAX_TEAM_MEMBERS} unique members`, 'warning');
      $team.focus();
      return;
    }
    var projects=[{title:title1, guide:guide1}, {title:title2, guide:guide2}, {title:title3, guide:guide3}];
    console.log(projects);
    socket.emit('registerProject', projects, teamMembers);
}

