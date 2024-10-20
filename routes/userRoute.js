const express = require('express');
const user_route = express();
const path=require('path');
const nocache=require('nocache');
const session = require('express-session');
const config=require('../config/config')
const auth = require('../middleware/auth')

user_route.use(session({
    secret:config.sessionSecret,
    saveUninitialized:true,
    resave:false
}))
user_route.use(nocache());
user_route.set('view engine','ejs')
user_route.set('views','./views/users')
user_route.use(express.urlencoded({extended:true}));
user_route.use(express.json());


const userController= require('../controllers/userController');



user_route.get('/register',auth.isLogout,userController.loadRegister);
user_route.get('/',auth.isLogout,userController.loadLogin);
user_route.get('/login',auth.isLogout,userController.loadLogin);
user_route.post('/login',userController.verifyLogin);
user_route.post('/register',userController.insertUser);
user_route.get('/home',auth.isLogin,userController.loadHome);
user_route.get('/logout',auth.isLogin,userController.userLogout)
module.exports = user_route;