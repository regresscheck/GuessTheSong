var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var configAuth = require('./auth');
var passport = require('passport');
var models = require('../models');
var winston = require('winston');

passport.serializeUser(function(user, done) {
    return done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    models.User.findById(id).then(function(user) {
        return done(null, user);
    }).catch(function(err) {
        winston.error('DB problems is deserializeUser of Passport');
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
            models.User.findOne({ where: {social_type: 'google', social_id: profile.id}}).then(function(user) {
                if (user)
                    return done(null, user);
                else {
                    models.User.create({
                        social_type: 'google',
                        social_id: profile.id,
                        token: accessToken,
                        name: profile.displayName
                    }).then(function(newUser) {
                        return done(null, newUser);
                    }).catch(function(err) {
                        return done(err);
                    });
                }
            }).catch(function (err) {
                winston.error('GoogleStrategy problems');
                return done(err);
            });
        });
    }
));
