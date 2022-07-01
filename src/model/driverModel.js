const mongoose = require("mongoose")
const DriverOlaSchema = new mongoose.Schema({

    FirstName:{
        type:String,
        required:true,
    },
    LastName:{
        type:String,
        required:true
    },
    Adress:{
        type:String,
        required:true
    },
    PhoneNo:{
        type:String,
        required:true,
        unique:true
    },
    ComplainAboutCustomer:{
        type:[String]
    },
    TotalRides:{
        type:Number,
        default:0
    }
},{timestamps:true})

module.exports = mongoose.model("DriverOla",DriverOlaSchema)