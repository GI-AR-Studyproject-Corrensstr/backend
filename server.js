const express = require('express')
require('dotenv').config()
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

// abc(type,data,then,catch)=axios.$type('https://'+process.env.MASTER_HOST+'?api_key='+process.env.MASTER_KEY+'&date=2017-08-03')

//abc(get,(response)=>{res.send(response)},(response)=>{res.send(response)})

function SendHelp(h,d,t,c){ //h[ttp method], d[ata], t[hen function!],c[atch function!]
    d != "" ? d=", {"+d+"}" : d=""; //ausprobieren!!
    return Function(`
        axios.`+h+`('https://'+process.env.MASTER_HOST+'?api_key='+process.env.MASTER_KEY"+d+")
        .then(`+t+`)
        .catch(`+c+`)    
    `)();
}

//Entwurfs-Datenbank: get; post:dbabfrage mit parametern; update: parameter auswahl, param change; delete: params
app.get("/db",(req,res)=>{ //SendHelp("get",,(response)=>{console.log("/db.get successful");res.send(response);},(error)=>{console.log("/db.get error");});

    axios.get('https://'+process.env.MASTER_HOST+'?api_key='+process.env.MASTER_KEY+'&date=2017-08-03')

        //Promises.all bzw Axios.spread möglicherweise notwendig?
        .then(function (response) {
            console.log("/db.get successful");
            res.send(response);
          })
        .catch(function (error) {
            // handle error
            console.log("/db.get error");
          })

    //async öffnen des DBServer
    next();});
app.post("/db",(req,res)=>{ 
    //async öffnen des DBServer
    next();});
app.update("/db",(req,res)=>{ 
    //async öffnen des DBServer
    next();
});
app.delete("/db",(req,res)=>{ 
    //async öffnen des DBServer
    next();
});


//Like-Dislike Funktion: get; post: dbabfrage mit parametern; update parameter; 
app.get("/likes",(req,res)=>{
    //async öffnen des DBServer/likes
    next(); 
})
app.post("/likes",(req, res)=>{
    //async öffnen des DBServer/likes
    next(); 
})
app.update("/likes", (req, res)=>{
    //async öffnen des DBServer/likes
    next(); 
})


//Login: get; post: dbabfrage mit login informationen; update: login, param change; 
app.post("/path",(req, res)=>{ next(); 
}); 
app.delete("/logout",(req,res)=>{
    req.logOut()
    res.redirect("/login")
})



