var express = require('express');
var router = express.Router();
var oFormFactory = require('../../../core/service/FormFactory');
//var util = require('./util');
//var helper = require('./helper');



router.get('/', function (req, res, next) {
    res.render('./app/views/index', {title: 'Forms 1.0'});
});

router.get('/newform', function (req, res, next) {
    var formId = req.query._f;
    var token = req.query._t;
    var mode = req.query._m;
    var tenant = req.tenant;

    //TODO make entry of create form, with user details
    //Change flow status to in progress
    //


    req.db.findById(tenant.dbname + ".device_access", token, function (r) {
        if (r && r.IN_USER) {
            req.db.findById(tenant.dbname + ".accounts", r.IN_USER.toString(), function (oData) {
                if (oData) {
                    oFormFactory.createForm(req.db,tenant.dbname,oData,formId,function(oRes){
                        console.log(oRes.meta);
                        res.render('./app/views/newform', {title: 'Forms 1.0',form_meta:oRes.meta,form_data:oRes.data});
                    });
                }
            });
        } else {
            
        }
    });

//    switch (mode) {
//        case "ARG_MODE_NEW":
//            res.render('./app/views/newform', {title: 'Forms 1.0'});
//            break;
//        case "ARG_MODE_VIEW":
//            res.render('./app/views/viewform', {title: 'Forms 1.0'});
//            break;
//        case "ARG_MODE_EDIT":
//
//    }

});

module.exports = router;
