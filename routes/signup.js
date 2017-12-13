const User = require('../models/User');

/**
 * GET /
 * Signup page.
 */

exports.getSignup = function(req, res) {
  res.render('signup',{
     title: 'Sign Up'
  });
};


/**
 * POST /signup
 * Signup a local user with details provided
 */


exports.postSignup = function(req, res) {
 var user = new User({
     username: req.body.username,
     email: req.body.email,
     password: req.body.password
     });

  user.save(function(err) {
    req.logIn(user, function(err) {
      res.redirect('/');
    });
  });
};
