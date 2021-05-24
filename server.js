const express = require('express')
const app= express()
const sessionStorage = require("node-sessionstorage");
var server = app.listen(3000, () => console.log("listening on port " + 3000 + "! :)"));

//datenbank enpunkt einbinden ?

//https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded
app.use(express.json());
app.use("/html",express.static(__dirname+"/src/html/"));

app.get("/" ,(req,res)=>{
    res.sendFile(__dirname+"/src/html/index.html")
    })
