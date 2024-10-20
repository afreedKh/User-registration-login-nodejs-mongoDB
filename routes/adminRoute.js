const express = require('express');
const admin_route = express();
const config = require('../config/config.js');
const session = require('express-session');
const nocache = require('nocache')
const path = require('path')
const adminAuth = require('../middleware/adminAuth.js')
const adminController = require('../controllers/adminController.js')
admin_route.use(session({
    secret:config.sessionSecret,
    resave:false,
    saveUninitialized:true
}))
admin_route.use(nocache());
admin_route.set('view engine','ejs')
admin_route.set('views', path.join(__dirname, './views/admin'));

admin_route.use(express.json());
admin_route.use(express.urlencoded({extended:true}));

admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin');

admin_route.get('/',adminAuth.isLogout,adminController.loadLogin);
admin_route.post('/',adminController.verifyLogin)

admin_route.get('/home',adminAuth.isLogin,adminController.loadDashboard);

admin_route.get('/logout',adminAuth.isLogin,adminController.logout)

admin_route.get('/dashboard',adminAuth.isLogin,adminController.adminDashboard);

admin_route.get('/new-user',adminAuth.isLogin,adminController.newUserLoad);

admin_route.post('/new-user',adminController.addUser);

admin_route.get('/edit-user',adminAuth.isLogin,adminController.editUserLoad);

admin_route.post('/edit-user',adminController.updateUsers);

admin_route.get('/delete-user',adminController.deleteUser)

admin_route.post('/search',adminController.searchUser)


admin_route.get('*',function(req,res){
    res.redirect('/admin')
})

module.exports=admin_route;