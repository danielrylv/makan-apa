const router = require('express').Router();
const Controller = require('../controllers/controller');
const userRouter = require('./userRoutes');

router.get('/', Controller.showTimeline);

router.use('/', userRouter)


module.exports = router;
