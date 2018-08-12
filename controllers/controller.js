const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");
const adapter = new FileAsync('db.json');
const socketcontroller = require("./socketcontroller.js");
const router = require("./router.js");
const controller = function (app,io) {
low(adapter)
    .then(db => {
  
      db._.mixin({
        upsert: function(collection, obj, key) {
          for (let i = 0; i < collection.length; i++) {
            key = key || 'title'
            let el = collection[i];
            if(el[key] === obj[key]){
              collection[i] = obj;
              return collection;
            }
          };
          collection.push(obj);
        }
      });
  
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
module.exports = controller;