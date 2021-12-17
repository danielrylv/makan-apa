const express = require('express');
const userRouter = express.Router();
const Controller = require('../controllers/userController.js');
const session = require('express-session');

userRouter.get('/user/registration', Controller.registration);
userRouter.post('/user/registration', Controller.addUser);
userRouter.get('/user/login', Controller.login);
userRouter.post('/user/login', Controller.postLogin);
userRouter.use(function(req, res, next){
    if(!req.session.userId){
        const error = `Login first!`
        res.redirect(`/user/login?error=${error}`);
    }else{
        next()
    }
})
userRouter.get('/user/home', (req, res) => {
    res.render('home');
})
userRouter.get('/user/create/profile', Controller.newProfile);
userRouter.post('/user/create/profile', Controller.addProfile);
userRouter.get('/user/profile', Controller.profile);

module.exports = userRouter;