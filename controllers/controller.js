const path = require("path");
const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");
const adapter = new FileAsync('db.json');
let controller = function (app,io) {
low(adapter)
    .then(db => {
  
      app.get("/", function (request, response) {
        response.sendFile(path.join(__dirname,'../views/index.html'));
      });
      
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
  
  
      return db
        .defaults({projects:[], available:[], registrations:[]})
        .write();
    })
    .catch(err => {
        console.error(err);
    });

}
module.exports=controller;
