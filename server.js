var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var user_email='';

// the process.env values are set in .env
passport.use(new GoogleStrategy({
  clientID: '968726232427-h0ebj90sa7vngdigprl1e9r4lsjftrhd.apps.googleusercontent.com',
  clientSecret: 'inApVun16x24KVuLxrdv0MQP',
  callbackURL: '/auth/google/redirect',
  scope: ['profile','email']
},
function(token, tokenSecret, email, cb) {
  return cb(null, email);
}));
passport.serializeUser(function(user, done) {
  done(null, user);
  user_email = user.emails[0].value;
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


const express = require('express');
const http = require('http');
const express_enforces_ssl = require('express-enforces-ssl');
const controller = require("./controllers/controller");

const app = express();

var expressSession = require('express-session');

// cookies are used to save authentication
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(expressSession({ secret:'projectselection', resave: true, saveUninitialized: true, maxAge: (90 * 24 * 3600000) }));
app.use(passport.initialize());
app.use(passport.session());
const server = http.Server(app);
const io = require('socket.io')(server);

app.use(express.static('public'));
app.use('/exports', express.static('exports'));
app.enable('trust proxy');
app.use(express_enforces_ssl());

// index route
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/login.html');
});

// on clicking "logoff" the cookie is cleared
app.get('/logoff',
  function(req, res) {
    res.clearCookie('accessed-email');
    res.redirect('/');
  }
);

app.get('/auth/google', passport.authenticate('google'));

app.get('/auth/google/redirect', 
  passport.authenticate('google', 
    { successRedirect: '/setcookie', failureRedirect: '/' }
  )
);

// on successful auth, a cookie is set before redirecting
// to the success view
app.get('/setcookie', requireUser,
  function(req, res) {
    if(req.get('Referrer') && req.get('Referrer').indexOf("google.com")!=-1){
      res.cookie('accessed-email', new Date());
      res.redirect('/success');
    } else {
       res.redirect('/');
    }
  }
);

// if cookie exists, success. otherwise, user is redirected to index
app.get('/success', requireLogin,
  function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
  }
);

function requireLogin (req, res, next) {
  if (!req.cookies['accessed-email']) {
    res.redirect('/');
  } else {
    console.log(req.cookies['accessed-email']);
    next();
  }
};

function requireUser (req, res, next) {
  if (!req.user) {
    res.redirect('/');
  } else {
    console.log(req.user);
    next();
  }
};


controller(app, io);
const listener = server.listen(process.env.PORT, function () {
    console.log('Listening on port ' + listener.address().port);
});

