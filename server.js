var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var busboy = require('connect-busboy');
var bodyParser = require('body-parser');
var compression = require('compression');
var session = require('express-session');

var oLiveEvents=require('./core/event/LiveEvents');

var _mRouteAdmin = require('./applications/admin/server/route');
var _mRouteWebsite = require('./applications/website/server/route');
var _mRouteApi = require('./applications/api/server/route');
var _mRouteApp = require('./applications/app/server/route');

var _cDBConnect = require('./core/db/dbConnect');
var GLOBAL = require('./core/GLOBAL');

var app = express();

GLOBAL.sessionStore = new session.MemoryStore();
var oConfig = JSON.parse(require("fs").readFileSync('config.json', 'utf8'));

// view engine setup
app.set('views', path.join(__dirname, 'applications'));
app.set('view engine', 'jade');

var isWin = /^win/.test(process.platform);

var domain = isWin ? oConfig.server.domain : oConfig.server.domain_unix;

app.use(require('subdomain')({
    base: domain,
    prefix: 'wildcard'
}));
app._port = oConfig.server.port;

var oDBConnect = new _cDBConnect(isWin ? oConfig.db.url : oConfig.db.url_unix);

app.use(compression());
app.use(favicon(path.join(__dirname, 'public/fav/', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());

app.use(session({
    store: GLOBAL.sessionStore,
    secret: 'sssssssssssshhhh',
    resave: false,
    saveUninitialized: true
}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(busboy());//File uploader

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(function (req, res, next) {
    req.GLOBAL = GLOBAL;
    req.db = oDBConnect;
    req.up=isWin ? oConfig.files.upload_path : oConfig.files.upload_path_unix;
    next();
});

GLOBAL.Config=oConfig;

app.use('/wildcard/app/_self_app', express.static(path.join(__dirname, 'applications/app/client')));
app.use('/wildcard/app/_static_app', express.static(path.join(__dirname, 'public')));
app.use('/wildcard/*/_self', express.static(path.join(__dirname, 'applications/admin/client')));
app.use('/wildcard/*/_static', express.static(path.join(__dirname, 'public')));

var apiSubCheck = function (callback) {
    return function (req, res, next) {
        req.tenant = {
            domain: req.params.domain,
            dbname: 'c4f_' + req.params.domain
        };
        callback(req, res, next);
    };
};


app.use('/wildcard/api/:domain', apiSubCheck(_mRouteApi));
app.use('/wildcard/app/:domain', apiSubCheck(_mRouteApp));

var check = function (callback) {
    return function (req, res, next) {
        req.tenant = {
            domain: req.params.domain,
            dbname: 'c4f_' + req.params.domain
        };
        if (req.path.indexOf("no-domain") > -1) {
            callback(req, res, next);
            return;
        }

        req.db.find('c4f_master.tenant_master', {domain: req.tenant.domain}, function (data) {
            if (data && data.length) {
                callback(req, res, next);
            } else {
                res.redirect("/no-domain");
            }
        });
        return;
    };
};

app.use('/wildcard/:domain', check(_mRouteAdmin));

app.use('/_site', express.static(path.join(__dirname, 'applications/website/client')));
app.use('/', _mRouteWebsite);

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
            error: {}
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

GLOBAL.LiveEvent=new oLiveEvents(oConfig.gcm);

module.exports = app;