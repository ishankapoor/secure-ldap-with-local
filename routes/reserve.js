const Signup = require('../models/Signup');
const Event  = require('../models/Event');

exports.postReserve = function(req, res) {

 Signup.find({ successful: true },function(err, allEntries){
  if(err){
   req.flash('error', 'Problems getting all entries from DB');
   res.redirect('/abadurl');
  } else {
   var availabilityCopy = JSON.parse(JSON.stringify(Event.availability));
   for (entry in allEntries){
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



 var currentUTCTime = new Date();
 if (req.user && (Event.startUTCTime < currentUTCTime)){
  if(req.body[0]){
   var entries  = [];
   var rejected = [];
   var accepted = [];
   var response = new Object;
   for(var i=0;i<req.body.length;i++){
    var approved = new Object;
    var denied   = new Object;
    var successful = true;
    if (req.body[i].geo == ""){
     if (availabilityCopy[req.body[i].product]
                     ["West"]
                     [req.body[i].holiday].count == 0){
      denied.product = req.body[i].product;
      denied.coast   = req.body[i].geo;
      denied.holiday = req.body[i].holiday;
      rejected.push(denied);
      successful = false;
     } else {
      approved.product = req.body[i].product;
      approved.coast   = req.body[i].geo;
      approved.holiday = req.body[i].holiday;
      accepted.push(approved);
      successful = true;
     }
    } else {
     if (availabilityCopy[req.body[i].product]
                     [req.body[i].geo]
                     [req.body[i].holiday].count == 0){
      denied.product = req.body[i].product;
      denied.coast   = req.body[i].geo;
      denied.holiday = req.body[i].holiday;
      rejected.push(denied);
      successful = false ;
     } else {
       approved.product = req.body[i].product;
       approved.coast   = req.body[i].geo;
       approved.holiday = req.body[i].holiday;
       accepted.push(approved);
       successful = true ;
     }
    }
    var entry     = new Signup({
                     username  : (req.user.displayName ?
                      req.user.displayName : req.user.username),
                     product   : req.body[i].product,
                     coast     : req.body[i].geo,
                     holiday   : req.body[i].holiday,
                     successful: successful
                    });
    entries.push(entry);
   }
   response.accepted = accepted;
   response.rejected = rejected;
   Signup.collection.insert(entries)
   .then(function(docs){
    res.set('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
   })
   .catch(function(err){
   });(function(err){
       console.log(req.body);
       res.set('Content-Type', 'text/plain');
       res.end("error inserting into database");
      });
  } else {
    res.set('Content-Type', 'text/plain');
    res.end('Empty selections are not acceptable!');
  }
 } else if (req.user && (Event.startUTCTime > currentUTCTime)){
  req.flash('error', 'Not time yet!');
  res.redirect('/');
 } else {
   req.flash('error', 'Need to be logged in!');
   res.redirect('/');
 }




  }
 });


};
