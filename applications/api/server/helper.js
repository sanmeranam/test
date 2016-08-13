var fs = require('fs');
//var oFormFactory = require('./service/FormFactory');

var helper = {
    _local: {
        getAllUser: function (req, callback) {
            var sTable = req.tenant.dbname + ".accounts";
            req.db.find(sTable, {}, function (result) {
                callback(result);
            });
        },
        getAllGroup: function (req, callback) {
            req.db.find(req.tenant.dbname + '.global_config', {"key": 'user_group'}, function (ug) {
                callback(ug);
            });
        }
    },
    rest: {
        _checkTable: function (req, res) {
            var restBlackListTables = ["auth_token", "session", "accounts"];
            var sTable = req.params.table;
            if (restBlackListTables.indexOf(sTable) > -1) {
                res.json(401, {error: 1, message: "This resources under access restriction via Restful WS."});
                return false;
            } else {
                return true;
            }
        },
        findById: function (req, res, next) {
            if (!helper.rest._checkTable(req, res))
                return;

            var sTable = req.tenant.dbname + "." + req.params.table;
            var sId = req.params.id;
            req.db.findById(sTable, sId, function (result) {
                res.json(result);
            });
        },
        findByIds: function (req, res, next) {
            var sTable = req.params.table;
        },
        findByField: function (req, res, next) {
            if (!helper.rest._checkTable(req, res))
                return;

            var sTable = req.tenant.dbname + "." + req.params.table;
            var sKey = req.params.key;
            var sValue = req.params.value;
            var oFilter = {};
            oFilter[sKey] = sValue;
            req.db.find(sTable, oFilter, function (result) {
                res.json(result);
            });
        },
        findAll: function (req, res, next) {
            if (!helper.rest._checkTable(req, res))
                return;

            var sTable = req.tenant.dbname + "." + req.params.table;
            req.db.find(sTable, {}, function (result) {
                res.json(result);
            });
        },
        create: function (req, res, next) {
            if (!helper.rest._checkTable(req, res))
                return;

            var sTable = req.tenant.dbname + "." + req.params.table;
            var oData = req.body;
            req.db.insertToTable(sTable, oData, function (result) {
                res.json(result);
            });
        },
        update: function (req, res, next) {
            if (!helper.rest._checkTable(req, res))
                return;

            var sTable = req.tenant.dbname + "." + req.params.table;
            var sId = req.params.id;
            var oData = req.body;
            req.db.updateById(sTable, sId, oData, function (result) {
                res.json(result);
            });
        },
        remove: function (req, res, next) {
            if (!helper.rest._checkTable(req, res))
                return;

            var sTable = req.tenant.dbname + "." + req.params.table;
            var sId = req.params.id;
            req.db.removeById(sTable, sId, function (result) {
                res.json(result);
            });
        }
    },
    services: {
        createForm: function (req, res, next) {
            var tenant = req.tenant.domain;
            var body = req.body;
            var user = body.session;
            var formId = body.formId;
            var sTable = req.tenant.dbname + ".form_meta";
            req.db.findById(sTable, formId, function (resultForm) {
//                if (resultForm && resultForm.state === 1) {
//                    helper._local.getAllGroup(req, function (ug) {
//                        var resJSON = oFormFactory.createForm(req.db, tenant, user, ug, resultForm);
//                        res.json(resJSON);
//                    });
//                } else {
//
//                }
            });
        },
        updateForm: function (req, res, next) {

        },
        syncAccount: function (req, res) {
            var reqBody=req.body;
            var SCAN_ID=reqBody.SCAN_ID;
            
            req.db.findById("c4f_master.tenant_master",SCAN_ID,function(result){
                if(result){
                    req.db.insertToTable(result.database+".device_access",reqBody,function(){
                        
                    });                     
                    res.json(result);
                }else{
                    res.json({error:1});
                }
            });
            //--Expect
            /**
             * Device id
             * scan id
             * secure id
             */


            //--to responce
            /**
             * tenant details
             * sync url
             * Authable
             * branding details
             * preferences
             *        tracking
             *        offiline
             *        
             */

        },
        signinAccount: function (req, res) {


            //--send
            /**
             * Create Access Forms
             * Review Access Forms
             * Token
             * 
             * 
             */
        }
        //account details sync
        //token details with exp sync
        //file upload
        //Online form creation
        //form details pick
        //Perform forward actions
    },
    offline: {
        //Model sync based on flow privilage
        //Form view access
        //Switch online data sync
        //File upload
        //Next flow trigger
    }
};

module.exports = helper;