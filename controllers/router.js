const path = require("path");
const export_xlsx = require("./export_xlsx.js");
module.exports=function(app,db){
  
  app.get("/", function (request, response) {
    response.sendFile(path.join(__dirname,'../views/index.html'));
  });
  
  app.get("/admin", function (request, response) {
    response.sendFile(path.join(__dirname,'../views/admin.html'));
  });
  
  app.get("/export", function (request, response) {
    export_xlsx(response);
  });

}