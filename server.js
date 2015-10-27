/**
 * Created by matan on 26/10/15.
 */

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
var server = require('http').Server(app);

var DEPLOYMENT_URL = process.env.OPENSHIFT_NODEJS_IP; //'http://front-stanga.rhcloud.com/';
var DEVELOPMENT_URL = '127.0.0.1';
var DEVELOPMENT_PORT = 8080;
var DEPLOYMENT_PORT = process.env.OPENSHIFT_NODEJS_PORT;
global.URL = (process.env.OPENSHIFT_NODEJS_IP) ? DEPLOYMENT_URL : DEVELOPMENT_URL;
global.PORT = (process.env.OPENSHIFT_NODEJS_PORT) ? DEPLOYMENT_PORT : DEVELOPMENT_PORT;

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use("/", express.static(path.join(__dirname, 'public')));
app.get('/json', require('./bin/DataManager').getJson);

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
    //res.sendfile('./public/error.html');
    next()
});


server.listen(global.PORT, 'localhost', function() {
    console.log((new Date()) + ' Server is listening on port ' + global.PORT);
});