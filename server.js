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

function ShortAxios(req,res,next,a,msgpth,d){ 
    raster={"/db":"/","/like":"/","/comment":"/","/login":"/","/dislike":"/"}
    
        switch (a) {
        case "get":
            axios.get("http://"+dbHost+":"+port+raster[msgpth])
            .then((response)=>{
                console.log(msgpth+" "+a+" successful");
                res.send(response.data);
            })
            .catch((error) => { 
                console.log(msgpth+" "+a+" error"); 
                res.send(error.data);
            });
            break;
        case "post":
            console.log(d);
            console.log(d.data);
            console.log("http://"+dbHost+":"+port+raster[msgpth],"{"+Object.keys(d)[0]+":\""+d[""+Object.keys(d)[0]]+"\"}"); 

            //axios.post("http://"+dbHost+":"+port+raster[msgpth],"{"+Object.keys(d)[0]+":\""+d[""+Object.keys(d)[0]]+"\"}")
            axios.post("http://"+dbHost+":"+port+raster[msgpth],d)
            .then((response)=>{
                console.log(msgpth+" "+a+" successful");
               //console.log(response);
                //res.body=response.body;
                res.send(response.data);
            })
            .catch((error) => { 
                console.log(msgpth+" "+a+" error"); 
                console.log(error);
               // res.send(error.data);
            });
            break;
        case "put":
            axios.put("http://"+dbHost+":"+port+raster[msgpth]+",{"+d+"}")
            .then((response)=>{
                console.log(msgpth+" "+a+" successful");
                res.send(response.data);
            })
            .catch((error) => { 
                console.log(msgpth+" "+a+" error"); 
                res.send(error.data);
            });
            break;
        case "delete":
            axios.delete("http://"+dbHost+":"+port+raster[msgpth]+",{"+d+"}")
            .then((response)=>{
                console.log(msgpth+" "+a+" successful");

            })
            .catch((error) => { 
                console.log(msgpth+" "+a+" error"); 
                res.send(error.data);
            });
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

app.get("/db",(req,res,next)=>{ 
    ShortAxios(req,res,next,"get","/db");
    });
app.post("/db",(req,res,next)=>{
    ShortAxios(req,res,next,"post","/db",req.body);
    next();});
app.put("/db",(req,res,next)=>{ 
    ShortAxios(req,res,next,"put","/db",req.body.data);
    next();
});
app.delete("/db",(req,res,next)=>{ 
    ShortAxios(req,res,next,"delete","/db",req.data);
    next();
});


//Like-Dislike Funktion: get; post: dbabfrage mit parametern; update parameter; 
app.get("/like",(req,res,next)=>{
    ShortAxios(req,res,next,"get","/like");
    next(); 
})
app.post("/like",(req,res,next)=>{
    ShortAxios(req,res,next,"post","/like",req.data);
    next(); 
})
app.put("/like", (req,res,next)=>{
    ShortAxios(req,res,next,"put","/like",req.data);
    next(); 
})



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
    next(); 
}); 
app.delete("/logout",(req,res,next)=>{
    //delete Session
    req.logOut()
    res.redirect("/login")
})

//Kommentar, Meldung
app.get("/comment",(req,res,next)=>{
    ShortAxios(req,res,next,"get","/comment");
    next(); 
})
app.post("/comment",(req,res,next)=>{
    ShortAxios(req,res,next,"post","/comment",req.data);
    next(); 
})
app.put("/comment", (req,res,next)=>{
    ShortAxios(req,res,next,"put","/comment",req.data);
    next(); 
})

app.get("/dislike",(req,res,next)=>{
    ShortAxios(req,res,next,"get","/dislike");
    next(); 
})
app.post("/dislike",(req,res,next)=>{
    ShortAxios(req,res,next,"post","/dislike",req.data);
    next(); 
})
app.put("/dislike", (req,res,next)=>{
    ShortAxios(req,res,next,"put","/dislike",req.data);
    next(); 
})
app.get("/template",(req,res,next)=>{
    ShortAxios(req,res,next,"get","/template");
    next(); 
})
app.post("/template",(req,res,next)=>{
    ShortAxios(req,res,next,"post","/template",req.data);
    next(); 
})
app.put("/template", (req,res,next)=>{
    ShortAxios(req,res,next,"put","/template",req.data);
    next(); 
})
app.put("/template", (req,res,next)=>{
    ShortAxios(req,res,next,"delete","/template",req.data);
    next(); 
})
