const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId
const UserOlaSchema = new mongoose.Schema({
    FirstName:{
        type:String,
        required:true,
        unique:true
    },
    LastName:{
        type:String,
        required:true
    },
    AdminRef:{
        type:ObjectId,
        required:true
    },
    Address:{
        type:String,
        required:true,
    },
    PhoneNo:{
        type:Number,
        required:true,
        unioque:true
    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
    Password:{
        type:String,
        required:true,
        unique:true,
        max:10,
        min:5
    },
    RideFrom:{
        type:String,
        required:true,
    },
    RideUpTO:{
        type:String,
        required:true,
    },
    complain:{
        type:[String]
    }
},{timestamps:true})

module.exports = mongoose.model("UserOla",UserOlaSchema)