const mongoose = require('mongoose');
var availability   = new Object;
const products     = ["SH",
                      "ARX",
                      "SteelConnect",
                      "SteelFusion",
                      "Cascade",
                      "NPCM",
                      "AIX"];
const holidates    = ["2017-11-23",
                      "2017-11-24",
                      "2017-12-25",
                      "2017-12-26",
                      "2018-01-01"];
const startUTCTime = new Date('2017-10-25T18:00:00');

for (product in products){
 availability[products[product]] = {"West" : "", "East": ""};
 var daysWest         = new Object;
 var daysEast         = new Object;
 for (holidate in holidates){
  daysWest[holidates[holidate]] = {"count" : 1};
  daysEast[holidates[holidate]] = {"count" : 1};
 }
 for (holidate in holidates){
  availability[products[product]]["West"] = daysWest;
  availability[products[product]]["East"] = daysEast;
  if (products[product] == "SH" && (holidates[holidate] == 
                                   "2017-11-24" || holidates[holidate] ==
                                   "2017-12-26")){
   availability[products[product]]["West"]
                              [holidates[holidate]].count = 7;
   availability[products[product]]["East"]
                              [holidates[holidate]].count = 7;
  } else if (products[product] == "SH"){
   availability[products[product]]["West"]
                              [holidates[holidate]].count = 3;
   availability[products[product]]["East"]
                              [holidates[holidate]].count = 3;
  }
 }
}

const eventSchema  = new mongoose.Schema({
  name               : {type: String,  required: true},
  current            : {type: Boolean, required: true},
  enabled            : {type: Boolean, required: true}
});
const Event = mongoose.model('Event', eventSchema);
exports.availability = availability;
exports.products     = products;
exports.holidates    = holidates;
exports.startUTCTime = startUTCTime;
