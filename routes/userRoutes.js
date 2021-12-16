const express = require('express');
const userRouter = express.Router();
const Controller = require('../controllers/userController.js');
const user = require('../models/user.js');

userRouter.get('/user/registration', Controller.registration);
userRouter.post('/user/registration', Controller.addUser);
userRouter.get('/user/login', Controller.login);
userRouter.post('/user/login', Controller.postLogin);
userRouter.get('/user/home', (req, res) => {
    res.send('ini home');
})

module.exports = userRouter;