const express = require('express')
const app= express()
app.use(express.json());

var server = app.listen(3040, () => console.log("listening on port " + 3040 + "! :)"));

//https://www.kevinleary.net/regex-route-express/
app.get("/test/:id",(req,res,next)=>{
res.send(req.params.id)
})
app.get("/api/:rdpath",(req,res)=>{
  res.redirect("/"+req.params.rdpath);
})
app.post("/api/:rdpath",(req,res)=>{
  console.log("redirect auf :"+"/"+req.params.rdpath);
  res.redirect("/"+req.params.rdpath);
})
app.put("/api/:rdpath",(req,res)=>{
  res.redirect("/"+req.params.rdpath);
})
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
app.post("/suggestion",(req,res)=>{
      console.log("/suggestion")
      res.redirect("/project");
    })
app.post("/register", (req,res)=>{
    answereobject={
        "data": {
          "id": 55,
          "first_name": "Max",
          "last_name": "Mustermann",
          "profile_photo": null,
          "role": "citizen"
        }
      }
    res.send(answereobject);
})

app.post("/login", (req,res)=>{
  console.log("login")
    answereobject={
        "data": {
          "id": 55,
          "first_name": "Max",
          "last_name": "Mustermann",
          "profile_photo": null,
          "role": "citizen"
        }
      }
    res.send(answereobject);
})
// localhost/Project/ID/
app.get("/project", (req,res)=>{
    answereobject={
        "data": {
          "id": 1,
          "created_at": "2021-06-11T23:11:55.000000Z",
          "updated_at": "2021-06-11T23:11:55.000000Z",
          "name": "Qui.",
          "description": "Vel minima.",
          "content": "Sed amet cum quo.",
          "visible": 0,
          "is_event": 1,
          "start_time": "2021-07-06 16:55:26",
          "end_time": "2021-09-12 07:40:04"
        }
      }
      res.send(answereobject);
})
app.post("/Project", (req,res)=>{
    answereobject={
        "name": "Neues Projekt",
        "description": "Dies ist ein Projekt, das neu hinzugekommen ist.",
        "start_time": "2016-06-09",
        "end_time": "2016-06-28",
        "visible": "1",
        "is_event": "0",
        "updated_at": "2021-06-16T19:03:01.000000Z",
        "created_at": "2021-06-16T19:03:01.000000Z",
        "id": 7
      }
      res.send(answereobject);
});

app.put("/Project", (req,res)=>{
    answereobject={
    "id": 1,
    "created_at": "2021-06-11T23:11:55.000000Z",
    "updated_at": "2021-06-16T19:06:34.000000Z",
    "name": "Neues verändertes Projekt",
    "description": "Diese Projekt wurde geändert",
    "content": "Sed amet cum quo.",
    "visible": 0,
    "is_event": 0,
    "start_time": "2021-07-06 16:55:26",
    "end_time": "2021-09-12 07:40:04"
  }
  res.send(answereobject);
}
)
app.get("/asset", (req,res)=>{
  answereobject={
      "data": {
        "id": 1,
        "created_at": "2021-06-11T23:11:55.000000Z",
        "updated_at": "2021-06-11T23:11:55.000000Z",
        "name": "Qui.",
        "description": "Vel minima.",
        "content": "Sed amet cum quo.",
        "visible": 0,
        "is_event": 1,
        "start_time": "2021-07-06 16:55:26",
        "end_time": "2021-09-12 07:40:04"
      }
    }
    res.send(answereobject);
})