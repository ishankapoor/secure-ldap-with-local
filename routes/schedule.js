const Signup = require('../models/Signup');
const Event  = require('../models/Event');
const availabilityCopy = JSON.parse(JSON.stringify(Event.availability));

var holidates_sort_asc = function (date1, date2) {
 var d1 = new Date(date1);
 var d2 = new Date(date2);
 if (d1 > d2) return 1;
 if (d1 < d2) return -1;
 return 0;
}

exports.getSchedule = function (req, res){
 if (req.user){
  Signup.find({successful:true},function(err, entries){
   var uniqHolidates = [];
   var uniqProducts  = [];
   for(entry in entries) {
    if (uniqHolidates.includes(entries[entry].holiday) == false){
     if (entries[entry].holiday){
      uniqHolidates.push(entries[entry].holiday)
     }
    }
    if (uniqProducts.includes(entries[entry].product) == false){
     if(entries[entry].product){
      uniqProducts.push(entries[entry].product)
     }
    }
   }
   Event.holidates.sort(holidates_sort_asc); 
   res.render('schedule',
   {
    title       :"Schedule" ,
    user        : req.user,
    holidays    : Event.holidates,
    products    : Event.products,
    availability: availabilityCopy,
    entries     : entries
   });
  });
 } else {
  req.flash('error', 'Need to be logged in!');
  res.redirect('/');
 }
}
