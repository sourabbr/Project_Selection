const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");
const adapter = new FileAsync('db.json');
const socketcontroller = require("./socketcontroller.js");
const exportcontroller = require("./exportcontroller.js");
const importcontroller = require("./importcontroller.js");
const router = require("./router.js");
const controller = function (app, io) {
    low(adapter)
        .then(db => {

            db._.mixin({
                upsert: function (collection, obj, key) { //update if present, else insert
                    for (let i = 0; i < collection.length; i++) {
                        key = key || 'title';
                        let el = collection[i];
                        if (el[key] === obj[key]) {
                            collection[i] = obj;
                            return collection;
                        }
                    }
                    collection.push(obj);
                },
                insertIfNotExists: function (collection, obj, key) {
                    for (let i = 0; i < collection.length; i++) {
                        key = key || 'title';
                        let el = collection[i];
                        if (el[key] === obj[key]) {
                            return "alreadyExists"; // err: Already exists
                        }
                    }
                    collection.push(obj);
                }
            });
      
            socketcontroller(io, db);      
            exportcontroller(app, db);
            importcontroller(app, db);
            router(app, db);
      
            return db
                .defaults({projects: [], registrations: [], registeredUSNs: [], registeredTeams: [], 'guides':[]})
                .write();
        })
        .catch(err => {
            console.error(err);
        });

};
module.exports = controller;