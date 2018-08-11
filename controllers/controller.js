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
        console.log('User connected');

        socket.on('message', function(message) {
          message = message.trim();
          if (message === '') return;
          message = message.substring(0, 150);

          console.log('Message: ' + message);
          io.emit('message', message);
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
