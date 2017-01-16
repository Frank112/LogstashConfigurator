var express = require('express');
var passport = require('passport');
var router = express.Router();

router.post('/login',
    passport.authenticate('local', { successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true })
);

module.exports = router;