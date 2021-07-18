//**various jshint configs**
// jshint esversion: 8
// jshint browser: true
// jshint node: true
// jshint -W117
// jshint -W083
"use strict";

const express = require('express');
const app= express();
const sessionStorage = require("node-sessionstorage");
//localhost:3000
var server = app.listen(3000, () => console.log("listening on port " + 3000 + "! :)"));

//datenbank enpunkt einbinden ?

//https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded
app.use(express.json());


app.use("/html",express.static(__dirname+"/src/html"));

//Frontend
app.use("/public",express.static(__dirname+"/src"));
var options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    index: false,
    redirect: false
    }
app.use("/",express.static(__dirname+"/src/html/", options)) //!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.get("/",(req,res)=>{
    res.redirect("/index");
})
////////////Webseiten///////////////////////////////////
//
//Website-Startseite

//Entwurfs-Datenbank: get; post:dbabfrage mit parametern; update: parameter auswahl, param change; delete: params
app.get("/db",(req,res)=>{
    //async öffnen des DBServer
    next();});
app.post("/db",(req,res)=>{
    //async öffnen des DBServer
    next();});
/*app.update("/db",(req,res)=>{
    //async öffnen des DBServer
    next();
});*/
// app.delete("/db",(req,res)=>{
//     //async öffnen des DBServer
//     next();
// });


//Like-Dislike Funktion: get; post: dbabfrage mit parametern; update parameter;
app.get("/likes",(req,res)=>{
    //async öffnen des DBServer/likes
    next();
});
app.post("/likes",(req, res)=>{
    //async öffnen des DBServer/likes
    next();
});
/*app.update("/likes", (req, res)=>{
    //async öffnen des DBServer/likes
    next();
})*/


//Login: get; post: dbabfrage mit login informationen; update: login; param change;
app.post("/path",(req, res)=>{ next();
});
app.delete("/logout",(req,res)=>{
    req.logOut();
    res.redirect("/login");
});
