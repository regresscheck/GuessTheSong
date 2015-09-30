var express = require('express');
var router = express.Router();
var passport = require('passport');


// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', {
        successRedirect: '/lobby',
        failureRedirect: '/'
    }));

module.exports = router;

