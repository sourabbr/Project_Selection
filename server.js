var express = require('express')
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

io.on('connection', function(socket) {
  console.log('User connected');
  
  socket.on('message', function(message) {
    message = message.trim();
    if (message === '') return;
    message = message.substring(0, 150);
    
    console.log('Message: ' + message);
    io.emit('message', message);
  });
});

var listener = server.listen(process.env.PORT, function () {
  console.log('Listening on port ' + listener.address().port);
});
