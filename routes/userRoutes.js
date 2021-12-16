const router = require('express').Router();

router.get('/user/home', (req, res) => {
    res.send('ini home');
})

module.exports = router;
