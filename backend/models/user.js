const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
require("dotenv").config();
const UserSchema = new mongoose.Schema({
    firstName: { type: String , minlength:3, required:true},
    lastName: { type: String },
    email:{ 
        type: String,
        unique: true,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Enter valid Email ID");
            }
        }
    },
    password:{type: String},
    age:{type: Number,
        min:18
    },
    about:{
        type:String,
        default: "This is default for about area"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    photoUrl:{
        type:String,
        default: "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?t=st=1735743812~exp=1735747412~hmac=6f7e2462ee2538c712035754bbcd0dea9d9bd789db583c78030cf2e0462e3add&w=740",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Enter valid photo Url");
            }
        }
    },
   

} ,{ timestamps: true } );
UserSchema.methods.getJWT = async function() {
    
    const token = await jwt.sign({_id: this._id}, process.env.JWT_KEY, {
        expiresIn:"1d",
    });
    return token;
}
UserSchema.methods.ValidatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password;
    const isPassworValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPassworValid;
}
const User = mongoose.model("user", UserSchema);
module.exports = User;