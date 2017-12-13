const express = require('express');
const fs = require('fs');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const LdapStrategy = require('passport-ldapauth');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session')
const flash = require('express-flash');

const homeController     = require('./routes/home');
const userController     = require('./routes/user');
const signupController   = require('./routes/signup');
const forgotController   = require('./routes/forgot');
const loginController    = require('./routes/login');
const scheduleController = require('./routes/schedule');
const capacityController = require('./routes/capacity');
const accountController  = require('./routes/account');
const reserveController  = require('./routes/reserve');

const User = require('./models/User');

const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.connect('mongodb://handoff-mongo/test',{useMongoClient:true});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'handoff', 
                 saveUninitialized: true,
                 resave: true}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

/**
 * Various configurations for getting LDAP and local authentication to work.
 */

/*http://stackoverflow.com/a/26064416/3178123*/

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var OPTS = {
  server: {
    url: 'ldaps://dca2dmc-dnsp03.nbttech.com:636',
    bindDn: 'CN=service.RPMOASQA,OU=Users_NonHuman,DC=nbttech,DC=com',
    bindCredentials: 'RPM@Password!',
    searchBase: 'DC=nbttech,DC=com',
    searchFilter: '(&(objectclass=user)(samaccountname={{username}}))',
    tlsOptions: {
     ca: [
      fs.readFileSync('dca2dmc-dnsp03-nbttech-com.crt')
    ]
   }
  }
};

passport.use(new LdapStrategy(OPTS));
passport.use(new LocalStrategy(function(username, password, done) {
 User.findOne({ username: username }, function(err, user) {
  if (err) return done(err);
   if (!user) return done(null, false, { message: 'Incorrect username.' });
    user.comparePassword(password, function(err, isMatch) {
     if (isMatch) {
        return done(null, user);
     } else {
        return done(null, false, { message: 'Incorrect password.' });
     }
   });
  });
}));

/*
http://stackoverflow.com/questions/20052617/use-multiple-local-strategies-in-passportjs
*/

passport.serializeUser(function(user, done) {
 if(user.id){
  done(null, user);
 } else if (user){
  done(null, user);
 }
});

passport.deserializeUser(function(u, done) {
 if (u.cn){
  done(null, u);
 } else if (u) { 
 User.findById(u, function(err, user) {
   done(err, user);
  });
 }
});


/**
 * Primary app routes.
 */

app.get('/',              homeController.index);
app.get('/login',         userController.getLogin);
app.post('/login',        userController.postLogin);
app.get('/logout',        userController.getLogout);
app.get('/signup',        signupController.getSignup);
app.post('/signup',       signupController.postSignup);
app.get('/forgot',        forgotController.getForgot);
app.post('/forgot',       forgotController.postForgot);
app.get('/reset/:token',  forgotController.getReset);
app.post('/reset/:token', forgotController.postReset);
app.get('/schedule',      scheduleController.getSchedule);
app.get('/capacity',      capacityController.getCapacity);
app.post('/reserve',      reserveController.postReserve);
app.get('/account',       accountController.getAccount);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  req.flash('info','Page Not Found');
  res.status(err.status || 500);
  if (req.user){
   res.render('error', {user:req.user});
  } else {
   res.render('error');
  }
});

module.exports = app;
