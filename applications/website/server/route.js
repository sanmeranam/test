var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    req.sessionStore.get(req.session.id, function (err,data) {
        console.log(data);
    });
    
    res.render('./website/views/index', {title: req.session.id});
});

router.get('/index.html', function (req, res, next) {
    req.sessionStore.get(req.session.id, function (err,data) {
        console.log(data);
    });
    
    res.render('./website/views/index', {title: req.session.id});
});

module.exports = router;
