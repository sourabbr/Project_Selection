$(function () {

    var socket = io();

    $('form').submit(function (event) {
        event.preventDefault();
        let $guide = $('#Guide');
        let $title = $('#Title');
        if ($guide.val().trim() === '') {
            $guide.focus();
            return;
        }
        if ($title.val().trim() === '') {
            $title.focus();
            return;
        }

        const project = {
            guide: $guide.val().trim(),
            title: $title.val().trim(),
            available: true
        };

        console.log(project);
        socket.emit('newProject', project);
        socket.emit('message', project.title);
        $title.val('');
        $title.focus();

    });

    socket.on('message', function (message) {
        $('<li></li>').text(message).appendTo('#list');
    });

});