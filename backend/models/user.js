const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = new mongoose.Schema({
    firstName: { type: String , minlenght:4, required:true},
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
    photoUrl:{
        type:String,
        default: "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?t=st=1735743812~exp=1735747412~hmac=6f7e2462ee2538c712035754bbcd0dea9d9bd789db583c78030cf2e0462e3add&w=740",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Enter valid photo Url");
            }
        }
    }

});

const User = mongoose.model("user", userSchema);
module.exports = User;