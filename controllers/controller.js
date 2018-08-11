const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");
const adapter = new FileAsync('db.json');
let controller = function (app) {
low(adapter)
    .then(db => {
  
      app.get("/", function (request, response) {
        response.sendFile(__dirname + '/views/index.html');
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
