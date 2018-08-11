var express = require('express')
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const controller = require("./controllers/controller");
const socketcontroller
app.use(express.static('public'));
controller(app);

var listener = server.listen(process.env.PORT, function () {
  console.log('Listening on port ' + listener.address().port);
});

