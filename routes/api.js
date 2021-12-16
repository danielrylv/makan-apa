const router = require('express').Router();

const apiController = require('../controllers/api');

router.post('/user/:userId/post/:postId/like', apiController.addLike);

module.exports = router;
