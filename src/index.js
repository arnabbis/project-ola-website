const express = require("express")

const bodyparser = require("body-parser")

const mongoose = require("mongoose")

const route = require("./route/route")

const app = express();

app.use(bodyparser.json());

app.use(bodyparser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://arnabbiswas_14:arnabbiswas@cluster0.b95gv.mongodb.net/ola-Database?retryWrites=true&w=majority",{
    useNewUrlParser:true
})
.then(()=>console.log("mongodb is connected")).catch(err=>console.log(err))

app.use("/",route);

app.listen(process.env.PORT||3000,function(){
    console.log("express app running  on " + (process.env.PORT||3000))
})