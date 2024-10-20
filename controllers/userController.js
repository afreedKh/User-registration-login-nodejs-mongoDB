const User =require('../models/userModel');
const bcrypt = require('bcrypt');


const securePassword = async(password)=>{
    try{
        const passwordHash =await bcrypt.hash(password,10);
        return passwordHash;
    }catch(error){
        console.log(error.message);
    }
}


const loadRegister = async(req,res)=>{
    try{
       res.render('registration');
    }catch(error){
        console.log(error.message);
    }
}

const loadLogin = async(req,res)=>{
    try{
       res.render('login');
    }catch(error){
        console.log(error.message);
    }
}

const loadHome = async(req,res)=>{
    try{
        const  {name, age, place, email, mobile}  = req.session.user;
       res.render('home', {name, age, place, email, mobile});
    }catch(error){
        console.log(error.message);
    }
}

const verifyLogin = async(req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        

        const validateEmail = (email) => {
            return String(email)
              .toLowerCase()
              .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              );
          };

          const validationErrors = {};

        if (!validateEmail(email)||email==="") {
            validationErrors.invalidEmail = "Invalid email";
        }

        if (Object.keys(validationErrors).length > 0) {
            return res.render('login', { validationErrors });
        }

        const userData= await User.findOne({email});

        if(userData){
          const passwordMatch= await bcrypt.compare(password,userData.password);
          if(passwordMatch&&userData.is_admin===0){
            
            req.session.user = userData;
            res.redirect('/home')
          }else{
            res.render('login',{message:"Email and password is incorrect"})
          }
        }else{
            res.render('login',{message:"Email and password is incorrect"});
        }
    } catch (error) {
        console.log(error.message);
    }
}




const userLogout = async(req,res)=>{
    try {
        req.session.destroy();
        // res.redirect('/');
        res.render('login',{message:"Logout Successfully"})
    } catch (error) {
        console.log(error.message);
    }
}

const insertUser = async(req, res) => {
    try {
        const spassword = await securePassword(req.body.password);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mno,
            age: req.body.age,
            place: req.body.place,
            password: spassword,
            is_admin: 0,
        });

        const validateEmail = (email) => {
            return String(email)
              .toLowerCase()
              .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              );
          };

          const validateName = (name) => {
            return String(name)
              .toLowerCase()
              .match(
                /^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/
              );
          };
         
          const validatePhone = (mobile) => {
            return /^[0-9]{10}$/.test(mobile);
        };
        

        const validationErrors = {};

        if (!validateEmail(req.body.email)||req.body.email==="") {
            validationErrors.invalidEmail = "Invalid email";
        }

        if (!validateName(req.body.name)||req.body.name==="") {
            validationErrors.invalidName = "Invalid name";
        }

        if (!validatePhone(req.body.mno)||req.body.mno==="") {
            validationErrors.invalidMobile = "Invalid mobile";
        }

        if (Object.keys(validationErrors).length > 0) {
            res.render("registration", validationErrors);
        } else {
            
            const userData = await user.save();
            if (userData) {
                
                res.render('login', { message: "Your registration has been successfully completed." });
            } else {
               
                console.log("User could not be saved.");
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}




module.exports = {
    loadRegister,
    insertUser,
    loadLogin,
    verifyLogin,
    loadHome,
    userLogout
}