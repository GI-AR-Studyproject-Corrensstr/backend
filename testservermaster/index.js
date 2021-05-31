const express = require('express')
const app= express()
app.use(express.json());

var server = app.listen(3040, () => console.log("listening on port " + 3040 + "! :)"));
app.get("/" ,(req,res,next)=>{
    console.log("incoming getrequest")
    res.send("[Masterserver:Es klappt!]");
    })