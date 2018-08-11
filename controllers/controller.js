const path = require("path");
const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");
const adapter = new FileAsync('db.json');
const socketcontroller = require("./socketcontroller.js");
const router = require("./router.js");
const controller = function (app,io) {
low(adapter)
    .then(db => {
      
      socketcontroller(io,db);
      router(app);
  
      
  
  
  
      return db
        .defaults({projects:[], available:[], registrations:[]})
        .write();
    })
    .catch(err => {
        console.error(err);
    });

}
module.exports=controller;
