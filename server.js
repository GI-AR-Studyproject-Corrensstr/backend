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



//bibs
app.use('/bootstrap', express.static(__dirname+'/node_modules/bootstrap/dist'));
app.use('/jquery', express.static(__dirname+"/node_modules/jquery/dist/"));

//https://stackoverflow.com/questions/51143730/axios-posting-empty-request/56640357
  axios.defaults.headers.common = {
    "Content-Type": "application/json"
  }

//datenbank enpunkt einbinden ?

//https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded
app.use(express.urlencoded({ extended: true}));
//app.use(express.json());
//https://stackoverflow.com/questions/9177049/express-js-req-body-undefined
//var urlencodedParser = bodyParser.urlencoded({ extended: false })



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

/**
 * Errorhandler, nur interne Funktion für ShortAxios um viel reduntanter Schreibarbeit zu ersparen
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
    res.send({ error })
}



function ShortAxios(req,res,a,msgpth,d){ 
    var msgpth= msgpth;
    // raster={"/asset":"/api/asset","/db":"/api/suggestion","/like":"/api/vote","/comment":"/api/comment","/login":"/api/login","/register":"/api/register"} // Masterserver
    raster={"/asset":"/api/asset","/db":"/api/suggestion","/like":"/api/vote","/comment":"/api/comment","/login":"/api/login","/marker":"/api/marker","template":"api/asset/template"} //Testserver
  
        switch (a) {
        case "get":
            axios.get("http://"+dbHost+":"+port+raster[msgpth])
            .then((response)=>{
                console.log(msgpth+" "+a+" successful");
                res.send(response.data);
            })
            .catch((error)=>{err(error,req,res,a,msgpth,d)});
            break;
        case "post":
            //axios mit options?
            console.log("http://"+dbHost+":"+port+raster[msgpth]+","+JSON.stringify({...d}));
            console.log(raster[msgpth]);
            axios.post("http://"+dbHost+":"+port+raster[msgpth],{...d})
            .then((response)=>{
                console.log(msgpth+" "+a+" successful");
                console.log(response.data);
                res.send(response.data);
                })
            .catch((error)=>{/*console.log(error);*/err(error,req,res,a,msgpth,d)});
            break;
        case "put":
            axios.put("http://"+dbHost+":"+port+raster[msgpth],{...d})
            .then((response)=>{
                console.log(msgpth+" "+a+" successful");
                res.send(response.data);
            })
            .catch((error)=>{err(error,req,res,a,msgpth,d)});
            break;
        case "delete":
            axios.delete("http://"+dbHost+":"+port+raster[msgpth],{...d})
            .then((response)=>{
                console.log(msgpth+" "+a+" successful");

            })
            .catch((error)=>{err(error,req,res,a,msgpth,d)});
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

//1.1) 
app.get("/db",(req,res)=>{  //get all suggestions
    ShortAxios(req,res,"get","/db");
    });
app.post("/db",(req,res,next)=>{ //add new suggestion
    ShortAxios(req,res,"post","/db",req.body);
    });

app.get("/db/:id",(req,res)=>{  //get all suggestions
    ShortAxios(req,res,"get","/db/"+req.params.id);
    });
app.put("/db/:id",(req,res,next)=>{  //change suggestion by ID 
    ShortAxios(req,res,next,"put","/db/"+req.params.id,req.body.data);
});
app.delete("/db/:id",(req,res,next)=>{ //delete a suggestion
    ShortAxios(req,res,next,"delete","/db/"+req.params.id,req.body.data);
});
app.get("/db/:id/vote",(req,res)=>{  //get all suggestions
    ShortAxios(req,res,"get","/db/"+req.params.id+"/vote");
    });
app.get("/db/:id/comment",(req,res)=>{  //get all suggestions
    ShortAxios(req,res,"get","/db/"+req.params.id+"/comment");
    });
app.get("/db/:id/report",(req,res)=>{  //get all suggestions
    ShortAxios(req,res,"get","/db/"+req.params.id+"/report");
    });

    //1.2)
//Like-Dislike Funktion: get; post: dbabfrage mit parametern; update parameter; 
app.get("/like",(req,res)=>{ //get all votes
    ShortAxios(req,res,"get","/like");
})
app.post("/like",(req,res)=>{ //add new vote
    ShortAxios(req,res,"post","/like",req.body);
})
//////////
app.get("/like/:id",(req,res)=>{ //??Testen //get all vote by ID
    ShortAxios(req,res,"get","/like/"+req.params.id);
})
app.put("/like/:id", (req,res)=>{ //??Testen //change vote by ID 
    ShortAxios(req,res,"put","/like"+req.params.id,req.body);
})
app.delete("/like/:id", (req,res)=>{ //??Testen //delete vote by ID 
    ShortAxios(req,res,"delete","/like"+req.params.id,req.body);
})

// 1.3)
//Kommentar, Meldung
app.get("/comment",(req,res,next)=>{ //get all comments
    ShortAxios(req,res,"get","/comment");
})
app.post("/comment",(req,res,next)=>{ //create new comment
    ShortAxios(req,res,next,"post","/comment",req.body);
})
////////
app.get("/comment/:id",(req,res,next)=>{ //??Testen //get comment by ID
    ShortAxios(req,res,"get","/comment/"+req.params.id);
})
app.put("/comment/:id", (req,res,next)=>{ //??Testen //change comment by ID
    ShortAxios(req,res,next,"put","/comment/"+req.params.id,req.body);
})
app.delete("/comment/:id", (req,res,next)=>{ //??Testen //delete comment by ID
    ShortAxios(req,res,next,"delete","/comment/"+req.params.id,req.body);
})
app.get("/comment/:id/vote",(req,res)=>{  //get all votes by ID
    ShortAxios(req,res,"get","/comment/"+req.params.id+"/vote");
    });
app.get("/comment/:id/report",(req,res)=>{  //get all reports by ID
    ShortAxios(req,res,"get","/comment/"+req.params.id+"/report");
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
//Get asset by ID
app.get("/asset/:id",(req,res)=>{ //??Testen
    ShortAxios(req,res,"get","/asset/"+req.params.id);
})
//Update Asset
app.put("/asset/:id", (req,res)=>{ //??Testen
    ShortAxios(req,res,"delete","/asset/"+req.params.id,req.data); 
})
//Delete Asset
app.delete("/asset/:id",(req,res,next)=>{ 
    ShortAxios(req,res,next,"delete","/asset",req.data);
});
//Report Asset
app.post("/asset/report", (req, res)=>{
    ShortAxios(req,res,"post","/asset",req.body);
})

//1.5) Login & Register
//Login: get; post: dbabfrage mit login informationen; update: login, param change;
//Post Login
app.post("/login",(req,res)=>{
    //axios.post("http://"+dbHost+":"+port+raster[msgpth],{...d})
    d=req.body;
    console.log("http://"+dbHost+":"+port+"/login");
    axios.post("http://"+dbHost+":"+port+"/login/",{...d}) //name:MaxMustermann, passwort:Passwort123 HASHED!
            .then((response)=>{
                data=response.data.data;
                keys=Object.keys(data);
                for(a of keys){
                    sessionStorage.setItem(a,data[a])
                }
                console.log("cookies from answere successfully loaded");
                res.send(response.data);
            })
            .catch((error) => { 
                console.log("Error loading cookies"); 
                err(error,req,res,a,msgpth,d);
            }); 
}); 
app.get("/ss",(req,res)=>{
    temp= sessionStorage.getItem("first_name")
    console.log(temp);
    res.send(temp);
})
//Logout
app.delete("/logout",(req,res,next)=>{
    //delete Session
    req.logOut()
    res.redirect("/login")
})
//Register
app.post("/register",(req,res,next)=>{
    ShortAxios(req,res,"post","/register",req.body);
})




//1.6) TEMPLATE (Noch nicht in der API Dokumentation der Master vorhanden!)
//Get all templates
app.get("/template",(req,res)=>{
    ShortAxios(req,res,next,"get","/template");
})/* //TODO GetTemplateById, add template, update template & delete template könnt ihr über die Assets Routen machen und dann einfach 'is_template' auf true setzen
//Create new template
app.post("/template",(req,res)=>{
    ShortAxios(req,res,next,"post","/template",req.data);
})
//Get template by ID
app.get("/template/:id",(req,res)=>{
    ShortAxios(req,res,"get","/template/"+req.params.id);
})
//Change template by ID
app.put("/template", (req,res)=>{
    ShortAxios(req,res,next,"put","/template",req.data);
})
//Delte template by id
app.delete("/template",(req,res,next)=>{ 
    ShortAxios(req,res,next,"delete","/template",req.data);
});*/



//1.7) Marker
//get all markers
app.get("/marker",(req,res)=>{
    ShortAxios(req,res,"get","/marker");
})
//create new marker
app.post("/marker",(req,res)=>{
    ShortAxios(req,res,"post","/marker",req.body);
})
//get marker by id
app.get("/marker/:id",(req,res)=>{  //Testen
    ShortAxios(req,res,"get","/marker/"+req.params.id);
})
//change marker by id
app.put("/marker/:id", (req,res)=>{ 
    ShortAxios(req,res,"put","/marker/"+req.params.id,req.body);
})
//delete marker by id
app.delete("/marker",(req,res,next)=>{ 
    ShortAxios(req,res,next,"delete","/marker",req.data);
});
