const router = require('express').Router();
const Controller = require('../controllers/controller');

router.get('/timeline', Controller.showTimeline);

module.exports = router;
