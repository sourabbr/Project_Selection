const path = require("path");
const exec = require('child_process').exec;
module.exports = function (app, db) {
    
    // on successful auth, a cookie is set before redirecting
    // to the success view
    app.get('/setcookie', requireUser, checkUserInDb,
      function(req, res) {
        res.cookie('email', req.user.emails[0].value);
        res.cookie('displayName', req.user.displayName);
        console.log(req.user.emails[0].value);
        res.redirect('/projectSelection');
      }
    );

    // if cookie exists, success. otherwise, user is redirected to index
    app.get('/projectSelection', requireLogin,
      function(req, res) {
        if (!req.cookies['email']) {
          res.redirect('/');
        } else {
          res.sendFile(path.join(__dirname, '../views/index.html'));
        }        
      }
    );
    app.get("/admin01110011", function (request, response) {
        response.sendFile(path.join(__dirname, '../views/admin.html'));
    });
    
    app.get("/forbidden", function (request, response) {
        response.send("This action is not allowed");
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
  
    function requireLogin (req, res, next) {
      if (!req.cookies['email']) {
        res.redirect('/');
      } else {
        next();
      }
    };

    function requireUser (req, res, next) {
      if (!req.user) {
        res.redirect('/');
      } else {
        next();
      }
    };

    function checkUserInDb (req, res, next) {
      let team = db.get('registeredTeams')
                  .find({email:req.user.emails[0].value})
                  .value();
      console.log(team);
      if(team===undefined){
        res.redirect('/#unregisteredemail');
      }else {
        next();
      }
    };
  
};

