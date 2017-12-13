const User     = require('../models/User');
const crypto   = require('crypto');
const sendmail = require('sendmail')();

/**
 * GET /forgot
 * Forgot page.
 */

exports.getForgot = function(req, res) {
  res.render('forgot',{
     title: 'Forgot Password'
  });
};

/**
 * POST /forgot
 * Process forgot password request
 */

exports.postForgot= function(req, res) {
 crypto.randomBytes(20, function(err, buf) {
  var token = buf.toString('hex');
  User.findOne({ email: req.body.email }, function(err, userFromDB){
   if (!userFromDB) {
    req.flash('error', 'No account with that email address exists.');
    return res.redirect('/forgot');
   }
   userFromDB.resetPasswordToken = token;
   userFromDB.resetPasswordExpires = Date.now() + 3600000; // 1 hour
   userFromDB.save(function(err){
    if (err) {
     req.flash('error', 'Error saving token to database');
     return res.redirect('/abadurl');
    }
    var mailOptions = {
        to: 'Ishan Kapoor<ishan.kapoor@riverbed.com>',
        from: 'Holiday Signup System<holiday-signup@riverbed.com>',
        subject: 'Holiday Signup Password Reset',
        text: 'You are receiving this because you (or someone else)' +
              ' have requested the reset of the password for your account.' + 
              '\n\n' +
              'Please click on the following link, or paste this into your ' +
              'browser to complete the process:\n\n' +
              'http://' + req.headers.host + '/reset/' + token + '\n\n' +
              'If you did not request this, please ignore this email and ' +
              'your password will remain unchanged.\n'
      };
    sendmail(mailOptions, function(err, reply){
    if (err) {
     req.flash('error', 'Problems sending email');
     return res.redirect('/forgot');
    }
    req.flash('info', 'An e-mail has been sent to ' +
               'ishan.kapoor@riverbed.com'  + ' with further instructions.');
    res.redirect('/forgot');
    console.dir(reply);
    })
   })
  })
 })
}
/**
 * Get /reset
 * Process reset password request
 */

exports.getReset= function(req, res) {
 User.findOne({ resetPasswordToken: req.params.token,
                resetPasswordExpires: { $gt: Date.now() } },
                function(err, user) {
  if (!user) {
    req.flash('error', 'Password reset token is invalid or has expired.');
    return res.redirect('/forgot');
  }
  res.render('reset', {
    title: 'Password Reset'
  });
 });
};

/**
 * POST /reset
 * Process forgot password request
 */

exports.postReset = function(req, res) {

/*
 * http://www.summa.com/blog/avoiding-callback-hell-while-using-mongoose
 *
 */
 User.findOne({ resetPasswordToken: req.params.token,
                resetPasswordExpires: { $gt: Date.now() } },
                function(err, user) {
  if (!user) {
   req.flash('error', 'Password reset token is invalid or has expired.');
   return res.redirect('back');
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.save(function(err){
   if (err){
    req.flash('error', 'Problem saving password to the database');
    return res.redirect('/abadurl');
   }
   req.logIn(user, function (err){
    var mailOptions = {
     to: 'Ishan Kapoor<ishan.kapoor@riverbed.com>',
     from: 'Holiday Signup System<holiday-signup@riverbed.com>',
     subject: 'Holiday Signup Password Reset Success',
     text: 'This is a confirmation that the password for your account ' +
            user.email + ' has just been changed.' 
    };
    sendmail(mailOptions, function(err, reply){
     if (err) {
      req.flash('error', 'Problems sending email');
      return res.redirect('/forgot');
     }
     req.flash('success', 'Success! Your password has been changed.');
     res.redirect('/');
     console.dir(reply);
    })
   });
  })
 });
}
