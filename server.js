const express = require('express')
const http = require ('http');
const https = require('https');
const fs = require('fs');
var privateKey = fs.readFileSync('./SSL/key.pem', 'utf8'); 
var certificate = fs.readFileSync('./SSL/cert.pem', 'utf8');
require('dotenv').config()
const axios = require('axios').default;
const app= express()
const sessionStorage = require("node-sessionstorage");
const e = require('express');
sessionStorage.setItem("storedUser",{});
var uniqid = require('uniqid');
var expiry = require('expiryprops');
expiry.defaultTimer(30000);//ms
var colors = require('colors');
var cookieParser = require('cookie-parser');
app.use(cookieParser());


//cloned https://github.com/kodi/JS-Object-Expire


//session store abspeichern https://www.npmjs.com/package/session-file-store


/*app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());/*

//var server = app.listen(3000, () => console.log("listening on port " + 3000 + "! :)"));

//https://stackoverflow.com/questions/11744975/enabling-https-on-express-js

/**const ssloptions = {
    key: fs.readFileSync('./SSL/key.pem'),
    cert: fs.readFileSync('./SSL/cert.pem')
  };
*/
//port="3040"; //Testumgebung
port="80"; //Masterserver

var ssloptions = {key: privateKey, cert: certificate}; 

http.createServer(app).listen(3000,() => console.log("listening on port "+ 3000+ " for HTTP! :)"));
https.createServer(ssloptions, app).listen(3001,() => console.log("listening on port "+ 3001+ " for HTTPS! :)"));

if (process.env.DB_HOST) {
    dbHost = process.env.DB_HOST;
  } else {
    dbHost = 'localhost';
  }
  process.env.logs?true:logs=process.env.logs;

console.log("dbHost="+dbHost)
const rasterX={ "/asset":"/api/asset",
                "/asset/report":"/api/asset/ID/report",
                "/comment":"/api/comment",
                "/comment/report":"/api/comment/ID/report",
                "/comment/like":"/api/comment/ID/vote",
                "/db/report":"/api/suggestion/ID/report",
                "/db/comment":"/api/suggestion/ID/comment",
                "/db/like":"/api/suggestion/ID/vote",
                "/db":"/api/suggestion",
                "/like":"/api/ID/vote",
                "/login":"/api/login",
                "/marker":"/api/marker",
                "/template":"/api/asset/template",
                "/register":"/api/register"}

// Bereitgestellte Bibliotheken
app.use('/bootstrap', express.static(__dirname+'/node_modules/bootstrap/dist'));
app.use('/jquery', express.static(__dirname+"/node_modules/jquery/dist/"));

//https://stackoverflow.com/questions/51143730/axios-posting-empty-request/56640357
  axios.defaults.headers.common = {
    "Content-Type": "application/json"
  }


//https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded
app.use(express.urlencoded({ extended: true}));

app.use("/html",express.static(__dirname+"/src/html/"));

//Website
app.get("/" ,(req,res,next)=>{
    res.sendFile(__dirname+"/src/html/index.html")
    })

/**
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @param {String} a "get","post", "put", "delete"
 * @param {String} msgpth msgpth = Pfad bezeichner zu API Endpoint zB "/DB"
 * @param {String} d data bei post und put, in JSON
 */
//https://brandoncc.medium.com/how-to-handle-unhandledrejection-errors-using-axios-da82b54c6356

/**
 * Errorhandler, nur interne Funktion für ShortAxios um viel reduntante Schreibarbeit zu ersparen
 * @param {*} error 
 */
function err(error,req,res,a,msgpth,d) {
    console.log(msgpth+" "+a+" error"); 
    if (error.response) {
      // Request made and server responded
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
      console.log(res._header);
    }
    //console.log(error);
    res.send(error.response.data)
}

 /**
  * Abkürzungsfunktion von Axios
  * @param {*} req node request
  * @param {*} res node response
  * @param {String} a Http-Methode, die geswitched wird: get,post,put,delete
  * @param {String} msgpth Bezeichner für API-Endpoint. Schlägt in rasterX nach.
  * @param {Object} d data bei post und put in JSON
  * @param {Number} id von node aus der URL übergebener ID-Parameter
  */

function ShortAxios(req,res,a,msgpth,d,id){
    log?console.log("Eingang Shortaxios(req,res,a,msgpth,d,id) mit: (",req,res,a,msgpth,d,id,")"):true;
    let raster={"":""}; 
    raster=Object.assign({},rasterX);
    if(id!=undefined){
        id="/"+id;
        if(raster[msgpth].includes("/ID")){
            raster[msgpth]=raster[msgpth].replace("/ID",id);
        }else{
        raster[msgpth]=raster[msgpth]+id;}
        }else{id="";}
    log?console.log("raster ",raster):true;
        switch (a) {
        case "get":
            console.log("get: http://"+dbHost+":"+port+raster[msgpth]);
            axios.get("http://"+dbHost+":"+port+raster[msgpth])
            .then((response)=>{
                console.log(msgpth+" "+a+" successful");
                res.send(response.data);
            })
            .catch((error)=>{log?console.log("Erroraufruf"):true; err(error,req,res,a,msgpth,d)});
            break;
        case "post":
            console.log("http://"+dbHost+":"+port+raster[msgpth]+","+JSON.stringify({...d}));
            axios.post("http://"+dbHost+":"+port+raster[msgpth],{...d})
            .then((response)=>{
                console.log(msgpth+" "+a+" successful");
                console.log(response.data);
                res.send(response.data);
                })
            .catch((error)=>{log?console.log("Erroraufruf"):true;err(error,req,res,a,msgpth,d)});
            break;
        case "put":
            console.log("ShortAxios put: "+ "http://"+dbHost+":"+port+raster[msgpth]+id,d);
            axios.put("http://"+dbHost+":"+port+raster[msgpth],{...d})
            .then((response)=>{
                console.log(msgpth+" "+a+" successful");
                res.send(response.data);
            })
            .catch((error)=>{log?console.log("Erroraufruf"):true; err(error,req,res,a,msgpth,d)});
            break;
        case "delete":
            console.log("delete: http://"+dbHost+":"+port+raster[msgpth])
            axios.delete("http://"+dbHost+":"+port+raster[msgpth])
            .then((response)=>{
                console.log(msgpth+" "+a+" successful");
                res.send(response.data);
            })
            .catch((error)=>{log?console.log("Erroraufruf"):true; err(error,req,res,a,msgpth,d)});
            break;
        default:
            break;
    }
}

//1.1) 
app.get("/db",(req,res)=>{  //get all suggestions
    ShortAxios(req,res,"get","/db");
    });

app.post("/db",(req,res)=>{ //add new suggestion
    ShortAxios(req,res,"post","/db",req.body);
    });

app.get("/db/:id",(req,res)=>{  //get one suggestion
    ShortAxios(req,res,"get","/db","",req.params.id);
    });

app.put("/db/:id",(req,res)=>{  //change one suggestion
    ShortAxios(req,res,"put","/db",req.body,req.params.id);
});
app.delete("/db/:id",(req,res)=>{ //delete one suggestion
    ShortAxios(req,res,"delete","/db","",req.params.id);
});

app.get("/db/:id/like",(req,res)=>{  //get all likes of one suggestion
    ShortAxios(req,res,"get","/db/like","",req.params.id);
    });
app.get("/db/:id/comment",(req,res)=>{  //get all comments of one suggestion
    ShortAxios(req,res,"get","/db/comment","",req.params.id);
    });
app.post("/db/:id/report",(req,res)=>{  //report one suggestion, user_id und description 
    ShortAxios(req,res,"post","/db/report",req.body,req.params.id);
    });

    //1.2)
//Like-Dislike Funktion: get; post: dbabfrage mit parametern; update parameter; 
app.get("/like",(req,res)=>{ //get all likes
    ShortAxios(req,res,"get","/like");
})
app.post("/like",(req,res)=>{ //add new like
    ShortAxios(req,res,"post","/like",req.body);
})

//////////
app.get("/like:id",(req,res)=>{ //get one like
    ShortAxios(req,res,"get","/like","",req.params.id);
})
app.put("/like:id", (req,res)=>{ //change one like
    ShortAxios(req,res,"put","/like",req.body,req.params.id);
})
app.delete("/like:id", (req,res)=>{ //delete one like
    ShortAxios(req,res,"delete","/like","",req.params.id);
})

// 1.3)
//Kommentar, Meldung
app.get("/comment",(req,res)=>{ //get all comments
    ShortAxios(req,res,"get","/comment");
})
app.post("/comment",(req,res)=>{ //create new comment
    ShortAxios(req,res,"post","/comment",req.body);
})
////////
app.get("/comment/:id",(req,res)=>{ //get one comment by ID
    ShortAxios(req,res,"get","/comment","",req.params.id);
})
app.put("/comment/:id", (req,res)=>{ //change one comment by ID
    ShortAxios(req,res,"put","/comment",req.body,req.params.id);
})
app.delete("/comment/:id", (req,res,next)=>{ //delete one comment by ID
    ShortAxios(req,res,"delete","/comment",req.body,req.params.id);
})
////////
app.get("/comment/:id/vote",(req,res)=>{  //get all likes of one comment
    ShortAxios(req,res,"get","/comment/like","",req.params.id);
    });
app.post("/comment/:id/report",(req,res)=>{  //get all reports of one comment
    ShortAxios(req,res,"post","/comment/report",req.body,req.params.id);
    });


// 1.4) ASSET
//Get all assets
app.get("/asset",(req,res)=>{
    ShortAxios(req,res,"get","/asset");
})
//Create new asset
app.post("/asset",(req,res)=>{
    ShortAxios(req,res,"post","/asset",req.body);
})
//Get one asset by ID 
app.get("/asset/:id",(req,res)=>{
    console.log("get /asset/:id=" + req.params.id);
    ShortAxios(req,res,"get","/asset","",req.params.id);
})
//Update one Asset by ID
app.put("/asset/:id", (req,res)=>{ //existiert nicht?
    ShortAxios(req,res,"put","/asset",req.data,req.params.id); 
})
//Delete one Asset by ID
app.delete("/asset/:id",(req,res)=>{ 
    console.log("delete in id:"+req.params.id)
    ShortAxios(req,res,"delete","/asset","",req.params.id);
});
//Report one Asset
app.post("/asset/:id/report", (req, res)=>{
    ShortAxios(req,res,"post","/asset/report",req.body,req.params.id);
})

//1.5) Login & Register
//Login Post
app.get("/login"),(req,res)=>{
    res.send(login.html)
}
app.post("/login",(req,res)=>{
    d=req.body;
    console.log("http://"+dbHost+":"+port+rasterX["/login"],d);
    axios.post("http://"+dbHost+":"+port+rasterX["/login"],{...d})
            .then((response)=>{
                console.log("response got")
                console.log("login response data:"+ response.data);
                data=response.data.data;
                var currentdate = new Date(); 
                //https://stackoverflow.com/questions/10211145/getting-current-date-and-time-in-javascript
                var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

                data={...data,"Logintime_readable":datetime
                ,"Logintime":currentdate.getTime()} //time
                console.log(data);
                keys=Object.keys(data);
                console.log(keys);
                storedUser=sessionStorage.getItem("storedUser"); //Abfrage von storedUser
                console.log(data["id"]);
                let UID=uniqid();
               console.log("UID:",UID)
                console.log(storedUser)
                storedUser[data["id"]]=UID;//currentdate.getTime();
                console.log(storedUser)
                sessionStorage.setItem("keys",keys); //Schreiben von storedUser
                sessionStorage.setItem("storedUser",storedUser);
                //
               // 
               // storedUser=//{...storedUser,{"id":data["id"]}};
                //sessionStorage.setItem("storedUser", );
                
               // sessionStorage.setItem(UID,data);//data["id"],data);
                expiry.addKeyValue(UID,data,(_data=data)=>{ //_data=Object.assign({},data)
                    storedUser= sessionStorage.getItem("storedUser");
                    delete storedUser[_data["id"]];
                    console.log(PrintDate(), "deleted Session from",_data["first_name"],_data["last_name"],"ID :",_data["id"])
                    sessionStorage.setItem("storedUser",storedUser);
                });
                console.log("cookies from answere successfully loaded");
                res.cookie("SessionData",{"SessionID":UID,"first_name":data["first_name"],"last_name":data["last_name"]},{expires: new Date(Date.now()+expiry.defaultTimer())})
                res.send(response.data);
            })
            .catch((error) => { 
                console.log("Error loading cookies"); 
                //err(error,req,res,"login","/login",d)
                try{
                console.log(error.response.data)
            
                res.send(error.response.data);
                }catch(e){
                    console.log(error);
                    res.send(error);
                }
            }); 
}); 
// SessionStorage auslesen
app.get("/ff",checkAuthenticated,(req,res)=>{
    //addKeyValue(key, value [, timeoutMs] [, callback])

    /*if(req.cookies){
        console.log(PrintDate(), "No Cookies Exist");
        res.send("No cookies Exist")
    }else{
        console.log(PrintDate(),req.cookies);
        res.send("ok")
    }*/
    res.send("ende")

   /* data= {
        "id": 1,
        "first_name": "Test",
        "last_name": "User",
        "profile_photo": "https://www.processmaker.com/wp-content/uploads/2020/10/citizen-developer-768x512.jpg"
    }
    expiry.addKeyValue("SessionID",data,(_data=data)=>{
        delete data[deldel];
        console.log("afterdel", data);

        console.log(PrintDate(),"callback activated","deleted", _data)})
    console.log(PrintDate(),": obj :", expiry.obj["SessionID"]);*/
    
})
function checkAuthenticated(req,res,next){
    if(Object.getPrototypeOf(req.cookies)!=null){
        //Case cookies are Set
        if(req.cookies["SessionData"]==undefined){
            //andere cookies gesetzt, aber nicht unsere.
        }else{
            //hier kann unser Stuff beginnen, also es ist jemand authentifiziert
            //redirekt auf userseiten
        }
    }else{
        console.log("No cookies are set");
        console.log(PrintDate(), "req.cookies[\"SessionData\"]",req.cookies["SessionData"]);
        //no cookies are set aka no login aka guest.
        //redirekt auf login bzw Guestseiten
    }
    next();
}
function PrintDate(){
    var currentdate = new Date(); 
    //https://stackoverflow.com/questions/10211145/getting-current-date-and-time-in-javascript
    var datetime =  currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/" 
    + currentdate.getFullYear() + " @ "  
    + currentdate.getHours() + ":"  
    + currentdate.getMinutes() + ":" 
    + currentdate.getSeconds() + "."
    + currentdate.getMilliseconds();
    return datetime.brightBlue;
}
app.get("/ss",(req,res)=>{
    temp=[];
    try {
    //for (a of sessionStorage.getItem("keys")) {}
    temp=sessionStorage.getItem("storedUser");
    /*iOver=Object.keys(sessionStorage.getItem("storedUser"));
    for (const a of iOver) {
        curr= sessionStorage.getItem(a)
        temp=[...temp,curr];
        }*/
    } catch(e){temp="Bitte zuerst anmelden"}
    res.send(temp);
})
app.get("/ss/:id",(req,res)=>{
    temp={};
    try {
    //for (a of sessionStorage.getItem("keys")) {}
        temp=sessionStorage.getItem("storedUser");
        temp=temp[req.params.id];
        fullobj=expiry.obj[temp];
        temp={"SessionID":temp,...fullobj};
        if (temp==undefined){throw e;}
        console.log(temp);
    } catch(e){temp="Bitte zuerst anmelden"}
    res.send(temp);
})
//Logout und delete Session
app.delete("/logout",(req,res)=>{
    //delete Session
    CookieData=req.cookies;
    console.log(CookieData,CookieData["SessionData"]["SessionID"]);
    res.clearCookie("SessionData");
    expiry.rmKey(key=CookieData["SessionData"]["SessionID"]);

    
    /*try {
        for (a of sessionStorage.getItem("keys")) {
            sessionStorage.removeItem(a);
        }
        sessionStorage.removeItem("keys");
        } catch(e){temp="Bitte zuerst anmelden"}*/
        res.send("Session deleted");
   // res.redirect("/login")
})
//Register
app.post("/register",(req,res)=>{
    ShortAxios(req,res,"post","/register",req.body);
})


//1.6) TEMPLATE
//Get all templates (suggestions)
app.get("/template",(req,res)=>{
    ShortAxios(req,res,"get","/template");
})

//1.7) Marker
//get all markers
app.get("/marker",(req,res)=>{
    ShortAxios(req,res,"get","/marker");
})
//create one new marker
app.post("/marker",(req,res)=>{
    ShortAxios(req,res,"post","/marker",req.body);
})
//get one marker by id
app.get("/marker/:id",(req,res)=>{  //Testen
    ShortAxios(req,res,"get","/marker","",req.params.id);
})
//change one marker
app.put("/marker/:id",(req,res)=>{ 
    ShortAxios(req,res,"put","/marker",req.body,req.params.id);
})
//delete one marker by id
app.delete("/marker/:id",(req,res)=>{ 
    ShortAxios(req,res,"delete","/marker",req.data,req.params.id);
});




/**
 * Neue Funktion -> muss noch gestestet werden
 */

function AuthenticateFunction() {
    return null; //Muss noch ergänzt werden.
}

//Authentifizierungsrouter und Openrouter
var authRouter = express.Router(); 
var openRouter = express.Router(); 

authRouter.use(AuthenticateFunction); 

//Get-Method Entwurfs-Auswahl 
authRouter.get("/entwurfsAuswahl", (req, res, next) => {
    res.sendFile("Filepath")
});

//Get-Method Entwurfs-Ansicht 
authRouter.get("/entwurfsAuswahl", (req, res, next) => {
    res.sendFile("Filepath")
});

//Get-Method neuer Entwurf
authRouter.get("/entwurfsAuswahl", (req, res, next) => {
    res.sendFile("Filepath")
});

//Get-Method AR
authRouter.get("/entwurfsAuswahl", (req, res, next) => {
    res.sendFile("Filepath")
});


