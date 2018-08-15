const path = require("path");
const os = require('os');
const export_xlsx = require("./export.js");
module.exports=function(app){
  
  app.get("/", function (request, response) {
    response.sendFile(path.join(__dirname,'../views/index.html'));
  });
  
  app.get("/admin", function (request, response) {
    response.sendFile(path.join(__dirname,'../views/admin.html'));
  });
  
  app.get("/export",function (request, response) {
    export_xlsx();
    response.sendFile(path.join(os.tmpdir(),'registrations.xlsx'));
  });

}