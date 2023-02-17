const adminModel = require("../model/adminModel")
const bycrypt = require("bcrypt")
const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId;
const jwt = require('jsonwebtoken')


//===========================VALIDATION===============================//


const isValid = function(value) {
    if (typeof value === "undefined" || value === "null") return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true;
}

const isValidObjectId = function(ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}


// CREATE (POST) :

const createAdmin = async function(req,res){
    try{
        let data = req.body;
        if(Object.keys(data).length==0){
            return res.status(400).send("Bad Request")
        }
        const {FirstName,LastName,Address,Email,PhoneNo,Password,PositionInTheCompany}=data
        if(!isValid(FirstName)){
          return res.status(400).send({status:false,msg:"FirstName must be present"})
        }
        if(!isValid(LastName)){
            return res.status(400).send({status:false,msg:"LastName must be present"})
          }
          if(!isValid(Address)){
            return res.status(400).send({status:false,msg:"Address must be present"})
          }
          if(!isValid(PhoneNo)){
            return res.status(400).send({status:false,msg:"PhoneNo must be present"})
          }
          const findPhoneNo = await adminModel.findOne({PhoneNo:PhoneNo})
          if(findPhoneNo){
            return res.status(400).send({status:false,msg:"PhoneNo must be different"})
          }
          if(!isValid(Email)){
            return res.status(400).send({status:false,msg:"PhoneNo must be present"})
          }
          const findEmail = await adminModel.findOne({Email:Email})
          if(findEmail){
            return res.status(400).send({status:false,msg:"Email must be different"})
          }
          if(!isValid(Password)){
            return res.status(400).send({status:false,msg:"PhoneNo must be present"})
          }
          const findPassword = await adminModel.findOne({Password:Password})
          if(findPassword){
            return res.status(400).send({status:false,msg:"Password must be different"})
          }
          if (data.Password.length < 5 || data.Password.length > 10) {
            return res.status(400).send({
                status: false,
                msg: "passowrd min length is 5 and max length is 15"
            })
        }
        const salt = await bycrypt.genSalt(10);
        data.Password = await bycrypt.hash(data.Password, salt);
        if(!isValid(PositionInTheCompany)){
            return res.status(400).send({status:false,msg:"PositionInTheCompany must be present"})
          }
            let addData = await adminModel.create(data)
            return res.status(201).send({msg:"data added",data:addData})   
        }catch(err){
          return  res.status(500).send({status:false ,Error:err});
    }
}

// const login = async function(req,res){
// try {
        
//     let user = req.body

//     if (Object.keys(user) == 0) {
//         return res.status(400).send({
//             status: false,
//             msg: "please provide data"
//         })
//     }

//     let userName = req.body.email
//     let password = req.body.password

//     if (!userName) {
//         return res.status(400).send({
//             status: false,
//             msg: "userName is required"
//         })
//     }

//     if (!password) {
//         return res.status(400).send({
//             status: false,
//             msg: "password is required"
//         })
//     }

//     let userEmailFind = await adminModel.findOne({ email: userName })
//     if (!userEmailFind) {
//         return res.status(400).send({
//             status: false,
//             msg: "userName is not correct"
//         })
//     };

//     bycrypt.compare(password, userEmailFind.Password, function(err, result) {

//         if (userEmailFind) {
//             let token = jwt.sign({
//                 userId: userEmailFind._id,
//                 iat: Math.floor(Date.now() / 1000),
//                 exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60
//             }, "rushi-159");

//             const userData = {
//                 userId: userEmailFind._id,
//                 token: token
//             }
//             res.status(200).send({
//                 status: true,
//                 message: "user login successfully",
//                 data: userData
//             });
//         } else {
//             return res.status(401).send({
//                 status: true,
//                 message: "plz provide correct password"
//             })
//         }
//     })
// } catch (error) {
//     return res.status(500).send({
//         status: false,
//         msg: error.message
//     })
// }
// }

const getData = async function(req,res){
    try{
        let adminId = req.params.adminId.trim()
        console.log(adminId)
        if (!isValidObjectId(adminId)) {
            return res.status(400).send({
                status: false,
                msg: "path param is invalid"
            })
        }
        let findAdminId = await adminModel.findById({_id:adminId})
        if(!findAdminId){
            return res.status(404).send({status:false,msg:"This adminId is not Present"})
        }
            return res.status(200).send({status:true,msg:"Admin Found",data:findAdminId})
    }catch(err){
        return res.status(500).send({status:false,Error:err})
    }
}


module.exports.createAdmin = createAdmin;
module.exports.getData = getData;
// module.exports.login = login;