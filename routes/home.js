/**
 * GET /
 * Home page.
 */

const Event  = require('../models/Event');
const Signup = require('../models/Signup');

exports.index = function(req, res, next) {
 if (req.user){
/*
 * http://www.summa.com/blog/avoiding-callback-hell-while-using-mongoose
 *
 */
  Signup.find({ successful: true }).exec()
  .then(function(allEntries){
   var entries          = [];
   var availabilityCopy = JSON.parse(JSON.stringify(Event.availability));
   for (entry in allEntries){
    if (allEntries[entry].username ==
        (req.user.username ? req.user.username : req.user.displayName)){
     entries.push(allEntries[entry])
    }
    if (allEntries[entry].coast == ""){
     availabilityCopy[allEntries[entry].product]
                     ["West"]
                     [allEntries[entry].holiday].count--;
     availabilityCopy[allEntries[entry].product]
                     ["East"]
                     [allEntries[entry].holiday].count--;
    } else {
     if (availabilityCopy.hasOwnProperty(allEntries[entry].product)){
      if(availabilityCopy[allEntries[entry].product]
                         .hasOwnProperty(allEntries[entry].coast)){
       if (availabilityCopy[allEntries[entry].product]
                           [allEntries[entry].coast]
                           .hasOwnProperty([allEntries[entry].holiday])){
        availabilityCopy[allEntries[entry].product]
                        [allEntries[entry].coast]
                        [allEntries[entry].holiday].count--;
       }
      }
     }
    }
   }
   if (entries.length < Event.holidates.length && entries.length > 0){
    var signedUp = [];
    for (signup in entries){
     signedUp.push(entries[signup].holiday)
    }
    /*diff poyfill*/
    Array.prototype.diff = function (a) {
     return this.filter(function (i) {
      return a.indexOf(i) === -1;
     });
    };
    res.render('index-logged-in-signed-up-some-days',
     {
      title        : 'Home',
      startUTCTime : Event.startUTCTime,
      products     : Event.products,
      entries      : entries,
      holidates    : Event.holidates.diff(signedUp),
      user         : req.user,
      availability : availabilityCopy
     });
   } else if (entries.length > 0) {
    res.render('index-logged-in-signed-up-all-days',
     {
      title        : 'Home',
      startUTCTime : Event.startUTCTime,
      products     : Event.products,
      entries      : entries,
      user         : req.user
     });
   } else {
    res.render('index-logged-in-signup',
     {
      title        : 'Home',
      startUTCTime : Event.startUTCTime,
      products     : Event.products,
      user         : req.user,
      holidates    : Event.holidates,
      availability : availabilityCopy
     });
   }
  })
  .catch(function(error){
   req.flash('error', 'Problems getting all entries from DB');
   res.redirect('/abadurl');
  });
 } else {
  res.render('index',{
     title: '',
     startUTCTime : Event.startUTCTime
  });
 }
};
