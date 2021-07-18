//**various jshint configs**
// jshint esversion: 8
// jshint browser: true
// jshint node: true
// jshint -W117
// jshint -W083
"use strict";


var $password = $('#Password');
var $username = $('#Username');

$('#loginButton').on('click', function(){

var data = {
v1: $password.val(),
v2: $username.val(),
};

$.ajax({
  type: 'POST',
  url: '3000/login', // endpoint
  data: data
}
);
});


// Funktionen fuer die Button auf der Seite index
function login(){
  /* */
}
function weiterZurRegistrierung(){
  /* */
}

// Funktionen fuer die Button auf der Seite index_Registrierung
function createUser(){
  /* */
}
function deleteInputs(){
  /* */
}

// Funktionen fuer die Button auf der Seite index_user_EntwurfHochladen
function uploadDraft(){
  /* */
}
function deleteDraft(){
  /* */
}

// Funktionen fuer die Button auf der Seite index_user_EntwurfAnsehen
/* ----------------- Entwuerfe----------------------*/
function likekDraft(){ // Enwurf liken
  /* */
}
function dislikeDraft(){  // Entwurf disliken
  /* */
}
function reportDraft(){ // Enwurf melden
  /* */
}
/* ----------------- Kommentare ----------------------*/
function addDraft(){  // Kommentar hinzufuegen
  /* */
}
function editDraft(){  // Kommentar bearbeiten
  /* */
}
function likeDraft(){  // Kommentar liken
  /* */
}
function dislikeComment(){  // Kommentar disliken
  /* */
}
function reportComment(){  // Kommentar melden
  /* */
}

var upvoted = 0;
var downvoted = 0;
function upvote() {
  if(upvoted == 0) {
    if(downvoted == 1) {
      document.getElementById("likeCounter").innerHTML =  parseInt(document.getElementById("likeCounter").innerHTML) + 1;
      document.getElementById("dislikeCounter").innerHTML =  parseInt(document.getElementById("dislikeCounter").innerHTML) - 1;
    } else {
      document.getElementById("likeCounter").innerHTML =  parseInt(document.getElementById("likeCounter").innerHTML) + 1;
    }
    upvoted = 1;
    downvoted = 0;
    document.getElementById("likebtn").style.backgroundColor = "#0490FB"
    document.getElementById("dislikebtn").style.backgroundColor = "#909090"
  } else {
    document.getElementById("likeCounter").innerHTML =  parseInt(document.getElementById("likeCounter").innerHTML) - 1;
    upvoted = 0;
    downvoted = 0;
    document.getElementById("likebtn").style.backgroundColor = "#909090"
    document.getElementById("dislikebtn").style.backgroundColor = "#909090"
  }

}
function downvote() {
  if(downvoted == 0) {
    if(upvoted == 1) {
      document.getElementById("dislikeCounter").innerHTML =  parseInt(document.getElementById("dislikeCounter").innerHTML) + 1;
      document.getElementById("likeCounter").innerHTML =  parseInt(document.getElementById("likeCounter").innerHTML) - 1;
    } else {
      document.getElementById("dislikeCounter").innerHTML =  parseInt(document.getElementById("dislikeCounter").innerHTML) + 1;
    }
    downvoted = 1;
    upvoted = 0;
    document.getElementById("likebtn").style.backgroundColor = "#909090"
    document.getElementById("dislikebtn").style.backgroundColor = "#0490FB"
  } else {
    document.getElementById("dislikeCounter").innerHTML =  parseInt(document.getElementById("dislikeCounter").innerHTML) - 1;
    downvoted = 0;
    upvoted = 0;
    document.getElementById("likebtn").style.backgroundColor = "#909090"
    document.getElementById("dislikebtn").style.backgroundColor = "#909090"
  }
}
function melden() {
  if (confirm("Wollen Sie diesen Beitrag melden?")) {
    alert("Der Beitrag wurde erfolgreich gemeldet");
  }
  else {
    return false;
  }
}
