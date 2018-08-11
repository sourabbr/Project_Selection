let socketcontroller = function(io,db){
  
     /******************************************** SOCKETS **********************************************************/
      io.on('connection', function(socket) {
        
        const headers = socket.handshake.headers;
        console.log("User connected : [ IP: %s, PORTS: %s]", headers['x-forwarded-for'], headers['x-forwarded-port']);

        socket.on('message', function(message) {
          message = message.trim();
          if (message === '') 
            return;
          message = message.substring(0, 150);
          console.log('Message: "%s" from [%s]', message, headers['x-forwarded-for']);
          io.emit('message', message);
        });
        
        socket.on('disconnect', function(){
          console.log("User disconnected : [ IP: %s, PORTS: %s]", headers['x-forwarded-for'], headers['x-forwarded-port']);
        });
        
      });
      /******************************************** END SOCKETS ********************************************************/
  
}
module.exports=socketcontroller;