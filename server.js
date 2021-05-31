const express = require('express')
require('dotenv').config()
const axios = require('axios').default;
const app= express()
const sessionStorage = require("node-sessionstorage");
var server = app.listen(3000, () => console.log("listening on port " + 3000 + "! :)"));

if (process.env.DB_HOST) {
    dbHost = process.env.DB_HOST;
  } else {
    dbHost = 'localhost';
  }

//datenbank enpunkt einbinden ?

//https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded
app.use(express.json());


app.use("/html",express.static(__dirname+"/src/html/"));

//Website
app.get("/" ,(req,res,next)=>{
    res.sendFile(__dirname+"/src/html/index.html")
    })

// abc(type,data,then,catch)=axios.$type('https://'+process.env.MASTER_HOST+'?api_key='+process.env.MASTER_KEY+'&date=2017-08-03')

//abc(get,(response)=>{res.send(response)},(response)=>{res.send(response)})

function SendHelp(h,d,t,c){ //h[ttp method], d[ata], t[hen function!],c[atch function!]
    d != "" ? d=", {"+d+"}" : d=""; //ausprobieren!!
    console.log(`
    axios.`+h+`(\'http://`+dbHost+`:3040/`+d+`\')"
    .then(`+t+`)
    .catch(`+c+`)    
`
)
//        axios.`+h+`('https://'+dbHost+'?api_key='+process.env.MASTER_KEY"+d+")
    return Function(`
        axios.`+h+`(\'http://`+dbHost+`:3040/`+d+`\')"
        .then(`+t+`)
        .catch(`+c+`)    
    `)();
}

//Entwurfs-Datenbank: get; post:dbabfrage mit parametern; update: parameter auswahl, param change; delete: params
app.get("/db",(req,res,next)=>{ //SendHelp("get","",(response)=>{console.log("/db.get successful");res.send(response.data);},(error)=>{console.log("/db.get error");res.send(error.data);});

   // axios.get('https://'+process.env.MASTER_HOST+'?api_key='+process.env.MASTER_KEY+'&date=2017-08-03')

   axios.get('http://'+dbHost+":3040/")

        //Promises.all bzw Axios.spread möglicherweise notwendig?
        .then(function (response) {
            console.log("/db.get successful");
            res.send(response.data);
          })
        .catch(function (error) {
            // handle error
            console.log("/db.get error");
            console.log(error.data)
            res.send(error.data)
          }) 
          

    //async öffnen des DBServer
    });
app.post("/db",(req,res,next)=>{ 
    //async öffnen des DBServer
    next();});
app.put("/db",(req,res,next)=>{ 
    //async öffnen des DBServer
    next();
});
app.delete("/db",(req,res,next)=>{ 
    //async öffnen des DBServer
    next();
});


//Like-Dislike Funktion: get; post: dbabfrage mit parametern; update parameter; 
app.get("/likes",(req,res,next)=>{
    //async öffnen des DBServer/likes
    next(); 
})
app.post("/likes",(req,res,next)=>{
    //async öffnen des DBServer/likes
    next(); 
})
app.put("/likes", (req,res,next)=>{
    //async öffnen des DBServer/likes
    next(); 
})


//Login: get; post: dbabfrage mit login informationen; update: login, param change; 
app.post("/path",(req,res,next)=>{ next(); 
}); 
app.delete("/logout",(req,res,next)=>{
    req.logOut()
    res.redirect("/login")
})



