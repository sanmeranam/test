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

router.get('/login', function (req, res, next) {
    res.render('./admin/views/login', {title: 'Admin 1.0'});
});

router.get('/login.html', function (req, res, next) {
    res.render('./admin/views/login', {title: 'Admin 1.0'});
});


router.post('/session/login', helper.doLogin);
router.get('/session/logout', helper.doLogout);
router.get('/session/data', helper.getSession);

router.get('/service/formmeta/:id', helper.getFormMeta);
router.get('/service/formmeta', helper.getFormMetaAll);
router.post('/service/formmeta/:id', helper.updateFormMeta);
router.put('/service/formmeta', helper.saveFormMeta);
router.delete('/service/formmeta/:id', helper.deleteFormMeta);

router.get('/service/formdata/:id', helper.getFormData);
router.get('/service/formdata', helper.getFormDataAll);
router.post('/service/formdata/:id', helper.updateFormData);
router.put('/service/formdata', helper.saveFormData);

router.get('/service/usergroup', helper.getAllUserGroup);
router.post('/service/usergroup', helper.updateUserGroup);


router.get('/service/control_schema', helper.getControlSchema);

router.get('/service/global/:context', helper.getGlobalConfig);
router.get('/service/var/:account/:context', helper.getGlobalVariables);




module.exports = router;
