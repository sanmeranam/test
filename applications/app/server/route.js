var express = require('express');
var router = express.Router();
//var util = require('./util');
//var helper = require('./helper');



router.get('/', function (req, res, next) {
    res.render('./app/views/index', {title: 'Forms 1.0'});
});

router.get('/newform', function (req, res, next) {
    res.render('./app/views/newform', {title: 'Forms 1.0'});
});

module.exports = router;
