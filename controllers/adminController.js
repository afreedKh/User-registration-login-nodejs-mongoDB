const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const randomString = require('randomstring')

const securePassword = async(password)=>{
    try{
        const passwordHash =await bcrypt.hash(password,10);
        return passwordHash;
    }catch(error){
        console.log(error.message);
    }
}

const loadLogin= async(req,res)=>{
    try {
        res.render('login');
       
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin= async(req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;

        // Validate email format
        const validateEmail = (email) => {
            return String(email)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                );
        };

        const validationErrors = {};

        if (!validateEmail(email)) {
            validationErrors.invalidEmail = "Invalid email ";
        }

        if (Object.keys(validationErrors).length > 0) {
            return res.render('login', { validationErrors });
        }


       const userData =await User.findOne({email:email});
        if(userData){
           
           const passwordMatch=await bcrypt.compare(password,userData.password);
           if(passwordMatch){
            if(userData.is_admin===0){
               
                res.render('login',{message:"Email and password is incorrect"});
            }else{

                req.session.user=userData;
                
                res.redirect('/admin/home')
            }
           }else{
            
            res.render('login',{message:"Email and password is incorrect"});
           }
        }else{
           
            res.render('login',{message:"Email and password is incorrect"});
        }
    } catch (error) {
        console.log(error.message);
    }
}

const loadDashboard= async(req,res)=>{
    try {
        const  {name, age, place, email, mobile}  = req.session.user;
        res.render("home",{name, age, place, email, mobile});
    } catch (error) {
        console.log(error.message);
    }
}



const logout = async(req,res)=>{
    try {
        req.session.destroy();
        res.render('login',{message:"Logout Successfully"})
    } catch (error) {
        console.log(error.message);
    }
}

const adminDashboard = async(req,res)=>{
    try {
       const usersData= await User.find({is_admin:0});
        res.render('dashboard',{users:usersData});
    } catch (error) {
        console.log(error.message);
    }
}

const newUserLoad = async(req,res)=>{
    try {

        res.render("new-user")
        
    } catch (error) {
        console.log(error.message);
    }
}

const addUser = async(req,res)=>{
    try {
        
        const name = req.body.name;
        const email = req.body.email;
        const mobile = req.body.mno;
        const age = req.body.age;
        const place = req.body.place;
        const password = randomString.generate(8);

        const spassword = await securePassword(password);

        const user = new User({
            name:name,
            email:email,
            mobile:mobile,
            age:age,
            place:place,
            password:spassword,
            is_admin:0
        })

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

        if (!validateEmail(req.body.email)) {
            validationErrors.invalidEmail = "Invalid email";
        }

        if (!validateName(req.body.name)) {
            validationErrors.invalidName = "Invalid name";
        }

        if (!validatePhone(req.body.mno)) {
            validationErrors.invalidMobile = "Invalid mobile";
        }

        if (Object.keys(validationErrors).length > 0) {
            res.render("new-user", validationErrors);

        }else{
        const userData = await user.save();

        if(userData){
            res.redirect('/admin/dashboard');
        }else{
            res.render('new-user',{message:"Something wrong"})
        }

    }
    } catch (error) {
        console.log(error.message);
    }
}


const editUserLoad = async(req,res)=>{
    try {
        const id= req.query.id;
        const userData=await User.findById({_id:id})
        if(userData){
            res.render('edit-user',{userData})
        }else{
            res.redirect('/admin/dashboard');
        }
    } catch (error) {
        console.log(error.message);
    }
}

const updateUsers = async(req,res)=>{
    try {
        
        
       const userData= await User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mno,age:req.body.age,place:req.body.place}})

       res.redirect("/admin/dashboard");

    } catch (error) {
        console.log(error.message);
    }
}



const deleteUser = async(req,res)=>{
    try {
        
        const id = req.query.id;
        await User.deleteOne({_id:id}); 
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error.message);
    }
}

const searchUser = async (req,res)=>{
    try {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g,"")

        const users=await User.find({
          is_admin:0,  $or:[{name:{$regex:new RegExp(searchNoSpecialChar,"i")}}]
        });
        
        res.render("search",{users})
        
    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    adminDashboard,
    newUserLoad,
    addUser,
    editUserLoad,
    updateUsers,
    deleteUser,
    searchUser
}