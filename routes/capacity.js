const Event = require('../models/Event');

exports.getCapacity = function (req, res){
 if (req.user){
  res.render('capacity',
  {
   title        : "Capacity" ,
   user         : req.user,
   availability : Event.availability,
   holidates    : Event.holidates,
   products     : Event.products
  });
 } else {
  req.flash('error', 'Need to be logged in!');
  res.redirect('/');
 }
}
