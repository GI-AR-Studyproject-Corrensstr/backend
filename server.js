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
var SessionLength=30000 //ms
expiry.defaultTimer(SessionLength);
var colors = require('colors');
var cookieParser = require('cookie-parser');
const updateDotenv = require('update-dotenv');
const { env } = require('process');
app.use(cookieParser());

//session store abspeichern https://www.npmjs.com/package/session-file-store
//https://stackoverflow.com/questions/11744975/enabling-https-on-express-js

//port="3040"; //Testumgebung
port="80"; //Masterserver

load();

var ssloptions = {key: privateKey, cert: certificate}; 

http.createServer(app).listen(3000,() => console.log(PrintDate(),"listening on port "+ 3000+ " for HTTP! :)"));
https.createServer(ssloptions, app).listen(3001,() => console.log(PrintDate(),"listening on port "+ 3001+ " for HTTPS! :)"));

if (process.env.DB_HOST) {
    dbHost = process.env.DB_HOST;
  } else {
    dbHost = 'localhost';
  }
  process.env.logs=!undefined?logs=process.env.logs:true;
  clog("talkative logs activated")

clog("dbHost="+dbHost)
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
                "/register":"/api/register",
                "/ff":"/api/suggestion"    
            }
                clog(rasterX);

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
    console.log(PrintDate(), msgpth,a,"error"); 
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
    res.send(error);
    //res.send(error.response.data)
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
    
    clog("Eingang Shortaxios(req,res,a,msgpth,d,id) mit req,res",",a:",a,",msgpth:",msgpth,",d:",d,",id:",id,")");
    let raster={"":""}; 
    raster=Object.assign({},rasterX);
    if(isFunction(arguments[arguments.length-1])){
        clog("Short Axios: last item is function");
        callback=arguments[arguments.length-1];
    }else callback=undefined;
    if(id!=undefined&&!isFunction(id)){
        id="/"+id;
        if(raster[msgpth].includes("/ID")){
            raster[msgpth]=raster[msgpth].replace("/ID",id);
        }else{
        raster[msgpth]=raster[msgpth]+id;}
        }else{id="";}
        switch (a) {
        case "get":
            console.log(PrintDate(),"get: http://"+dbHost+":"+port+raster[msgpth]);
            return axios.get("http://"+dbHost+":"+port+raster[msgpth])
            .then((response)=>{
                console.log(PrintDate(),msgpth,a,"successful");
                if(isFunction(callback)){
                    return callback(req,res,response);
                }else{
                res.send(response.data);}
            })
            .catch((error)=>{clog("Erroraufruf");/* err(error,req,res,a,msgpth,d)*/});
            break;
        case "post":
            console.log(PrintDate(),"http://",dbHost,":",port,raster[msgpth]+",",d);
            return axios.post("http://"+dbHost+":"+port+raster[msgpth],{...d})
            .then((response)=>{
                console.log(PrintDate(),msgpth,a,"successful");
                clog("response.data:",response.data);
                if(isFunction(callback)){
                    return callback(req,res,response);
                }else{
                res.send(response.data);}
                })
            .catch((error)=>{clog("Erroraufruf");err(error,req,res,a,msgpth,d)});
            break;
        case "put":
            console.log("ShortAxios put: "+ "http://"+dbHost+":"+port+raster[msgpth]+id,d);
            return axios.put("http://"+dbHost+":"+port+raster[msgpth],{...d})
            .then((response)=>{
                console.log(PrintDate(),msgpth+" "+a+" successful");
                if(isFunction(callback)){
                    return callback(req,res,response);
                }else{
                res.send(response.data);}
            })
            .catch((error)=>{clog("Erroraufruf"); err(error,req,res,a,msgpth,d)});
            break;
        case "delete":
            console.log("delete: http://"+dbHost+":"+port+raster[msgpth])
            return axios.delete("http://"+dbHost+":"+port+raster[msgpth])
            .then((response)=>{
                console.log(PrintDate(),msgpth+" "+a+" successful");
                if(isFunction(callback)){
                    return callback(req,res,response);
                }else{
                res.send(response.data);}
            })
            .catch((error)=>{clog("Erroraufruf"); err(error,req,res,a,msgpth,d)});
            break;
        default:
            break;
    }
}

//1.1) 
app.all("*",(req,res,next)=>{clog("Eingang von",req.protocol, req.method,req.path); next();})
app.get("/db",(req,res)=>{  //get all suggestions, no restriction
    ShortAxios(req,res,"get","/db");
    });

app.post("/db",Authorized,(req,res)=>{ //add new suggestion, Authorized
    ShortAxios(req,res,"post","/db",req.body);
    });

app.get("/db/:id",(req,res)=>{  //get one suggestion, no restriction
    ShortAxios(req,res,"get","/db","",req.params.id);
    });

app.put("/db/:id",Authorized,(req,res,next)=>{
    if (isOwner(req,res)){
            next();
        }else{
            next("route");
        };
},(req,res)=>{  //change one suggestion, User, wenn du owner bist?
    ShortAxios(req,res,"put","/db",req.body,req.params.id);
});
app.delete("/db/:id",Admin,(req,res)=>{ //delete one suggestion, Admin
    ShortAxios(req,res,"delete","/db","",req.params.id);
});

app.get("/db/:id/like",(req,res)=>{  //get all likes of one suggestion, no restriction
    ShortAxios(req,res,"get","/db/like","",req.params.id);
    });
app.get("/db/:id/comment",(req,res)=>{  //get all comments of one suggestion, no restriction
    ShortAxios(req,res,"get","/db/comment","",req.params.id);
    });
app.post("/db/:id/report",Authorized,(req,res)=>{  //report one suggestion, user_id und description
    ShortAxios(req,res,"post","/db/report",req.body,req.params.id);
    });

    //1.2)
//Like-Dislike Funktion: get; post: dbabfrage mit parametern; update parameter; 
app.get("/like",(req,res)=>{ //get all likes, no restriction
    ShortAxios(req,res,"get","/like");
})
app.post("/like",Authorized,(req,res)=>{ //add new like
    ShortAxios(req,res,"post","/like",req.body);
})

//////////
app.get("/like:id",Authorized,(req,res)=>{ //get one like, Authorized
    ShortAxios(req,res,"get","/like","",req.params.id);
})
app.put("/like:id",Authorized,(req,res)=>{ //change one like, Authorized
    ShortAxios(req,res,"put","/like",req.body,req.params.id);
})
app.delete("/like:id", (req,res)=>{ //delete one like, Authorized wenn eigener.
    ShortAxios(req,res,"delete","/like","",req.params.id);
})

// 1.3)
//Kommentar, Meldung
app.get("/comment",(req,res)=>{ //get all comments, no restriction
    ShortAxios(req,res,"get","/comment");
})
app.post("/comment",Authorized,(req,res)=>{ //create new comment, Authorized
    ShortAxios(req,res,"post","/comment",req.body);
})
////////
app.get("/comment/:id",Authorized,(req,res)=>{ //get one comment by ID, Authorized
    ShortAxios(req,res,"get","/comment","",req.params.id);
})
app.put("/comment/:id", (req,res)=>{ //change one comment by ID, Authorized, wenn eigener
    ShortAxios(req,res,"put","/comment",req.body,req.params.id);
})
app.delete("/comment/:id",Admin,(req,res)=>{ //delete one comment by ID, Admin
    ShortAxios(req,res,"delete","/comment",req.body,req.params.id);
})
////////
app.get("/comment/:id/vote",Authorized,(req,res)=>{  //get all likes of one comment, Authorized 
    ShortAxios(req,res,"get","/comment/like","",req.params.id);
    });
app.post("/comment/:id/report",(req,res)=>{  //get all reports of one comment, no restriction
    ShortAxios(req,res,"post","/comment/report",req.body,req.params.id);
    });


// 1.4) ASSET
//Get all assets
app.get("/asset",(req,res)=>{ //no restriction
    ShortAxios(req,res,"get","/asset");
})
//Create new asset
app.post("/asset",Authorized,(req,res)=>{ 
    ShortAxios(req,res,"post","/asset",req.body);
})
//Get one asset by ID 
app.get("/asset/:id",Authorized,(req,res)=>{
    console.log("get /asset/:id=" + req.params.id);
    ShortAxios(req,res,"get","/asset","",req.params.id);
})
//Update one Asset by ID
app.put("/asset/:id",Authorized,(req,res)=>{ //post ist hier richtig, framework der Mastergruppe kann kein put für dateien (die bei assets angehängt sind, aka 3d Dateien/Bilder)
    ShortAxios(req,res,"post","/asset",req.body,req.params.id); //prüfen ob das so geht
})
//Delete one Asset by ID
app.delete("/asset/:id",Admin,(req,res)=>{ //Admin
    console.log("delete in id:"+req.params.id)
    ShortAxios(req,res,"delete","/asset","",req.params.id);
});
//Report one Asset
app.post("/asset/:id/report", (req, res)=>{ //no restriction
    ShortAxios(req,res,"post","/asset/report",req.body,req.params.id);
})

//1.5) Login & Register
//Login Post
app.get("/login",NotAuthorized,(req,res)=>{
    
    res.sendFile(__dirname+"/src/html/index.html")
})
app.post("/login",NotAuthorized,(req,res)=>{ //no restriction, kein Authorized oder Admin
    d=req.body;
    clog("Loginpath","http://"+dbHost+":"+port+rasterX["/login"],d);
    axios.post("http://"+dbHost+":"+port+rasterX["/login"],{...d})
            .then((response)=>{
                clog("Got response")
                clog("login response data:"+ response.data);
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
                keys=Object.keys(data);
                clog("keys",keys);
                storedUser=sessionStorage.getItem("storedUser"); //Abfrage von storedUser
                //console.log(data["id"]);
                let UID=uniqid();
                clog("UID:",UID)
                storedUser[data["id"]]=UID;//currentdate.getTime();
                clog("storedUser",storedUser)
                sessionStorage.setItem("keys",keys); //Schreiben von storedUser
                sessionStorage.setItem("storedUser",storedUser);
                expiry.addKeyValue(UID,data,(_data=data)=>{ //_data=Object.assign({},data)
                    storedUser= sessionStorage.getItem("storedUser");
                    delete storedUser[_data["id"]];
                    console.log(PrintDate(), "deleted Session from",_data["first_name"],_data["last_name"],"ID :",_data["id"])
                    sessionStorage.setItem("storedUser",storedUser);
                    save();
                });
                clog("cookies from answere successfully loaded");
                res.cookie("SessionData",{"SessionID":UID,"first_name":data["first_name"],"last_name":data["last_name"]},{expires: new Date(Date.now()+expiry.defaultTimer())})
                save();
                res.send(response.data);
            })
            .catch((error) => { 
                clog("Error loading cookies"); 
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
// expiry und SessionStorage in .env abspeichern
function save(){
    storedUserStr= JSON.stringify(sessionStorage.getItem("storedUser"));
    expiryStr=JSON.stringify(expiry);
updateDotenv({
    storedUser: storedUserStr,
    expiry: expiryStr
  }).then(() => updateDotenv({Last_Backup: PrintDate(true)}))
}
function load(){
    try{
    if(env.process.storedUser!=undefined && env.process.expiry != undefined){
        
        TEMPexpiry= JSON.parse(env.process.expiry).obj;
        sessionStorage.setItem("storedUser",TEMPstoredUser);

        for (a in TEMPexpiry) {
            if(TEMPexpiry[a].Logintime+expiry.defaultTimer()>new Date().getTime()){
                newTime= TEMPexpiry[a].Logintime+expiry.defaultTimer()-new Date().getTime();
                expiry.addKeyValue(a,TEMPexpiry[a],newTime,(_data=TEMPexpiry[a])=>{
                    storedUser= sessionStorage.getItem("storedUser");
                    delete storedUser[_data["id"]];
                    console.log(PrintDate(), "deleted Session from",_data["first_name"],_data["last_name"],"ID :",_data["id"])
                    sessionStorage.setItem("storedUser",storedUser);
                });
            }else{
                delete TEMPstoredUser[TEMPexpiry[a]["id"]];
            }
                
            }
        TEMPstoredUser= JSON.parse(env.process.storedUser);
        updateDotenv({
            storedUser: undefined,
            expiry: undefined,
            Last_Backup: undefined
          }).then(() => console.log(PrintDate(), "Backup restored successfully"))
        }else{
            console.log(PrintDate(), "No backup restored");
        }}catch(e){
            console.log(PrintDate(), "No backup restored");
        }
}
function isFunction(functionToCheck) { //https://stackoverflow.com/questions/5999998/check-if-a-variable-is-of-function-type
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
function test(a,b,c){
    console.log(arguments);
    console.log(arguments.length);
    console.log(arguments[arguments.length-1]);
    console.log(isFunction(arguments[arguments.length-1]));
    arguments[arguments.length-1]("Hallo","Welt");

}

app.put("/ff",async (req,res,next)=>{
TempIsOwner= await isOwner(req,res);
console.log("TempIsOwner", await isOwner(req,res));

//await isOwner(req,res).then(console.log("answere"));
console.log("TempIsOwnerWithuotAwait", TempIsOwner);
console.log("TempIsOwner",await TempIsOwner);
res.send("ok2.0");
})
app.get("/ff",(req,res,next)=>{
    console.log(isFunction());
      /*
    clog("Loginpath","http://"+dbHost+":"+port+rasterX["/login"],d);
    axios.post("http://"+dbHost+":"+port+rasterX["/login"],{...d})
            .then((response)=>{
                console.log("logged in", d)
            }).catch((error)=>{console.log(error);});;*/
    //test("a","b",(alpha,omega)=>{console.log(alpha,omega);});



    //GetUser(id=123);
    //log=true;
    //clog("tolles Log oder?");
    
    //console.log("expiry",expiry);
    /*Jname="cq3o5ikkshbhrdz";
    Jdata={"id":53,"first_name":"Maxi","last_name":"Testman","profile_photo":null,"role":"user","Logintime_readable":"18/8/2021 @ 11:53:36","Logintime":1629280416735};

    expiry.addKeyValue(Jname,Jdata,(_data=data)=>{ //_data=Object.assign({},data)
        storedUser= sessionStorage.getItem("storedUser");
        delete storedUser[_data["id"]];
        console.log(PrintDate(), "deleted Session from",_data["first_name"],_data["last_name"],"ID :",_data["id"])
        sessionStorage.setItem("storedUser",storedUser);
    });

    var currentdate = new Date(); 
    currentdate.getTime();

    console.log("JSONToString",JSON.stringify(expiry));
    console.log("after JSON parse",JSON.parse(JSON.stringify(expiry)))
    console.log("after JSON parse",JSON.parse(JSON.stringify(expiry)).obj)
    expData=JSON.parse(JSON.stringify(expiry)).obj
    for (a in expData) {
        console.log(expData[a])
        console.log(expData[a].Logintime)
    }*/
    
    //expiry={"obj":{"cq3o5ikkshbhrdz":{"id":53,"first_name":"Maxi","last_name":"Testman","profile_photo":null,"role":"user","Logintime_readable":"18/8/2021 @ 11:53:36","Logintime":1629280416735}}}
    //console.log("expiry",expiry);
    res.send("ok");
});
/*(req,res)=>{
    res.redirect("/login")
    //addKeyValue(key, value [, timeoutMs] [, callback])

    /*if(req.cookies){
        console.log(PrintDate(), "No Cookies Exist");
        res.send("No cookies Exist")
    }else{
        console.log(PrintDate(),req.cookies);
        res.send("ok")
    }*/
    //res.send("ende")

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
    
//}
//Utility
function isOwner(req,res){    
    console.log("isOwner_intern:","req.path",rasterX[req.path])

   /* return new Promise(resolve=>{
        if(true)resolve(true);
        else resolve(false)
    });*/
    return ShortAxios(req,res,"get",req.path,(req,res,response)=>{
        try{
        return new Promise(resolve=>{
        if(response.data["user_id"]==GetUserFromCookies(req).id){
            console.log("isOwner_intern:",true)
            return resolve(true);
        }else{
            console.log("isOwner_intern:",false)
            return resolve(false);
        }
    }
    )
    }catch{return null;}
    
})
}

function checkAuthenticated(req,res){
    clog("Entry checkAuthenticated");
    if(Object.getPrototypeOf(req.cookies)!=null){
        //Case cookies are Set
        if(req.cookies["SessionData"]==undefined){
           // res.redirect("/login")
            //andere cookies gesetzt, aber nicht unsere.
            clog("other cookies are set ...redirect...")
            return false;
        }else{
            clog("checkAuthenticated=true");
             return true;
            // kein redirect
        }
    }else{
        clog("no cookies are set ...redirect...");
        return false;
        //no cookies are set aka no login aka guest.

        
    }
}

function GetUserByName(name){
        storedUser= sessionStorage.getItem("storedUser");
        uid=storedUser[name];
        data=expiry.obj[uid];
        return {uid,...data};       
}
function GetUserFromCookies(req){
    try{
    TEMPCookies= req.cookies["SessionData"]
    return GetUserByUID(TEMPCookies.SessionID);
    }catch{
        console.log("Error in GetUserFromCookies");
        
    }
}
function GetUserByUID(uid){
    data=expiry.obj[uid];
    return {uid,...data}
}
function GetUserById(ID){ //dumm aber vielleicht mal benötigt , ungetestet
    for(a in expiry.obj){
        if(expiry.obj[a].id==ID) return {a,...expiry.obj[a]}
    }
}

function GetUserByValue(VAL){ //ungetestet
//Jdata={"id":53,"first_name":"Maxi","last_name":"Testman","profile_photo":null,"role":"user","Logintime_readable":"18/8/2021 @ 11:53:36","Logintime":1629280416735};
ret={};    
for(a in expiry.obj){
        for(b in expiry.obj[a])
        if(expiry.obj[a].b==VAL){
            ret[a]=expiry.obj[a];
        }
    }
    return ret;
}

function clog(...args){
    if(logs) console.log(PrintDate(),...args);
}

function PrintDate(bw){
    var currentdate = new Date(); 
    //https://stackoverflow.com/questions/10211145/getting-current-date-and-time-in-javascript
    var datetime =  currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/" 
    + currentdate.getFullYear() + " @ "  
    + currentdate.getHours() + ":"  
    + currentdate.getMinutes() + ":" 
    + currentdate.getSeconds() + "."
    + currentdate.getMilliseconds();
    if(bw==undefined) return datetime.brightBlue;
    else return datetime;
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
app.delete("/logout",Authorized,(req,res)=>{ //Authorized,Admin
    //delete Session
    CookieData=req.cookies;
    console.log(CookieData,CookieData["SessionData"]["SessionID"]);
    res.clearCookie("SessionData");
    expiry.rmKey(key=CookieData["SessionData"]["SessionID"]);
        res.send("Session deleted");
    save();
    res.redirect("/login");
})
//Register
app.post("/register",NotAuthorized,(req,res)=>{ //no Authorized,no Admin
    ShortAxios(req,res,"post","/register",req.body);
})


//1.6) TEMPLATE
//Get all templates (suggestions)
app.get("/template",Authorized,(req,res)=>{
    ShortAxios(req,res,"get","/template");
})

//1.7) Marker
//get all markers
app.get("/marker",(req,res)=>{
    ShortAxios(req,res,"get","/marker");
})
//create one new marker
app.post("/marker",Admin,(req,res)=>{ 
    ShortAxios(req,res,"post","/marker",req.body);
})
//get one marker by id
app.get("/marker/:id",(req,res)=>{  //no restriction
    ShortAxios(req,res,"get","/marker","",req.params.id);
})
//change one marker
app.put("/marker/:id",Admin,(req,res)=>{  
    ShortAxios(req,res,"put","/marker",req.body,req.params.id);
})
//delete one marker by id
app.delete("/marker/:id",Admin,(req,res)=>{ 
    ShortAxios(req,res,"delete","/marker",req.data,req.params.id);
});


//Authentifizierungsrouter und Openrouter
var authRouter = express.Router(); 
var openRouter = express.Router(); 
function Admin(req,res,next){
    clog("Entry isAdmin?")
    if(!checkAuthenticated(req,res)){
        clog("-->No")
        next("route");
    }else{
        clog("rolle",expiry.obj[req.cookies["SessionData"].SessionID].role,"=admin?");
        if(expiry.obj[req.cookies["SessionData"].SessionID].role=="admin"){
            clog("-->Yes")
            next();
        }else{
            clog("-->No")
            next("route");
        }
        
    }
}
function Authorized(req,res,next){
    clog("Entry IsAuthorized?")
    if(!checkAuthenticated(req,res)){
        clog("-->No")
        next("route");
    }else{
        clog("-->Yes")
        next();
    }
}
function NotAuthorized(req,res,next){
    clog("Entry IsNotAuthorized?")
    if(checkAuthenticated(req,res)){
        clog("-->Disagree, cant pass")
        res.redirect("/entwurfsAuswahl");
    }else{
        clog("-->Agree, cant pass... redirect")
        next();
    }
}
app.all("*",Authorized,authRouter);
app.all("*",openRouter);
//Get-Method Entwurfs-Auswahl 
authRouter.get("/entwurfsAuswahl", (req, res, next) => {
    res.sendFile(__dirname+"\\src\\html\\entwurfsAuswahl.html")
});

//Get-Method Entwurfs-Ansicht 
authRouter.get("/entwurfsAnsicht", (req, res, next) => {
    res.sendFile(__dirname+"\\src\\html\\entwurfsAnsicht.html")
});

//Get-Method neuer Entwurf
authRouter.get("/neuerEntwurf", (req, res, next) => {
    res.sendFile(__dirname+"\\src\\html\\neuerEntwurf.html")
});

//Get-Method AR
authRouter.get("/AR", (req, res, next) => {
    res.sendFile(__dirname+"\\src\\html\\AR.html")
});

//Get-Method Entwurfs-Auswahl-Gast
openRouter.get("/entwurfsAuswahl", (req, res, next) => {
    res.sendFile(__dirname+"\\src\\html\\entwurfsAuswahlGast.html")
});

//Get-Method Entwurfs-Ansicht-Gast
openRouter.get("/entwurfsAnsicht", (req, res, next) => {
    res.sendFile(__dirname+"\\src\\html\\entwurfsAnsichtGast.html")
});


//Get-Method Login
openRouter.get("/", (req, res, next) => {
    res.sendFile(__dirname+"\\src\\html\\index.html")
});
openRouter.all("*",Authorized, (req,res,next)=>{
    res.redirect("/entwurfsAuswahl");
})
openRouter.all("*", (req,res,next)=>{
    res.redirect("/");
})