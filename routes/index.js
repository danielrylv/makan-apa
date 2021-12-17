const router = require('express').Router();

const commonController = require('../controllers/common');
const userController = require('../controllers/user.js');

router.get('/registration', userController.registration);
router.post('/registration', userController.addUser);
router.get('/login', userController.login);
router.post('/login', userController.postLogin);
router.get('/timeline', commonController.showTimeline);
router.use('/api', require('./api'));
router.use('/user', require('./user'));
router.post('/post/:postId/delete', commonController.deletePost);
router.use('/', (req, res) => res.render('home'));

module.exports = router;
