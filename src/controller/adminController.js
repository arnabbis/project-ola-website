const admin = require("../model/adminModel");
const bycrypt = require("bcrypt");
const {emit}=require("../model/userModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// CREATE (POST) :
const isValid = (value) => {
    if (typeof value === "undefined" || value === null)
        return false
    if (typeof value === "string" && value.trim().length === 0)
        return false
    else
        return true
}

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
function isValidObjectIdRegex(objectId) {
    return objectIdRegex.test(objectId);
  }
const isValidobjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId)
}
const createAdmin = async function (req, res) {
  try {

    const data = req.body;
    const {
      FirstName,
      LastName,
      PhoneNo,
      Email,
      Password,
      PositionInTheCompany,
      Address,
      Leave,TotalLeave
    } = data;
    console.log("data, ", data)
    if (Object.keys(data).length === 0) {
       return res.status(400).send({ message: "please provide data" });
    }
    if (!isValid(FirstName)) {
     return res.status(400).send({ message: "please provide firstName" });
    }
    if (!isValid(LastName)) {
     return res.status(400).send({ message: "please provide lastName" });
    }
    if (!isValid(PhoneNo)) {
      return  res.status(400).send({ message: "please provide PhoneNo" });
        }
    const findPhone = await admin.findOne({ PhoneNo: PhoneNo });
    if(findPhone){
       return res.status(400).send({ message: "PhoneNo already exist" });
    }
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(PhoneNo)) {
       return res.status(400).send({ message: "please provide valid PhoneNo" });
    }
    if (!isValid(Email)) {
       return res.status(400).send({ message: "please provide Email" });
    }
    const findEmail = await admin.findOne({ Email: Email });
    if(findEmail){
       return res.status(400).send({ message: "Email already exist" });
    }
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(Email)) {
      return  res.status(400).send({ message: "please provide valid Email" });
    }
    if(!isValid(Password)){
       return res.status(400).send({ message: "please provide Password" });
    }
    if(Password.length<5 && Password.length>10){
       return res.status(400).send({ message: "please provide Password between 5 and 10 charrecter" });
    }
    const salt = await bycrypt.genSalt(10);
    data.Password = await bycrypt.hash(data.Password, salt);
    if (!isValid(PositionInTheCompany)) {
       return res.status(400).send({ message: "please provide PositionInTheCompany" });
    }
    if(!isValid(Address)){
       return res.status(400).send({ message: "please provide Address" });
    }
    const leave = ["sickLeave", "earnedLeave", "CompansatoryLeave"];
    if (Leave && !leave.includes(Leave)) {
        return res.status(400).send({ message: "please provide valid Leave" });
      }
     
    let createUser = await admin.create(data)
    return res.status(200).send({ message: "admin created successfully", data: createUser });
  } catch (err) {
    return res.status(500).send({ message: "something went wrong", err: err.message });
  }
};

const applyLeave = async function (req, res) {
    try{
        const data = req.body;
        const {Leave,adminId,TotalLeave} = data;
        const leave = ["sickLeave", "earnedLeave", "CompansatoryLeave"];
        if (Leave && !leave.includes(Leave)) {
            return res.status(400).send({ message: "please provide valid Leave" });
          }
        if(!isValid(adminId)){
            return res.status(400).send({ message: "please provide adminId" });
        }
        const findAdminId = await admin.findById(adminId);
        if(!findAdminId){
            return res.status(400).send({ message: "adminId not found" });
        }
        if(!isValidobjectId(adminId)){
            return res.status(400).send({ message: "please provide valid adminId" });
        }
        if(!isValid(TotalLeave)){
            return res.status(400).send({ message: "please provide TotalLeave" });
        }
        if (TotalLeave && TotalLeave <= 0) {
            return res.status(400).send({ message: "TotalLeave should be a positive number" });
          }
      
          if (TotalLeave && TotalLeave > findAdminId.TotalLeave) {
            return res.status(400).send({ message: "Insufficient TotalLeave" });
          }
      
          findAdminId.TotalLeave -= TotalLeave;
          findAdminId.IsInLeave = true;
          findAdminId.JoiningTime = Date.now()*0;
          findAdminId.LeavingTime = Date.now()*0;
          findAdminId.LeaveDate = Date.now();
          findAdminId.Leave = Leave;
          const leaveDate = new Date(findAdminId.LeaveDate.toISOString().split('T')[0]);
          const leaveDateExists = findAdminId.getleavedate.some(date => {
            return date.getTime() === leaveDate.getTime();
          });
          if (!leaveDateExists) {
            // If the leaveDate is not in the array, add it
            findAdminId.getleavedate.push(leaveDate);
          }

    await findAdminId.save(); // Save the updated admin document

    return res.status(200).send({ message: "Leave applied successfully" });
    }catch(err){
        return res.status(500).send({ message: "something went wrong", err: err.message });
    }
}

const login = async function (req, res) {
    try{
        const data = req.body;
        if(Object.keys(data).length === 0){
            return res.status(400).send({ message: "please provide data" });
        }
        const {Email,Password} = data;
        if(!isValid(Email)){
            return res.status(400).send({ message: "please provide Email" });
        }
        const findEmail = await admin.findOne({Email:Email});
        if(!findEmail){
            return res.status(400).send({ message: "Email not found" });
        }
        if(!isValid(Password)){
           return res.status(400).send({ message: "please provide Password" });
        }
        bycrypt.compare(Password,findEmail.Password,function(err,result){
            if(result){
                let token = jwt.sign({
                    adminId:findEmail._id,
                    iat:Math.floor(Date.now()/1000),
                    exp:Math.floor(Date.now()/1000)+10*60*60
                },"arnab")
                const data = {
                    adminId:findEmail._id,
                    token:token
                }
                return res.status(200).send({ message: "login successfully",token:data });
            }else{
                return res.status(400).send({ message: "Password not match" });
            }
        })
    }catch(err){
        return res.status(500).send({ message: "something went wrong", err: err.message });
    }
}

const getAllAdmin = async function (req, res) {
    try{
        const getData = await admin.find();
        if(!getData){
            return res.status(400).send({ message: "data not found" });
        }else{
            return res.status(200).send({ message: "data found",data:getData });
        }
    }catch(err){
        return res.status(500).send({ message: "something went wrong", err: err.message });
    }
}

const deleteAdmin = async function (req, res) {
    try{
        const adminId = req.params.adminId.trim();
        if(!isValid(adminId)){
            return res.status(400).send({ message: "please provide adminId" });
        }
        const findAdminId = await admin.findOne({_id:adminId,HasLeftCompany:false})
        if(!findAdminId){
            return res.status(400).send({ message: "adminId not found or already deleted" });
        }
        if(!objectIdRegex.test(adminId)){
            return res.status(400).send({ message: "please provide valid adminId" });
        }
        if(findAdminId.HasLeftCompany === true){
            return res.status(400).send({ message: "admin already deleted" });
        }
        const deleteAdmin = await admin.findByIdAndUpdate(adminId,{HasLeftCompany:true},{new:true});      
        return res.status(200).send({ message: "admin deleted successfully", data: deleteAdmin });
    }catch(err){
        return res.status(500).send({ message: "something went wrong", err: err.message });
    }
}

const getLeaveByAdmin = async function (req, res) {
    const Leave = req.query.Leave;
    if(Object.keys(Leave).length === 0){
        return res.status(400).send({ message: "please provide Leave" });
    }
    const leave = ["sickLeave", "earnedLeave", "CompansatoryLeave"];
    if (Leave && !leave.includes(Leave)) {
        return res.status(400).send({ message: "please provide valid Leave" });
      }
    const getLeave = await admin.find({Leave:Leave});
    if(!getLeave){
        return res.status(400).send({ message: "Leave not found" });
    }else{
        return res.status(200).send({ message: "Leave found",data:getLeave });
    }

}
module.exports.createAdmin = createAdmin;
module.exports.applyLeave = applyLeave;
module.exports.login = login;
module.exports.getAllAdmin = getAllAdmin;
module.exports.deleteAdmin = deleteAdmin;
module.exports.getLeaveByAdmin = getLeaveByAdmin;
