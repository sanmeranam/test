var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) { 
    res.render('./website/views/index', {title: req.session.id});
});

router.get('/index.html', function (req, res, next) {
    res.render('./website/views/index', {title: req.session.id});
});

router.get('/signup', function (req, res, next) {
    res.render('./website/views/signup', {title: req.session.id});
});

module.exports = router;
