    const express = require('express');
    const connectDB = require('./src/config/database');
    const User = require('./models/user');
const validateSignup = require('./utils/validateSignup');
const bcrypt = require('bcrypt');
    const app = express();
    app.use(express.json());
    app.use("/test", (req, res, next)=>{
        // res.send("response 1 !!");
        next();
    }, (req, res, next)=>{
       
        next();
         res.send("response 2 !!");
    },
    (req, res)=>{
        res.send("response 3 !!");
    }
)
app.patch("/user", async (req, res) => {
    const data = req.body;
    const Allowed_Updates = ["skills", "firstName", "lastName", "about", "photoUrl", "password","userId"];

    // Log the incoming data to debug
    console.log("Received data:", data);

    // Check if all keys in the data object are allowed
    const isAllowed_Updates = Object.keys(data).every((ele) => Allowed_Updates.includes(ele));

    console.log("isAllowed_Updates result:", isAllowed_Updates);

    if (!isAllowed_Updates) {
        return res.status(400).send({ message: "Updates not allowed" });
    }

    try {
        const userId = req.body.userId;
        const updatedUser = await User.findByIdAndUpdate(userId, data, { new: true });

        if (!updatedUser) {
            return res.status(404).send({ message: "User not found" });
        }

        res.send({ message: "User data updated successfully", user: updatedUser });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error updating user data" });
    }
});


    app.post("/signup", async (req, res)=>{ 
   
try {
    const {email, password, firstName, lastName} = req.body;
    const hashedPassword  = await bcrypt.hash(password, 10);
    validateSignup(req);
   const userObject = {
    firstName,
    lastName,
    email,
    password: hashedPassword
   }
    const user = new User(userObject);
    await user.save();
    res.send("user Added successfully");
  
} catch (error) {
    console.log(error);
}
});
app.post("/feed", async (req, res) => {
    try {
        const users = await User.find(); // Find all users
        if (users.length > 0) { // Check if any users exist
            res.send(users); // Send the array of users
        } else {
            res.status(404).send({ message: "No users found" }); // Handle case when no users are found
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Server error" }); // Send server error message
    }
});

app.post("/login", async(req, res) => {
    const userEmail = req.body.email; 
    const userPassword = req.body.password;
    try {
        // Update user by ID
        // const updatedUser = await User.findByIdAndUpdate({_id: userId}, firstName, {returnDocument: "after", runValidators: true});
        const isUserPresent  = await User.findOne({email: userEmail});
        console.log("userPresent",isUserPresent);
        if(isUserPresent){
        //  const hashedUserPassword = isUserPresent.password;
         const isUserValid =await bcrypt.compare(userPassword, isUserPresent.password);
         if (isUserValid){
            res.send("User is valid user");
         }else{
            throw new Error("Invalid user");
         }
        }else{
            res.send("User is not present");
        }
        // console.log(updatedUser);
        // if (!updatedUser) {
        //     return res.status(404).send("User not found");
        // }

        // res.send("User data updated successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred");
    }
});

    connectDB().then(()=>app.listen(4000, ()=>{
        console.log("running on port 4000");
    })
    )