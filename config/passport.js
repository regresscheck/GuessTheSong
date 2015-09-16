var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var configAuth = require('./auth');
var passport = require('passport');

var models = require('../models');

passport.serializeUser(function(user, done) {
    return done(null, user.id);
});
passport.deserializeUser(function(obj, done) {
    User.findById(id).then(function(user) {
        return done(null, user);
    }).catch(function(err) {
        return done(err);
    });
});

// Google Auth
passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            models.User.findOne({'profile_id': profile.id}).then(function(user) {
                if (user)
                    return done(null, user);
                else {
                    models.User.create({
                        profile_id: profile.id,
                        token: accessToken,
                        name: profile.displayName,
                        email: profile.emails[0].value
                    }).then(function(newUser) {
                        return done(null, newUser);
                    });
                }
            }).catch(function (err) {
                return done(err);
            });
        });
    }
));
