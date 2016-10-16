var express = require('express');
var router = express.Router();
var util = require('./util');
var helper = require('./helper');



router.get('/', function (req, res, next) {
    var user = req.session.user;
    if (user) {
        util.getNgControllerFiles(function (aFiles) {
            res.render('./admin/views/index', {title: 'Admin 1.0', ngCtl: aFiles});
        });
    } else {
        res.redirect("/login");
    }
});

router.get('/index.html', function (req, res, next) {
    var user = req.session.user;
    if (user) {
        util.getNgControllerFiles(function (aFiles) {
            res.render('./admin/views/index', {title: 'Admin 1.0', ngCtl: aFiles});
        });
    } else {
        res.redirect("/login");
    }
});

router.get('/no-domain', function (req, res, next) {
    res.render('./admin/views/wrong_tenant', {domain: req.tenant.domain});
});

router.get('/login', function (req, res, next) {
    res.render('./admin/views/login', {title: 'Admin 1.0'});
});

router.get('/login.html', function (req, res, next) {
    res.render('./admin/views/login', {title: 'Admin 1.0'});
});


router.post('/session/login', helper.doLogin);
router.get('/session/logout', helper.doLogout);
router.get('/session/data', helper.getSession);

router.get('/rest/:table/:id', helper.restGet);
router.get('/rest/:table/:field/:val', helper.restGetField);
router.get('/rest/:table', helper.restGetAll);
router.post('/rest/:table/:id', helper.restUpdate);
router.put('/rest/:table', helper.restCreate);
router.delete('/rest/:table/:id', helper.restDelete);

router.get('/service/avtar', helper.getAvtar);
router.get('/service/control_schema', helper.getControlSchema);

router.get('/service/file/video', helper.getVideoFile);
router.get('/service/file/image', helper.getImageFile);
router.get('/service/file/audio', helper.getAudioFile);
router.get('/service/file/pdf', helper.getPdfFile);

router.get('/service/data_factory/list', helper.getGlobalConfig);
router.get('/service/global/:context', helper.getGlobalConfig);
router.get('/service/var/:context', helper.getGlobalVariables);

router.get('/service/forms/usage', helper.getFormUsage);




module.exports = router;
