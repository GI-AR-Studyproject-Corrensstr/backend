const express = require('express')
const app= express()
app.use(express.json());

var server = app.listen(3040, () => console.log("listening on port " + 3040 + "! :)"));
app.get("/" ,(req,res,next)=>{
    console.log("incoming get request")
    res.send("[GET Masterserver:Es klappt!]");
    })
app.post("/" ,(req,res,next)=>{
    console.log("incoming post request");
    res.body=req.body;
    //console.log(req.body);
    res.send(req.body);
    //res.send("[POST Masterserver:Es klappt!]");
    })