'use strict';

var PinModel = require('../models/pins');

module.exports = function(app, passport) {

    app.use(function (req, res, next) {
        res.locals.login = req.isAuthenticated();
        next();
    });

    // =====================================
    // HOMEPAGE ============================
    // =====================================
    app.get('/', function(req, res, next) {
        PinModel.find({}, function(err, docs) {
            if (err) {
                throw err;
            }

            res.render('index', { pins: docs });
        });

    });

    app.get('/logout', function(req, res, next) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // TWITTER ROUTES ======================
    // =====================================
    app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
            passport.authenticate('twitter', {
                successRedirect : '/recent',
                failureRedirect : '/'
            })
    );

    // =====================================
    // RECENT ==============================
    // =====================================
    app.get('/recent', isLoggedIn, function(req, res, next) {
        PinModel.find({}, function(err, docs) {
            if (err) {
                throw err;
            }

            console.log('req.user', req.user);

            res.render('recent', { pins: docs, user: user } );
        });
    });

    // =====================================
    // MY PINS =============================
    // =====================================
    app.get('/mypins', isLoggedIn, function(req, res, next) {
        PinModel.find( {username: req.user.username}, function(err, docs) {
           if (err) {
               throw err;
           }

           res.render('mypins', { pins: docs });
        });
    });

    // =====================================
    // ADD PINS ============================
    // =====================================
    app.get('/add', isLoggedIn, function(req, res, next) {
        res.render('/add');
    });
    app.post('/add', function(req, res, next) {
        var entry = new PinModel({
            title:      req.body.title,
            url:        req.body.url,
            username:   req.user.username
        });
        entry.save(function(err, doc) {
            if (err) {
                throw err;
            }

            res.redirect('/recent');
        });
    });

    // =====================================
    // DELETE PINS =========================
    // =====================================
    app.get('/api/delete/:id', function(req, res, next) {
       PinModel.find( { _id: req.params.id }).remove().exec(function(err, doc) {
           if (err) {
               throw err;
           }

           res.redirect('/recent');
       });
    });

}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
