const path = require("path");
const exec = require('child_process').exec;
module.exports = function (app) {

    app.get("/", function (request, response) {
        response.sendFile(path.join(__dirname, '../views/login.html'));
    });

    app.get("/admin", function (request, response) {
        response.sendFile(path.join(__dirname, '../views/admin.html'));
    });
    
    app.get("/forbidden", function (request, response) {
        response.send("You are not allowed to view the source");
    }); 
  
    app.get("/resetRegistrations", function (request,response) {
        exec("cp db1.json db.json", function(error, stdout, stderr) {
          response.send("Reset Registrations Successfully");
        });
    });
    
    app.get("/refresh", function (request,response) {
        response.send("restarting...");
        exec("refresh");
        response.end();
    });
  
};