'use strict';

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var User            = require('./models/user');

function pass(passport, dao) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        dao.user.findById(id, function(err, user) {
            done(err, user);
        });
    });
// by default, local strategy uses username and password, we will override with email
    passport.use('local-signup', new LocalStrategy({
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
    },
        function(req, username, password, done) {

            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function() {
                console.log("UserName:" + username);
                dao.user.find({ username: username }, function(err, user) {
                    if (err)
                        return done(err);
                    if (!user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {
                        var newUser = new dao.user();
                        var newCategory = dao.category();
                        newCategory.category = req.category;
                        newUser.username = username;
                        newUser.password = newUser.generateHash(password);
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));
}

module.exports = pass;