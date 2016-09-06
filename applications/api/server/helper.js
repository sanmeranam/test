var fs = require('fs');
var oFormFactory = require('../../../core/service/FormFactory');

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

            var reqBody = req.body;
            var SCAN_ID = reqBody.SCAN_ID;

            req.db.findById("c4f_master.tenant_master", SCAN_ID, function (result) {
                if (result) {
                    reqBody.IN_DATE = Date.now();
                    reqBody.IN_USER = {};

                    req.db.insertToTable(result.database + ".device_access", reqBody, function (dRes) {
                        if (dRes && dRes.result.ok) {
                            result.entryId = dRes.insertedIds[0];
                        }
                        res.json(result);
                    });
                } else {
                    res.json({error: 1, data: reqBody});
                }
            });
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
        syncForms:function(req, res){
            var oBody = req.body;
            var tenant = req.tenant;
            var entryId = oBody.ENTRY_ID;
            req.db.findById(tenant.dbname + ".device_access", entryId, function (r) {
                console.log(r);
                if (r && r.IN_USER) {
                    req.db.findById(tenant.dbname + ".accounts", r.IN_USER, function (oData) {
                        if(oData){
                            oFormFactory.getAccessForms(req.db, tenant.dbname, oData._id, oData.group, function (formsMeta) {
                                formsMeta = formsMeta.map(function (v) {
                                    return {_id: v._id, form_name: v.form_name, display_title: v.display_title, version: v.version};
                                });
                                res.json(formsMeta);
                            });
                        }else{
                            res.json({error: 1, data: oBody});
                        }
                    });
                }else{
                    res.json({error: 1, data: oBody});
                }
            });
        },
        signinAccount: function (req, res) {
            var oBody = req.body;
            var entryId = oBody.ENTRY_ID;
            var gcmToken = oBody.GCM_TOKEN;
            var tenant = req.tenant;
            var user = oBody.USER;
            var password = oBody.PASSWORD;

            req.db.find(tenant.dbname + ".accounts", {"email": user}, function (result) {
                var oData = result.length ? result[0] : null;

                if (oData && oData.secret == password) {
                    
                    oData.cgm_token=gcmToken;
                    req.db.updateById(tenant.dbname + ".accounts", oData._id,oData, function () {});

                    req.db.findById(tenant.dbname + ".device_access", entryId, function (r) {
                        if (r) {

                            oFormFactory.getAccessForms(req.db, tenant.dbname, oData._id, oData.group, function (formsMeta) {
                                formsMeta = formsMeta.map(function (v) {
                                    return {_id: v._id, form_name: v.form_name, display_title: v.display_title, version: v.version};
                                });
                                
                                delete(oData.profile);
                                res.json({
                                    user:oData,
                                    forms:formsMeta
                                });
                            });


                            r.IN_USER = oData._id;
                            req.db.updateById(tenant.dbname + ".device_access", entryId, r, function () {});
                        } else {
                            res.json({error: 1, data: oBody});
                        }

                    });

                } else {
                    res.json({error: 1, data: oBody});
                }
            });
            //Get
            /**
             * Entry Id
             * email
             * password
             * 
             */

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