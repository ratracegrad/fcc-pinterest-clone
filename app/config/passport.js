'use strict';

// load all the things we need
var TwitterStrategy  = require('passport-twitter').Strategy;

// load up the user model
var User            = require('../models/User');
var configAuth      = require('./auth');

// expose this function to our app using module.exports
module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // TWITTER SIGNUP ==========================================================
    // =========================================================================
    passport.use(new TwitterStrategy({

                consumerKey :       configAuth.consumerKey,
                consumerSecret :    configAuth.consumerSecret,
                callbackURL :       configAuth.callbackURL
            },
            function(token, tokenSecret, profile, done) {

                // asynchronous
                // User.findOne wont fire unless data is sent back
                process.nextTick(function() {

                    User.findOne({ 'twitterID' :  profile.id }, function(err, user) {
                        // if there are any errors, return the error
                        if (err)
                            return done(err);

                        // check to see if theres already a user with that email
                        if (user) {
                            return done(null, user);
                        } else {

                            // if there is no user with that email
                            // create the user
                            var newUser = new User();

                            // set the user's local credentials
                            newUser.twitterID       = profile.id;
                            newUser.token           = token;
                            newUser.username        = profile.username;
                            newUser.displayName     = profile.displayName;

                            // save the user
                            newUser.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, newUser);
                            });
                        }

                    });

                });
            }
    ));

};