var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

// the process.env values are set in .env
passport.use(new GoogleStrategy({
  clientID: '968726232427-h0ebj90sa7vngdigprl1e9r4lsjftrhd.apps.googleusercontent.com',
  clientSecret: 'inApVun16x24KVuLxrdv0MQP',
  callbackURL: '/auth/google/redirect',
  scope: 'https://www.googleapis.com/auth/plus.login'
},
function(token, tokenSecret, profile, cb) {
  return cb(null, profile);
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
app.use(express_enforces_ssl());

controller(app, io);
const listener = server.listen(process.env.PORT, function () {
    console.log('Listening on port ' + listener.address().port);
});

