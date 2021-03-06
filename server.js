const ENABLED = true;
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

// the process.env values are set in .env
passport.use(new GoogleStrategy({
  clientID: '566278457985-suta4soahcq0ct9jq8cq46rllctdg8g7.apps.googleusercontent.com', //'968726232427-h0ebj90sa7vngdigprl1e9r4lsjftrhd.apps.googleusercontent.com',
  clientSecret:'5qsEB-mpMJBPYl8T8EuuXryH', //'inApVun16x24KVuLxrdv0MQP',
  callbackURL: '/auth/google/redirect',
  scope: ['profile','email']
},
function(token, tokenSecret, email, cb) {
  return cb(null, email);
}));
passport.serializeUser(function(user, done) {
  done(null, user);
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

if(process.env.USE_SSL_GLITCH)
  app.use(express_enforces_ssl()); //FOR GLITCH ONLY

controller(app, io);

// index route
app.get('/', function(req, res) {
  if(ENABLED){
    res.sendFile(__dirname + '/views/login.html');
  }
  else{
    res.send("Selection over");
  }
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
const listener = server.listen(process.env.PORT || 3000, function () {
    console.log('Listening on port ' + listener.address().port);
});

