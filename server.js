const express = require('express')
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const controller = require("./controllers/controller");
const socketcontroller = require("./controllers/socketcontroller");
app.use(express.static('public'));
controller(app);
socketcontroller(io);
const listener = server.listen(process.env.PORT, function () {
  console.log('Listening on port ' + listener.address().port);
});

