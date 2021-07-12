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
