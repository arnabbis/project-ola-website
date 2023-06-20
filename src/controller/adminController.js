const admin = require("../model/adminModel");
const bycrypt = require("bcrypt");
const {emit}=require("../model/userModel");

// CREATE (POST) :
const isValid = (value) => {
    if (typeof value === "undefined" || value === null)
        return false
    if (typeof value === "string" && value.trim().length === 0)
        return false
    else
        return true
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

module.exports.createAdmin = createAdmin;
