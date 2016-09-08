var fs = require('fs');
var oFormFactory = require('../../../core/service/FormFactory');
var oMessager = require('../../../core/service/MessageProcess');

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
        _createErrorPacket: function (msg) {
            return {
                error: 1,
                success: 0,
                array: 0,
                data: {
                    message: msg
                }
            };
        },
        _createSuccessPacket: function (data, bIsArray) {
            return {
                error: 0,
                success: 1,
                array: bIsArray ? 1 : 0,
                data: data
            };
        },
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
                    req.db.find(result.database + ".device_access", {DEVICE_ID: reqBody.DEVICE_ID}, function (r) {

                        if (r & r.length) {
                            req.db.updateById(result.database + ".device_access", r[0]._id.toString(), r[0], function () {
                                res.json(helper.services._createSuccessPacket(result, false));
                            });
                        } else {
                            reqBody.IN_DATE = Date.now();
                            reqBody.IN_USER = {};
                            req.db.insertToTable(result.database + ".device_access", reqBody, function (dRes) {
                                if (dRes && dRes.result.ok) {
                                    result.entryId = dRes.insertedIds[0];
                                }
                                res.json(helper.services._createSuccessPacket(result, false));
                            });
                        }
                    });
                } else {
                    res.json(helper.services._createErrorPacket(reqBody));
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
        syncForms: function (req, res) {
            var oBody = req.body;
            var tenant = req.tenant;
            var entryId = oBody.ENTRY_ID;
            req.db.findById(tenant.dbname + ".device_access", entryId, function (r) {
                if (r && r.IN_USER) {
                    req.db.findById(tenant.dbname + ".accounts", r.IN_USER.toString(), function (oData) {
                        if (oData) {
                            oFormFactory.getAccessForms(req.db, tenant.dbname, oData._id.toString(), oData.group, function (formsMeta) {
                                formsMeta = formsMeta.map(function (v) {
                                    return {_id: v._id, form_name: v.form_name, display_title: v.display_title, version: v.version};
                                });
                                res.json(helper.services._createSuccessPacket(formsMeta, true));
                            });
                        } else {
                            res.json(helper.services._createErrorPacket("Invalid token!"));
                        }
                    });
                } else {
                    res.json(helper.services._createErrorPacket("Device entity not available."));
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

                if (oData && oData.secret === password) {

                    oData.cgm_token = gcmToken;
                    req.db.updateById(tenant.dbname + ".accounts", oData._id.toString(), oData, function () {});

                    req.db.findById(tenant.dbname + ".device_access", entryId, function (r) {
                        if (r) {

                            oFormFactory.getAccessForms(req.db, tenant.dbname, oData._id.toString(), oData.group, function (formsMeta) {
                                formsMeta = formsMeta.map(function (v) {
                                    return {_id: v._id, form_name: v.form_name, display_title: v.display_title, version: v.version};
                                });

                                delete(oData.profile);
                                res.json(helper.services._createSuccessPacket({
                                    TOKEN: entryId,
                                    PROFILE: oData,
                                    FORM_META: formsMeta
                                }, false));
                            });


                            r.IN_USER = oData._id;
                            req.db.updateById(tenant.dbname + ".device_access", entryId, r, function () {});
                        } else {
                            res.json(helper.services._createErrorPacket("Token not found!"));
                        }

                    });

                } else {
                    res.json(helper.services._createErrorPacket("Invalid credentials !"));
                }
            });
        },
        updateGCMToken: function (req, res) {
            var oBody = req.body;
            var CGM_TOKEN = oBody.GCM_TOKEN;
            var USER_ID = oBody.USER_ID;
            var tenant = req.tenant;

            req.db.findById(tenant.dbname + ".accounts", USER_ID, function (result) {
                if (result) {
                    result.cgm_token = CGM_TOKEN;
                    req.db.updateById(tenant.dbname + ".accounts", result._id.toString(), result, function (rer) {
                        res.json(helper.services._createSuccessPacket(rer));
                    });
                } else {
                    res.json(helper.services._createErrorPacket("user not found"));
                }
            });
        },
        getProfileImage: function (req, res) {
            var oBody = req.body;
            var USER_ID = oBody.USER_ID;
            var tenant = req.tenant;
            req.db.findById(tenant.dbname + ".accounts", USER_ID, function (result) {
                if (result) {
                    res.json(helper.services._createSuccessPacket({
                        _id: USER_ID,
                        image: result.prfile
                    }));
                } else {
                    res.json(helper.services._createErrorPacket("user not found"));
                }
            });
        },
        updateProfileImage: function (req, res) {
            var oBody = req.body;
            var IMAGE = oBody.IMAGE;
            var USER_ID = oBody.USER_ID;
            var tenant = req.tenant;

            req.db.findById(tenant.dbname + ".accounts", USER_ID, function (result) {
                if (result) {
                    result.profile = IMAGE;
                    req.db.updateById(tenant.dbname + ".accounts", result._id, result, function (rer) {
                        res.json(helper.services._createSuccessPacket(rer));
                    });
                } else {
                    res.json(helper.services._createErrorPacket("user not found"));
                }
            });
        },
        getAllUsers: function (req, res) {
            helper._local.getAllGroup(req, function (aGrp) {
                helper._local.getAllUser(req, function (aUser) {
                    if (aUser && aUser.length) {
                        aUser = aUser.map(function (v) {
                            v.profile = "";
                            return v;
                        });
                    }

                    res.json(helper.services._createSuccessPacket({
                        USERS: aUser,
                        GROUPS: aGrp
                    }));
                });
            });
        },
        onmessage: function (req, res) {
            var system_key = req.GLOBAL.Config.gcm.system_key;
            var tenant = req.tenant;
            
            oMessager.setSystemKey(system_key,req.db,tenant.dbname);

            oMessager.onMessage(req.body, function (err, response) {
                if (err) {
                    res.json(helper.services._createErrorPacket(err));
                } else {
                    res.json(helper.services._createSuccessPacket(response));
                }
            });
        }
    },
    offline: {
        syncAppFiles: function () {
            //Send all html,js,css file zip
        },
        syncFormMeta: function () {
            //check all create auth forms , send meta array
        },
        syncFormData: function () {
            //Collect offline created forms and make entry of them
        }
    }
};

module.exports = helper;