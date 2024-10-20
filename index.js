const mongoose =require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/user_management_system");
//connecting to mongodb using ip address and /user_management_system is mongodb database name;
const express =require("express");
const app = express();
const path = require('path')

app.use("/static",express.static(path.join(__dirname,"public")))


const userRoute= require('./routes/userRoute');
app.use('/',userRoute);


const adminRoute= require('./routes/adminRoute');
app.use('/admin',adminRoute);


app.listen(3000,()=>{
    console.log("Server Started http://localhost:3000");
})