const express = require('express');
const { userAuth } = require('../../middlewares/userAuth');
// const User = require('../../models/user');
const profileRouter = express.Router();

profileRouter.get("/view", userAuth, async (req, res)=>{
        try {
            const {user} =await req.user;
            
            res.send(user);
        } catch (error) {
            throw new Error("Something went wrong");
        }
});

profileRouter.patch("/edit", userAuth, async (req, res) => {
    try {
      const userData = req.user; // Authenticated user
      const editableData = ["firstName", "lastName", "userId", "profileUrl"];
  
      // Validate incoming fields
      const isEditAllowed = Object.keys(req.body).every((field) =>
        editableData.includes(field)
      );
  
      if (!isEditAllowed) {
        return res.status(400).json({ message: "Edit is not possible" });
      }
  
      // Update allowed fields
      Object.keys(req.body).forEach((key) => {
        userData[key] = req.body[key];
      });
  
      // Save the updated user data to the database
      await userData.save();
  
      res.json({
        message: "User edit successful",
        data: userData,
      });
    } catch (error) {
      console.error("Error editing user profile:", error);
      res.status(500).json({ message: "Failed to edit user profile", error: error.message });
    }
  });
  
module.exports = {profileRouter};