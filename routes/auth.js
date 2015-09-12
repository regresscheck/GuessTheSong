var express = require('express');
var router = express.Router();

router.get('/google', function(req, res, next) {
    passport.authenticate('google', { scope: ['profile', 'email'] });
});

router.get('/google/callback', function(req, res, next) {
    passport.authenticate('google', {
        successRedirect: '/profile',
        failureRedirect: '/'});
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}