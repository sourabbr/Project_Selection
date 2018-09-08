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
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function getUnique(array, key) {
    return array.reduce(function (carry, item) {
        if (item[key] && !~carry.indexOf(item[key])) carry.push(item[key]);
        return carry;
    }, []);
}

function validateUSN(usn) {
    var pattern = /^1DS(15|16)IS\d{3}$/i;          //for ISE final year students
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
    var email=getCookie('email');
    var team=[];
    if(!email){
      alert("Email not valid");
      return;
    }
    window.state=state;
    for(var i=0; i<state.registeredTeams.length; i++){
      if(state.registeredTeams[i].email==email){
        team=state.registeredTeams[i].team;
        if(state.registered)
          window.REGISTRATION_COMPLETE=true;
      }
    }
   
    var $team = $('textarea#team-members');
    $team.val(team.join("\n"));
    $('#projectSelectionForm').html('');
    $('#takenProjectsList').html('');
    for (project of state.registrations) {
      $(` <li style="display: none;">${project.title}
        <!--<br><small>Team: ${project.teamMembers.join(', ')}</small>-->
        </li>
      `).prependTo('ul#takenProjectsList').show(500);
    }
  
    if (!REGISTRATION_COMPLETE){
      var project,guide;
      for(var i=1;i<=3;i++){
        $(`<div style="display: none;" class="select">
           <label>Choice ${i}:</label>
           <select class="form-control selection projectSelectionOption" id="projectselectoption${i}">
            <option disabled selected value> -- select a project -- </option>
            </select></div>`)
                  .appendTo(`#projectSelectionForm`).show(500);
      }

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
    for(var i=0;i<3;++i){
      if($project[i].selected){
        displayAlert(`Choice ${i+1} has now been taken. If you have not yet submitted please pick a new choice`,'info');
        //$(`.${hash(project.title)}:selected`).parent().parent().val('')
      }
    }
    $project.attr("disabled","disabled");
    // $project.hide(500, function () {
    //   $(this).remove();
    // });
}


function takenProject(project) {
    removeProject(project);
    $(`<li style="display: none;">${project.title}
        <!--<br><small>Team: ${project.teamMembers.join(', ')}-->
        </li></small>`)
      .prependTo('ul#takenProjectsList').show(500);
}


function successfullyRegistered(project) {
    $('select').hide(500, function () {
        $(this).remove();
        $('textarea').attr('disabled', 'disabled');
        REGISTRATION_COMPLETE = true;
    });
    setTimeout(function () {
        displayAlert(`Successfully Registered Project: <strong>${project}</strong>`, 'success');
    }, 1000);
}


function tryRegistration(event) {
    var email=getCookie('email');
    event.preventDefault();
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
            displayAlert("Please Enter Valid USNs only, one in each line, no other text or commas", 'danger');
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
  
    var $selectedProject1 = $("select#projectselectoption1 > optgroup > option:selected");
    var $selectedProject2 = $("select#projectselectoption2 > optgroup > option:selected");
    var $selectedProject3 = $("select#projectselectoption3 > optgroup > option:selected");

    var title1 = $selectedProject1.val();
    var title2 = $selectedProject2.val();
    var title3 = $selectedProject3.val();
  
    if (title1 === undefined || title2 === undefined || title3 === undefined) {
        displayAlert("Please select all 3 Project choices by priority");
        return;
    }
    if (title1 === title2 || title1 === title3 || title2 === title3){
        displayAlert("Please select 3 different choices");
        return;
    }
  
    var guide1 = $selectedProject1.parent().attr('value');
    var guide2 = $selectedProject2.parent().attr('value');
    var guide3 = $selectedProject3.parent().attr('value');
  
    
    var projects=[{title:title1, guide:guide1}, {title:title2, guide:guide2}, {title:title3, guide:guide3}];
    console.log(projects);
    socket.emit('registerProject', projects, teamMembers, email);
}

