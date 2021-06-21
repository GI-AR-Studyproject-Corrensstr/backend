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
  port="3040";


//https://stackoverflow.com/questions/51143730/axios-posting-empty-request/56640357
  axios.defaults.headers.common = {
    "Content-Type": "application/json"
  }

//datenbank enpunkt einbinden ?

//https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded
app.use(express.urlencoded());


app.use("/html",express.static(__dirname+"/src/html/"));

//Website
app.get("/" ,(req,res,next)=>{
    res.sendFile(__dirname+"/src/html/index.html")
    })

// abc(type,data,then,catch)=axios.$type('https://'+process.env.MASTER_HOST+'?api_key='+process.env.MASTER_KEY+'&date=2017-08-03')
/**
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @param {String} a "get","post", "put", "delete"
 * @param {String} msgpth msgpth = Pfad bezeichner zu API Endpoint zB "/DB"
 * @param {String} d data bei post delete put, in JSON
 */

// servername/api/API ENDPOINTS base64 codierung für Bilder

//https://brandoncc.medium.com/how-to-handle-unhandledrejection-errors-using-axios-da82b54c6356
/*axios.interceptors.response.use(
    response => response,
    error => {
      throw error
    }
  )*/

  /*axios.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
  }, function (error) {
    // Do something with response error
    return Promise.reject(error);
  });*/
/**
 * Errorhandler, nur interne Funktion für ShortAxios um viel reduntanter Schreibarbeit zu ersparen
 * @param {*} error 
 */
function err(error) {
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
    res.send({ error })
}


function ShortAxios(req,res,a,msgpth,d){ 
    // raster={"/asset":"/api/asset","/db":"/api/suggestion","/like":"/","/comment":"/","/login":"/api/login","/dislike":"/","/register":"/api/register"} // Masterserver
    raster={"/db":"/","/like":"/api/vote","/comment":"/api/comment","/login":"/"} //Testserver
    
        switch (a) {
        case "get":
            axios.get("http://"+dbHost+":"+port+raster[msgpth])
            .then((response)=>{
                console.log(msgpth+" "+a+" successful");
                try{
                res.send(response.data);
                }catch(error){console.error("HollaDieWaldfee");}
            })
            .catch((error)=>{err(error)});
            break;
        case "post":
            //axios mit options?
            axios.post("http://"+dbHost+":"+port+raster[msgpth],{...d})
            .then((response)=>{
                console.log(msgpth+" "+a+" successful");
                console.log(response.data);
                res.send(response.data);
                })
            .catch((error)=>{err(error)});
            break;
        case "put":
            axios.put("http://"+dbHost+":"+port+raster[msgpth],{...d})
            .then((response)=>{
                console.log(msgpth+" "+a+" successful");
                res.send(response.data);
            })
            .catch((error)=>{err(error)});
            break;
        case "delete":
            axios.delete("http://"+dbHost+":"+port+raster[msgpth],{...d})
            .then((response)=>{
                console.log(msgpth+" "+a+" successful");

            })
            .catch((error)=>{err(error)});
            break;
        default:
            break;
    }
}
function OLD_SendHelp(req,res,next,h,msgpth,d){ //h[ttp method], d[ata], msgpath

eval(
  //  `axios.${h}("http://localhost:3040");`
    `
    axios.${h}("http://${dbHost}:${port}/${d}")
    .then((response)=>{
        console.log("${msgpth} ${h} successful");
        res.send(response.data);
    })
    .catch((error) => { 
        console.log("${msgpth} ${h} error"); 
        res.send(error.data);
    });;    
`
);

/*return Function(`axios.${h}("http://localhost:3040")
.then(function (response) {
    console.log("/db.get successful");
    res.send(response.data);
  })
;`)*/
 //axios.eval(h)("http://localhost:3040");
//        axios.`+h+`('https://'+dbHost+'?api_key='+process.env.MASTER_KEY"+d+")
    // return Function(`
    //     axios.`+h+`(\'http://`+dbHost+`:3040/`+d+`\')"
    //     .then(`+t+`)
    //     .catch(`+c+`)    
    // `)();
}

app.get("/db",(req,res)=>{ 
    ShortAxios(req,res,"get","/db");
    });
app.post("/db",(req,res,next)=>{
    ShortAxios(req,res,"post","/db",req.body);
    });
    app.post("/dbByID",(req,res,next)=>{ //?? Params
        ShortAxios(req,res,"post","/db",req.body);
    });
app.put("/db",(req,res,next)=>{ 
    ShortAxios(req,res,next,"put","/db",req.body.data);
});
app.delete("/db",(req,res,next)=>{ 
    ShortAxios(req,res,next,"delete","/db",req.data);
});

//Login: get; post: dbabfrage mit login informationen; update: login, param change; 
app.post("/login",(req,res,next)=>{
    axios.post("http://"+dbHost+":"+port+"{"+d+"}") //name:MaxMustermann, passwort:Passwort123 HASHED!
            .then((response)=>{
                data=JSON.parse(res.data) //data.name 
                keys=Object.keys(data);
                for(a in keys){
                    sessionStorage.setItem(a,data[""+a])
                }
                console.log("cookies from answere successfully loaded");
                res.send(response.data);
            })
            .catch((error) => { 
                console.log("Error loading cookies"); 
                res.send(error.data);
            }); 
}); 
app.post("/register",(req,res,next)=>{
    ShortAxios(req,res,"post","/register",req.body);
})

app.delete("/logout",(req,res,next)=>{
    //delete Session
    req.logOut()
    res.redirect("/login")
})

//Kommentar, Meldung
app.get("/comment",(req,res,next)=>{
    ShortAxios(req,res,"get","/comment");
})
app.get("/commentByID",(req,res,next)=>{ //??Params
    ShortAxios(req,res,"get","/comment");
})
app.post("/comment",(req,res,next)=>{
    ShortAxios(req,res,next,"post","/comment",req.body);
})
app.put("/comment", (req,res,next)=>{ //??Params
    ShortAxios(req,res,next,"put","/comment",req.body);
})

//Like-Dislike Funktion: get; post: dbabfrage mit parametern; update parameter; 
app.get("/like",(req,res)=>{
    ShortAxios(req,res,"get","/like");
})
app.get("/likeByID",(req,res)=>{ //?? Params
    ShortAxios(req,res,"get","/like");
})
app.post("/like",(req,res)=>{
    ShortAxios(req,res,"post","/like",req.body);
})
app.put("/like", (req,res)=>{ //??Params
    ShortAxios(req,res,"put","/like",req.body);
})
//TEMPLATE
app.get("/template",(req,res)=>{
    ShortAxios(req,res,next,"get","/template");
})
app.post("/template",(req,res)=>{
    ShortAxios(req,res,next,"post","/template",req.data);
})
app.put("/template", (req,res)=>{
    ShortAxios(req,res,next,"put","/template",req.data);
})

// ASSET
app.get("/asset",(req,res,next)=>{
    ShortAxios(req,res,"get","/asset");
})
app.get("/assetByID",(req,res,next)=>{ //??==> Parameter übergeben
    ShortAxios(req,res,"get","/asset");
})
app.put("/template", (req,res,next)=>{ //??==> Parameter übergeben
    ShortAxios(req,res,next,"delete","/template",req.data);
    next(); 
})
app.post("/asset",(req,res,next)=>{
    ShortAxios(req,res,"post","/asset",req.body);
})
