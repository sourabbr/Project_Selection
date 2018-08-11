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
        const  clientIP = socket.handshake.headers;
        console.log('User connected : ',clientIP);

        socket.on('message', function(message) {
          message = message.trim();
          if (message === '') return;
          message = message.substring(0, 150);

          console.log('Message: ' + message);
          io.emit('message', message);
        });
        socket.on('disconnect', function(){
          console.log('User disconnected');
        });
      });
  
  
      return db
        .defaults({users:[]})
        .write();
    })
    .catch(err => {
        console.error(err);
    });

}
module.exports=controller;
