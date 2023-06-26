const jsonwebtoken = require('jsonwebtoken');
const adminModel = require("../model/adminModel");
const ObjectId = require("mongoose").Types.ObjectId;

const authentication = async function(req,res,next){
    try{
    const token = req.headers['x-api-key'];
    if(!token) return res.status(401).send("please provide token ");
    const decodeToken = jsonwebtoken.verify(token,"arnab",{ignoreExpiration:true});
    const exp = decodeToken.exp;
    const iat = Math.floor(Date.now()/1000);
    if(exp<iat) return res.status(401).send({status:false,msg:'Token is expired now'})
    next()
    }catch(err){
        return res.status(500).send("something went wrong");
    }
}

const authorisation = async function(req,res,next){
    try{let adminId = req.params.adminId;
    if(!adminId) return res.status(400).send({status:false,msg:"adminId is not present in the params"})
    if(!ObjectId.isValid(adminId)) return res.status(401).send({status:false,msg:"adminId is not valid"})
    let admin = await adminModel.findById(adminId)
    if(!admin) return res.status(400).send({status:false,msg:"admin with specific adminId is not present"})
    let token = req.headers["x-api-key"]
    let decodedToken = jsonwebtoken.verify(token, "arnab", {ignoreExpiration: true})
    if(admin._id != decodedToken.adminId) return res.status(401).send({status:false, msg:'You are not authorized to make the changes'})
    next()
}catch(error){
    return res.status(500).send({status:false,msg:error.message})
}

}
module.exports.authentication = authentication;
module.exports.authorisation = authorisation;