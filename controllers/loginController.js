'use strict';

function loginController(dao, passport) {
    var express = require('express');
    var router = express.Router();

    router.get('/', root);
    router.get('/signup', signup);
    router.get('/profile', isLoggedIn, getProfile);
    router.post('/login', login);
    router.post('/signup',
            passport.authenticate('local-signup', {
                successRedirect : '/profile', // redirect to the secure profile section
                failureRedirect : '/login/signup', // redirect back to the signup page if there is an error
                failureFlash : true // allow flash messages
                }));

    function getProfile(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    }

    function signup(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    }


    function root(req, res) {
        res.render('index.ejs');                    // load the index.ejs file
    }

    function login(req, res) {

    }

    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
    }

    return router;
}

module.exports = loginController;