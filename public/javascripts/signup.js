
   /* Polyfill for String.includes */
    if (!String.prototype.includes) {
     String.prototype.includes = function(search, start) {
      'use strict';
      if (typeof start !== 'number') {
       start = 0;
      }
      if (start + search.length > this.length) {
       return false;
      } else {
       return this.indexOf(search, start) !== -1;
      }
     };
    }

var selections = [];

function selectProduct(id){
    var myNumber = id.slice(-10);
    var selection =  new Object();
    selection.holiday = myNumber;
    if (id.includes("npcm")){
         document.getElementById("npcm-west-" + myNumber)
                 .removeAttribute("class","btn-default");
         document.getElementById("npcm-east-" + myNumber)
                 .removeAttribute("class","btn-default");
         document.getElementById("npcm-west-" + myNumber)
                 .setAttribute("class","btn btn-success btn-block")
         document.getElementById("npcm-east-" + myNumber)
                 .setAttribute("class","btn btn-success btn-block");
         selection.product = "NPCM";
         selection.geo     = "";
         selections.push(selection);

    } else {
         document.getElementById(id).removeAttribute("class","btn-default")
         document.getElementById(id)
                 .setAttribute("class","btn btn-success btn-block")
         selection.product = document.getElementById(id).innerHTML;
         selection.geo     = id.includes("west") ? "West" : "East";
         selections.push(selection);
    }
    var buttons  = document.getElementsByTagName("button");
    for (var i = 0; i<buttons.length;i++){
        if(!buttons[i].id.includes("reset") &&
           !buttons[i].id.includes("submit")&&
            buttons[i].id.includes(myNumber))
        {
            buttons[i].setAttribute("disabled", "disabled");
        }
    }
}
function reserve(id){
    var xhr =  new XMLHttpRequest();
    xhr.open("POST", "reserve", true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send(JSON.stringify(selections));
    xhr.onreadystatechange = function(){
    reserveResponse(xhr);
    }
}
function reserveResponse(xhr){

     if (xhr.readyState == 4 && xhr.status == 200) {
      const bodyContainer = document.querySelector('body > div.container');

      const myModal = document.getElementById('myModalTrigger');
      myModal.Modal.hide();

      while (bodyContainer.firstChild){
       bodyContainer.removeChild(bodyContainer.firstChild);
      }

      if (xhr.getResponseHeader('Content-Type') == 'application/json'){
       const signupResponse = JSON.parse(xhr.responseText);
       const rejections     = signupResponse.rejected;
       const accepted       = signupResponse.accepted;

       if (accepted.length > 0){
        const acceptedHeader        = document.createElement("div");
        acceptedHeader.setAttribute("class", "page-header");
        bodyContainer.appendChild(acceptedHeader);
        const feeedbackMessageNode   = document.createTextNode(
                                      "Congratulations, you're" +
                                      " signed up for these!");
        const feedbackMessageEl      = document.createElement("h4");
        feedbackMessageEl.appendChild(feeedbackMessageNode);
        bodyContainer.appendChild(feedbackMessageEl);
        for (accept in accepted){
         var messageText      = "";
         const holiday          = new Date(accepted[accept].holiday)
                                   .toUTCString().slice(0,16);
         if (accepted[accept].coast == ""){
          messageText    = " " + accepted[accept].product + " for " +
                          "both coasts on " + holiday;
         } else {
          messageText    = " " + accepted[accept].product + " for " +
                          accepted[accept].coast + " coast on " +
                          holiday;
         }
         const messageNode    = document.createTextNode(messageText);
         const iconSpan       = document.createElement("span");
         const messageDiv     = document.createElement("div");
         const confirmation   = document.createElement("div");
         iconSpan.setAttribute("class", "glyphicon glyphicon-ok-sign");
         iconSpan.setAttribute("aria-hidden", "true");
         messageDiv.appendChild(iconSpan);
         messageDiv.appendChild(messageNode);
         confirmation.setAttribute("class", "alert alert-info");
         confirmation.appendChild(messageDiv);
         bodyContainer.appendChild(confirmation);
        }
       }


       if (rejections.length > 0){
        const rejectionHeader        = document.createElement("div");
        rejectionHeader.setAttribute("class", "page-header");
        bodyContainer.appendChild(rejectionHeader);
        const feeedbackMessageNode   = document.createTextNode(
                                      "These selections could not be granted" +
                                      ", looks like you were out" +
                                      " rock-n-rolled!");
        const feedbackMessageEl      = document.createElement("h4");
        feedbackMessageEl.appendChild(feeedbackMessageNode);
        bodyContainer.appendChild(feedbackMessageEl);

        for (reject in rejections){
         var messageText      = "";
         const holiday          = new Date(rejections[reject].holiday)
                                   .toUTCString().slice(0, 16);
         if (rejections[reject].coast == ""){
          messageText    = " " + rejections[reject].product + " for " +
                          "both coasts on " + holiday;
         } else {
          messageText    = " " + rejections[reject].product + " for " +
                          rejections[reject].coast + " coast on " +
                          holiday;
         }
         const messageNode    = document.createTextNode(messageText);
         const iconSpan       = document.createElement("span");
         const messageDiv     = document.createElement("div");
         const confirmation   = document.createElement("div");
         iconSpan.setAttribute("class", "glyphicon glyphicon-remove-sign");
         iconSpan.setAttribute("aria-hidden", "true");
         messageDiv.appendChild(iconSpan);
         messageDiv.appendChild(messageNode);
         confirmation.setAttribute("class", "alert alert-success");
         confirmation.appendChild(messageDiv);
         bodyContainer.appendChild(confirmation);
        }
       }
      } else {
       const messageNode    = document.createTextNode(" Empty selections"   +
                                                      " are not acceptable!"+
                                                      " Please refresh page"+
                                                      " and try again");
       const iconSpan       = document.createElement("span");
       const messageDiv     = document.createElement("div");
       const confirmation   = document.createElement("div");
       iconSpan.setAttribute("class", "glyphicon glyphicon-exclamation-sign");
       iconSpan.setAttribute("aria-hidden", "true");
       messageDiv.appendChild(iconSpan);
       messageDiv.appendChild(messageNode);
       confirmation.setAttribute("class", "alert alert-info");
       confirmation.appendChild(messageDiv);
       bodyContainer.appendChild(confirmation);
       
      }


      window.scrollTo(0, 0);

     }
}
function reset(id){
    var buttons  = document.getElementsByTagName("button");
    var myNumber = id.slice(-10);
    var i        = selections.length;
    while(i--){
     if (selections[i] &&
         selections[i].hasOwnProperty("holiday") &&
         selections[i]["holiday"] === myNumber)
        selections.splice(i, 1);
    } 
    for (var i = 0; i<buttons.length;i++){
        if(!buttons[i].id.includes("reset")  &&
           !buttons[i].id.includes("submit") &&
            buttons[i].id.includes(myNumber))
        {
            buttons[i].removeAttribute("disabled", "disabled");
            buttons[i].setAttribute("class","btn btn-default btn-block")
        }
    }
}
