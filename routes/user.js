const router = require('express').Router();

router.get('/home', Controller.home);
router.get('/create/profile', Controller.newProfile);
router.post('/create/profile', Controller.addProfile);
router.get('/profile', Controller.profile);
router.get('/edit/profile', Controller.editProfile);
router.post('/edit/profile', Controller.postEdit);

module.exports = router;
