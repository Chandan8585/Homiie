const express = require('express');
const { userAuth } = require('../../middlewares/userAuth');
const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, (req, res)=>{
      const user = req.user;
      console.log(user);

      res.send(user.firstName+ "sent the connection request");
})

module.exports= {requestRouter};