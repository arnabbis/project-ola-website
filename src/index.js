const express = require("express")

const bodyparser = require("body-parser")

const mongoose = require("mongoose")

const route = require("./route/route")

const app = express();

app.use(bodyparser.json());

app.use(bodyparser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://amit_singh:kya_hal_hai_tere@cluster0.jpqo2bq.mongodb.net/arnab_ola_data",{
    useNewUrlParser:true
})
.then(()=>console.log("mongodb is connected")).catch(err=>console.log(err))

app.use("/",route);

app.listen(process.env.PORT||3000,function(){
    console.log("express app running  on " + (process.env.PORT||3000))
})