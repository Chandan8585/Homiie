const express = require('express');
const User = require('../../models/user');
const validateSignup = require('../../utils/validateSignup');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const { userAuth } = require('../../middlewares/userAuth');

authRouter.post('/signup', async(req, res)=>{  
    try { 
        const isUserDataSafe =await validateSignup(req);
        if(isUserDataSafe){
            const {email, password, firstName, lastName} = req.body;
                    // isUserVerified = handleEmailVerification(email);

            const hashedPassword =await bcrypt.hash(password, 10);
             
            const userObject = {
                firstName, 
                lastName,
                email,
                password : hashedPassword
            };
            const newUser = new User(userObject);
          await newUser.save();
          res.send("user Added successfully");
          
        }else{
            res.send("user details invalid");
        }
    }
      catch (error) {
        res.status(401).send(error.message);
      
    }
})

authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userData = await User.findOne({ email: email });
    if (!userData) {
        throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await userData.ValidatePassword(password);
    if (!isPasswordValid) {
        throw new Error("Invalid Credentials");
    } else{
        try {
          
            const token = await userData.getJWT();
            res.cookie('token', token);
            res.send("User Logged In Successfully");
        } catch (error) {
           
            res.status(401).send(error.message);
        }
    }
  
});


authRouter.post('/logout', async(req , res)=>{
    try {
        res.cookie("token", null, {expires: new Date(Date.now())});
        res.send("Logout Successfull!!!");
    } catch (error) {
        res.status(401).send(error.message);
    }
});

authRouter.post('/forgotPassword', async(req , res)=>{
    try {
        res.cookie("token", null, {expires: new Date(Date.now())});
        res.send("Logout Successfull!!!");
    } catch (error) {
        res.status(401).send(error.message);
    }
});

authRouter.get('/verify', userAuth ,async (req, res)=> {
      try {
        req.user.isVerifed = true;
      } catch (error) {
        res.status(500).send("Failed to verify the user.");
      }
}) 



module.exports = authRouter;