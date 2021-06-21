const express = require('express')
const app= express()
const sessionStorage = require("node-sessionstorage");
var server = app.listen(3000, () => console.log("listening on port " + 3000 + "! :)"));

//datenbank enpunkt einbinden ?

//https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded
app.use(express.json());


app.use("/html",express.static(__dirname+"/src/html/"));

//Website
app.get("/" ,(req,res)=>{
    res.sendFile(__dirname+"/src/html/index.html")
    })



//Entwurfs-Datenbank: get; post:dbabfrage mit parametern; put: parameter auswahl, param change; delete: params
app.get("/db",(req,res)=>{ 
    //async öffnen des DBServer
    next();});
app.post("/db",(req,res)=>{ 
    //async öffnen des DBServer
    next();});
app.put("/db",(req,res)=>{ 
    //async öffnen des DBServer
    next();
});
app.delete("/db",(req,res)=>{ 
    //async öffnen des DBServer
    next();
});


//Like-Dislike Funktion: get; post: dbabfrage mit parametern; put parameter; 
app.get("/likes",(req,res)=>{
    //async öffnen des DBServer/likes
    next(); 
})
app.post("/likes",(req, res)=>{
    //async öffnen des DBServer/likes
    next(); 
})
app.put("/likes", (req, res)=>{
    //async öffnen des DBServer/likes
    next(); 
})


//Login: get; post: dbabfrage mit login informationen; put: login; param change; 
app.post("/path",(req, res)=>{ next(); 
}); 
app.delete("/logout",(req,res)=>{
    req.logOut()
    res.redirect("/login")
})



