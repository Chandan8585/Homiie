// const jwt = require("jsonwebtoken");
const jwt = require('jsonwebtoken');
const User = require("../models/user");
require('dotenv').config();
const userAuth = (async (req, res, next)=>{
    const {token} = req.cookies;
    if(!token){
        throw new Error("token is not found");
    }else{
        console.log(token);
    }
 try {
  
    // console.log("token", Token);
      const {_id}=await jwt.verify(token, process.env.JWT_KEY);
      console.log("userAuth",token, _id);
    const userData = await User.findById(_id);
    // console.log(userData);
    if(!userData){
        throw new Error("User not found");
    }
    req.user = userData;
   next();
 } catch (error) {
    throw new Error("User token is invalid!!!");
 }
});

module.exports = {userAuth};