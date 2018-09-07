const path = require("path");
const exec = require('child_process').exec;
module.exports = function (app, db) {
    
    // on successful auth, a cookie is set before redirecting
    // to the success view
    app.get('/setcookie', requireUser, checkUserInDb,
      function(req, res) {
        if(req.get('Referrer') && req.get('Referrer').indexOf("google.com")!=-1){
          res.cookie('accessed-email', new Date());
          console.log(req.user.emails[0].value);
          res.redirect('/success');
        } else {
           res.redirect('/');
        }
      }
    );

    // if cookie exists, success. otherwise, user is redirected to index
    app.get('/success', requireLogin,
      function(req, res) {
        res.sendFile(path.join(__dirname, '../views/index.html'));
      }
    );
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
  
    function requireLogin (req, res, next) {
  if (!req.cookies['accessed-email']) {
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
    res.redirect('/');
  }else {
    next();
  }
};
  
};

