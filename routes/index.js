const router = require('express').Router();

const commonController = require('../controllers/common');
const userController = require('../controllers/user.js');

router.get('/registration', userController.registration);
router.post('/registration', userController.addUser);
router.get('/login', userController.login);
router.post('/login', userController.postLogin);
router.get('/timeline', commonController.showTimeline);
router.use('/user', require('./userRoutes'));
router.use('/', (req, res) => res.send('home'));

module.exports = router;
