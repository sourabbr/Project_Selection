const shortId = require('shortid');
let socketcontroller = (io,db) => {

  io.on('connection', socket => {

    const headers = socket.handshake.headers;
    console.log("User connected : [ IP: %s, PORTS: %s]", headers['x-forwarded-for'], headers['x-forwarded-port']);

    socket.on('message', message => {
      message = message.trim();
      if (message === '') 
        return;
      message = message.substring(0, 150);
      console.log('Message: "%s" from [%s]', message, headers['x-forwarded-for']);
      io.emit('message', message);
    });
    
    socket.on('newProject', newProject => {
      db.get("guides")
      .upsert({})
      .write();
      
    });
    
    socket.on('disconnect', () => {
      console.log("User disconnected : [ IP: %s, PORTS: %s]", headers['x-forwarded-for'], headers['x-forwarded-port']);
    });

  });
  
}
module.exports=socketcontroller;