let socketcontroller=function(io){
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
}
module.exports=socketcontroller