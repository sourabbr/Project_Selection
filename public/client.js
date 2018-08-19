const MIN_TEAM_MEMBERS = 3
const MAX_TEAM_MEMBERS = 4

$.fn.scrollTo = function (speed) {
    if (typeof(speed) === 'undefined')
        speed = 1000;

    $('html, body').animate({
        scrollTop: parseInt($(this).offset().top)
    }, speed);
};

function getUnique(array, key) {
    return array.reduce(function (carry, item) {
        if (item[key] && !~carry.indexOf(item[key])) carry.push(item[key]);
        return carry;
    }, []);
}

function validateUSN(usn) {
    var pattern = /\d\w\w\d\d\w\w\d\d\d/i;
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

$(function () {

    var socket = io();
    window.addEventListener("focus", () => socket.connect());
    $('form').submit(function (event) {
        event.preventDefault();
        var $selectedProject = $('form input[name=selectedProject]:checked');
        var title = $selectedProject.val();
        if (title === undefined) {
            displayAlert("Please Select a Project");
            return;
        }
        // var guide = $selectedProject.parent().parent().parent().attr('value');
        var $team = $('textarea#team-members');
        if ($team.val().trim().length === 0) {
            $team.focus();
            return;
        }
        var teamMembers = $team.val().trim().split('\n');
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
          displayAlert(`Your team must have minimum ${MIN_TEAM_MEMBERS} and maximum ${MAX_TEAM_MEMBERS} members`, 'warning');
          $team.focus();
          return;
        }
        // if(confirm("I confirm that I have verified my details and understand that my choice is finalized")===false)
        //   return;
        // socket.emit('registerProject', {title, guide, teamMembers});
        socket.emit('registerProject', {title, teamMembers});
    });

    socket.on('successfullyRegistered', function () {
        $('input').hide(500, function () {
            $(this).remove();
            $('textarea').attr('disabled', 'disabled');
        });
        setTimeout(function () {
            displayAlert("Successfully Registered Project", 'success');
        }, 1000);
    });

    socket.on('loadState', function (state) {
        $('#projectSelectionForm').html('');
        $('#takenProjectsList').html('');
        var project,guide;
        // for (guide of getUnique(state.projects, 'guide')) {
        //     $(`<hr><h6 style="display: none;">Guide: ${guide}</h6>
        //  <fieldset value="${guide}" class="${guide.split(' ').join('-')}"></fieldset>
        // `)
        //         .appendTo('#projectSelectionForm').show(500);
        // }
        // for (project of state.projects) {
        //     if (project.available) {
        //         $(`<div style="display: none;" class="radio" id="${project.title.split(' ').join('-')}">
        //      <label><input type="radio" name="selectedProject" value="${project.title}"> ${project.title}</label>
        //    </div>
        //   `)
        //             .appendTo(`fieldset.${project.guide.split(' ').join('-')}`).show(500);
        //     }
        // }
    //     for (project of state.registrations) {
    //         $(` <li style="display: none;">${project.title}
    //       <ul>
    //         <li>Guide: ${project.guide}</li>
    //         <li>Team: ${project.teamMembers.join(', ')}</li>
    //       </ul>
    //     </li>
    // `).appendTo('ul#takenProjectsList').show(500);
    //     }
        for (project of state.projects) {
          if (project.available) {
              $(`<div style="display: none;" class="radio" id="${project.title.split(' ').join('-')}">
                 <label><input type="radio" name="selectedProject" value="${project.title}"> ${project.title}</label>
               </div>
              `).appendTo('#projectSelectionForm').show(500);
          }
        }
       for (project of state.registrations) {
          $(` <li style="display: none;">${project.title}<br>
                Team: ${project.teamMembers.join(', ')}
              </li> 
          `).appendTo('ul#takenProjectsList').show(500);
        }


    });

    socket.on('addProject', function (project) {
        // $(`<div class="radio" id="${project.title.split(' ').join('-')}">
        //  <label><input type="radio" name="selectedProject" value="${project.title}"> ${project.title}</label>
        //  </div>
        // `)
        //     .appendTo(`fieldset.${project.guide.split(' ').join('-')}`);
         $(`<div style="display: none;" class="radio" id="${project.title.split(' ').join('-')}">
                 <label><input type="radio" name="selectedProject" value="${project.title}"> ${project.title}</label>
               </div>
          `).appendTo('#projectSelectionForm').show(500);
    });

    socket.on('takenProject', function (project) {
        $(`#${project.title.split(' ').join('-')}`).hide(500, function () {
            $(this).remove();
        });
    //     $(` <li style="display: none;">${project.title}
    //       <ul>
    //         <li>Guide: ${project.guide}</li>
    //         <li>Team: ${project.teamMembers.join(', ')}</li>
    //       </ul>
    //     </li>
    // `).appendTo('ul#takenProjectsList').show(500);
        $(` <li style="display: none;">${project.title}<br>
                  Team: ${project.teamMembers.join(', ')}
                </li> 
            `).appendTo('ul#takenProjectsList').show(500);
    });

    socket.on('displayAlert', function (message, type) {
        displayAlert(message, type);
    });

});
