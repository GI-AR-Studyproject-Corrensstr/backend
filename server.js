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
var SessionLength=60000*60 //Stunde in ms
expiry.defaultTimer(SessionLength);
var colors = require('colors');
var cookieParser = require('cookie-parser');
const updateDotenv = require('update-dotenv');
const { env } = require('process');
const { compileFunction } = require('vm');
app.use(cookieParser());

//session store abspeichern https://www.npmjs.com/package/session-file-store
//https://stackoverflow.com/questions/11744975/enabling-https-on-express-js
console.log(PrintDate(),"starting server...")
//port="3040"; //Testumgebung
port="80"; //Masterserver
var logs;

var ssloptions = {key: privateKey, cert: certificate}; 

http.createServer(app).listen(3000,() => console.log(PrintDate(),"listening on port "+ 3000+ " for HTTP! :)"));
https.createServer(ssloptions, app).listen(3001,() => console.log(PrintDate(),"listening on port "+ 3001+ " for HTTPS! :)"));

if (process.env.DB_HOST) {
    dbHost = process.env.DB_HOST;
  } else {
    dbHost = 'localhost';
  }
  process.env.logs=!undefined?logs=process.env.logs:logs=undefined;
  clog("talkative logs activated")
// rasterX ist die Translation von unserer API zur Master-API
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
                "/marker/suggestion":"/api/marker/ID/suggestion",
                "/template":"/api/asset/template",
                "/register":"/api/register",
                "/ff":"/api/suggestion"    
            }
                clog(rasterX);
                
load();
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

//Bereitstellung der Indexdatei der Website
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
  * @param {function} callback muss der letzte Parameter sein (dann kann res weggelassen werden), wird bei success ausgeführt und kann einen Wert returnen. Bei einem Fehler wird false returned. 
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
            .catch((error)=>{clog("Erroraufruf");if(isFunction(callback)){SetOwnership(req,false);return false} err(error,req,res,a,msgpth,d)});
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
            .catch((error)=>{clog("Erroraufruf");if(isFunction(callback)){SetOwnership(req,false);return false}err(error,req,res,a,msgpth,d)});
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
            .catch((error)=>{clog("Erroraufruf");if(isFunction(callback)){SetOwnership(req,false);return false} err(error,req,res,a,msgpth,d)});
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
            .catch((error)=>{clog("Erroraufruf"); if(isFunction(callback)){SetOwnership(req,false);return false}err(error,req,res,a,msgpth,d)});
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

app.put("/db/:id",Authorized,Owner,(req,res)=>{  //change one suggestion, User, wenn du owner bist?
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
app.put("/like:id",Authorized,Owner,(req,res)=>{ //change one like, Authorized
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
app.put("/comment/:id",Authorized,Owner,(req,res)=>{ //change one comment by ID, Authorized, wenn eigener
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
    ShortAxios(req,res,"post","/asset",req.body,req.params.id);
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

app.post("/register", (req, res)=>{ //no restriction
    ShortAxios(req,res,"post","/asset/report",req.body,req.params.id);
})


/**
 * Backupfunktion, die das expiry und SessionStorage Objekt in der lokalen .env Datei abspeichert
 * Diese Funktion wird beim Callback eines expiry Objekts ausgeführt.
 */
function save(){
    storedUserStr= JSON.stringify(sessionStorage.getItem("storedUser"));
    expiryStr=JSON.stringify(expiry);
updateDotenv({
    storedUser: storedUserStr,
    expiry: expiryStr
  }).then(() => {updateDotenv({Last_Backup: PrintDate(true)}); clog("save():errorless backup");})
}
function load(){
    clog("Entry load()");
    try{
        clog("load():env.storedUser!=undefined",env.storedUser != undefined);
        clog("load():env.expiry != undefined",env.expiry != undefined);
    if(env.storedUser!=undefined && env.expiry != undefined){
        clog("load():Into ifclause true")
        TEMPexpiry= JSON.parse(env.expiry).obj;
        TEMPstoredUser= JSON.parse(env.storedUser);
        sessionStorage.setItem("storedUser",TEMPstoredUser);
        clog("load():errorless reading from env")
        for (a in TEMPexpiry) {
            clog("load():TEMPexpiry[a].Logintime+expiry.defaultTimer()",TEMPexpiry[a].Logintime+expiry.defaultTimer());
            currentdate= new Date(TEMPexpiry[a].Logintime+expiry.defaultTimer());
                var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
            clog("load():Läuft aus",datetime.yellow);

            clog("load():TEMPexpiry[a].Logintime+expiry.defaultTimer()>new Date().getTime()",TEMPexpiry[a].Logintime+expiry.defaultTimer()>new Date().getTime());
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
            clog("load():errorless writing to expiry and storedUser")
            save();
            console.log(PrintDate(), "load():Backup restored successfully");
        }else{
            console.log(PrintDate(), "No backup restored");
            clog("Out load()");
        }}catch(e){
            console.log(PrintDate(), "No backup restored");
            clog("Out load()");
        }
}

//Utility
/**
 * 
 * @param {*} functionToCheck Funktion, die überprüft werden soll
 * @returns true oder false
 */
function isFunction(functionToCheck) { //https://stackoverflow.com/questions/5999998/check-if-a-variable-is-of-function-type
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
/**
 * Überprüfunng ob der aufrufende Owner ist, express-syntax mit Weiterleitung
 */
async function Owner(req,res,next){
    clog("Owner():Entry")
    myvar=await isOwner(req);
    if (myvar){
            clog("Owner():isOnwer=true... next")
            next();
        }else{
            clog("Owner():isOnwer=false... abbort route")
            next("route");
        };
}
/**
 * Überprüfunng ob der aufrufende Owner ist, Logik hinter der express-syntax
 */
async function isOwner(req){
        if(CheckOwnership(req)!==undefined){
            return CheckOwnership(req);
        }
    var reqpath=req.path;
    var id=req.params.id;
    if(id!==undefined){
        clog("in ifclause")
        id = "/"+id
        reqpath=reqpath.replace(id,"");
    }

    clog("reqpath",reqpath);
    return ShortAxios(req,"","get",reqpath,"",req.params.id,(req,res,response)=>{
        try{
        return new Promise(resolve=>{
            clog("response.data[user_id]", response.data.data["user_id"]);
            clog("GetUserFromCookies(req).id",GetUserFromCookies(req).id);
        if(response.data.data["user_id"]==GetUserFromCookies(req).id){
            clog("response.data.data[\"user_id\"]",response.data.data["user_id"]);
            clog("GetUserFromCookies(req).id",GetUserFromCookies(req).id);
            console.log("isOwner():",true)
            SetOwnership(req);
            return resolve(true);
        }else{
            console.log("isOwner():",false);
            SetOwnership(req,false);
            return resolve(false);
        }
    }
    )
    }catch{return null;}
    
})
}

/**
 * Überprüft den Loginstatus eines Benutzers, express-syntax
 * @returns true or false
 */
function checkAuthenticated(req,res){
    clog("Entry checkAuthenticated()"+req.path);
    if(Object.getPrototypeOf(req.cookies)!=null){
        //Case cookies are Set
        if(req.cookies["SessionData"]==undefined){
            //andere cookies gesetzt, aber nicht unsere.
            clog("other cookies are set ...redirect...")
            return false;
        }else{
            clog("checkAuthenticated():true");
             return true;
            // kein redirect
        }
    }else{
        clog("no cookies are set ...redirect...");
        return false;
        //no cookies are set aka no login aka guest.
    }
}
/**
 * Setzt ein Attribut ownership im expiry objekt. Dieses Objekt wird abgefragt bevor anfragen an den Server gestellt werden um redundante Aufrufe zu vermeiden.
 * @param {*} bool true oder false
 */
function SetOwnership(req,bool){
    if(bool==undefined) bool=true;
    var pathx=req.path;
    var id=req.params.id;
    if(id!==undefined){
        clog("in ifclause")
        id = "/"+id
        pathx=pathx.replace(id,"");
    }
    id=req.params.id;
    TEMPCookies= req.cookies["SessionData"]
    TEMPobj= expiry.obj[TEMPCookies.SessionID];
    if(Object.keys(TEMPobj).includes("ownership")&&Object.keys(TEMPobj.ownership).includes(pathx)){
        TEMPobj.ownership[pathx][id]=bool;
    }else{
        var ownership={}
        ownership[pathx]={[id]:bool};
        TEMPobj={...TEMPobj,ownership};
    }
    expiry.obj[TEMPCookies.SessionID]=TEMPobj;
    save();
}
/**
 * Hilfsfunktion zum Überprüfen der Besitzerfrage
 * @returns ownership Objekt
 */
function CheckOwnership(req){
    var pathx=req.path;
    var id=req.params.id;
    clog("CheckOwnership(): in")
    if(id!==undefined){
        id = "/"+id
        pathx=pathx.replace(id,"");
    }
    id=req.params.id;
    TEMPobj=expiry.obj[req.cookies["SessionData"].SessionID];
if(Object.keys(TEMPobj).includes("ownership")&&Object.keys(TEMPobj.ownership).includes(pathx)){
    clog("CheckOwnership(): return" +TEMPobj.ownership[pathx].id)
    return TEMPobj.ownership[pathx].id;
}else clog("CheckOwnership(): return undefined"); return undefined;
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
/**
 * Hilfsfunktion 
 */
function GetUserByUID(uid){
    data=expiry.obj[uid];
    return {uid,...data}
}
/**
 * Hilfsfunktion 
 */
function GetUserById(ID){ 
    for(a in expiry.obj){
        if(expiry.obj[a].id==ID) return {a,...expiry.obj[a]}
    }
}
/**
 * Hilfsfunktion 
 */
function GetUserByValue(VAL){
ret={};    
for(a in expiry.obj){
        for(b in expiry.obj[a])
        if(expiry.obj[a].b==VAL){
            ret[a]=expiry.obj[a];
        }
    }
    return ret;
}
/**
 * Funktion, die die Loglevelfunktionalität ermöglicht
 */
function clog(...args){
    if(logs!=undefined) console.log(PrintDate(),...args);
}
/**
 *  Schreibt das aktuelle Datum lesbar und in Farbe
 */
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
/**
 *  Überprüfungspfad für Admins SessionStorage
 */
app.get("/ss",Admin,(req,res)=>{
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
/**
 *  Überprüfungspfad für Admins SessionStorage
 */
app.get("/ss/:id",Admin,(req,res)=>{
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
        //res.send("Session deleted");
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
//get one markers suggestions
app.get("/marker/:id/suggestion",(req,res)=>{  //no restriction
    ShortAxios(req,res,"get","/marker/suggestion","",req.params.id);
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
    clog("Entry IsAuthorized():"+req.path);
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
openRouter.get("/AR", (req, res, next) => {
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
//Standart-Seite
openRouter.all("*", (req,res,next)=>{
    res.redirect("/");
})