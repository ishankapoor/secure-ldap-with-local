const passport = require('passport');
const Event    = require('../models/Event');

/**
 * GET /
 * Login page.
 */

exports.getLogin = function(req, res) {
  res.render('login',{
     title: 'Login',
     startUTCTime : Event.startUTCTime
  });
};

/**
 * GET /
 * Logout funtion
 */
exports.getLogout = function(req, res) {
 req.logout();
 req.flash('success','Logged Out!');
 res.redirect('/');
};

/**
 * POST /login
 * Sign in using email and password.
 */


exports.postLogin = function(req, res, next) {
 passport.authenticate(['ldapauth', 'local'], function(err, user, info) {
  if (err)
  {
   req.flash('error', 'Login Failed!');
   return next(err)
  }
  if (!user) {
   req.flash('error', 'Login Failed!');
   return res.redirect('/login')
  }
  req.logIn(user, function(err) {
   if (err) return next(err);
   req.flash('success', 'Logged In!');
   return res.redirect('/');
  });
 })(req, res, next);
};
