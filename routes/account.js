exports.getAccount = function (req, res) {

 if (!req.user)
 {
  req.flash('error', 'Need be Logged in!');
  res.redirect('/');
 }
 else
 {
  res.render('account',
  {
   title: 'Account',
   user: req.user
  });
 }

};
