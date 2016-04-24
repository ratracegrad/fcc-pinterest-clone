var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var mongoose = require('mongoose');

var port = process.env.PORT || 3000;
var dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pinterestClone';

mongoose.connect(dbURI);

// If the connection throws an error
mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to server ' + dbURI);

    var app = express();

    require('./app/config/passport')(passport);

    app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use('/public', express.static('public'));

    // view engine setup
    app.set('views', path.join(__dirname, 'app/views'));
    app.set('view engine', 'ejs');

    /**
     * Passport configurations
     */
    app.use(session({
                        secret: 'fccbooktradingclubsecret',
                        resave: false,
                        saveUninitialized: true
                    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    require('./app/routes/index')(app,passport);

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });


    app.listen(port, function() {
        console.log('Server listening on port ' + port + '...');
    });


});


