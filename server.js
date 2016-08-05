var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var busboy = require('connect-busboy');
var bodyParser = require('body-parser');
var session = require('express-session');

var _mRouteAdmin = require('./applications/admin/server/route');
var _mRouteWebsite = require('./applications/website/server/route');
var _mRouteApi = require('./applications/api/server/route');

var _cDBConnect = require('./core/db/dbConnect');
var GLOBAL = require('./core/GLOBAL');

var app = express();

GLOBAL.sessionStore = new session.MemoryStore();

// view engine setup
app.set('views', path.join(__dirname, 'applications'));
app.set('view engine', 'jade');

app.use(require('subdomain')({
    base: "localhost",
    prefix: 'wildcard'
}));

var oConfig = JSON.parse(require("fs").readFileSync('config.json', 'utf8'));
var oDBConnect = new _cDBConnect(oConfig.db.url);


app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(session({
    store: GLOBAL.sessionStore,
    secret: 'sssssssssssshhhh',
    resave: false,
    saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(busboy());//File uploader
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(function (req, res, next) {
    req.GLOBAL = GLOBAL;
    req.db = oDBConnect;
    next();
});


//app.use('/wildcard/admin/_self', express.static(path.join(__dirname, 'applications/admin/client')));
//app.use('/wildcard/admin/_static', express.static(path.join(__dirname, 'public')));
//app.use('/wildcard/admin', _mRouteAdmin);

app.use('/wildcard/api', _mRouteApi);


app.use('/_self', express.static(path.join(__dirname, 'applications/admin/client')));
app.use('/_static', express.static(path.join(__dirname, 'public')));
//app.use('/_site', express.static(path.join(__dirname, 'applications/website/client')));

//app.use('/', _mRouteWebsite);
app.use('/', _mRouteAdmin);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});




// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
