module.exports=function(app){
  
      /******************************************** ROUTES **********************************************************/      
      app.get("/", function (request, response) {
        response.sendFile(path.join(__dirname,'../views/index.html'));
      });
      /******************************************** END ROUTES **********************************************************/
}