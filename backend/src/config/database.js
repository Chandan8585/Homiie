const mongoose = require("mongoose");
// const mongoose
MONGODB_URI = process.env.MONGODB_URI;
const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://chandanwingshr:D17n9tegI7xirqb0@cluster0.ppx0l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
}

connectDB().then(()=>{
    console.log("Database connected successfully");

}).catch((err)=>{
      console.log(err);
});
module.exports = connectDB;