var fs = require('fs');
var Jimp = require("jimp");
var path = require("path");
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
            var tenant = req.tenant;
            var body = req.body;

            oFormFactory.createForm(tenant, body, function (repo) {
                res.json(helper.services._createSuccessPacket(repo, false));
            });
        },
        updateForm: function (req, res, next) {
            var tenant = req.tenant;
            var body = req.body;

            oFormFactory.updateForm(tenant, body, function (repo) {
                res.json(helper.services._createSuccessPacket(repo, false));
            });
        },
        getInboxForUser: function (req, res, next) {
            var tenant = req.tenant;
            var userId = req.query.user_id;
            req.db.find(tenant.dbname + ".form_data",{'next_stage._f.user.value':userId},function(result){
                res.json(helper.services._createSuccessPacket(result, true));
            });
        },
        lockForm: function (req, res, next) {

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
                                    return {_id: v._id, form_name: v.form_name, display_title: v.display_title, version: v.version, model_view: v.model_view, flow: v.flow};
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
                                    return {_id: v._id, form_name: v.form_name, display_title: v.display_title, version: v.version, model_view: v.model_view, flow: v.flow};
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
            var USER_ID = req.query._u;
            var size = req.query._s;
            var tenant = req.tenant;
            req.db.findById(tenant.dbname + ".accounts", USER_ID, function (result) {
                if (result && result.profile) {
                    var base64Data = result.profile.replace(/^data:image\/(png|gif|jpeg);base64,/, "");
                    var binaryData = new Buffer(base64Data, 'base64');
                    res.set('Content-Type', 'image/png');

                    if (size) {
                        size = parseInt(size);
                        Jimp.read(binaryData, function (err, image) {
                            if (!err) {
                                image.resize(size, size)
                                        .quality(60)
                                        .getBuffer('image/png', function (err, image) {
                                            res.send(image);
                                        });
                            }
                        });

                    } else {
                        res.send(binaryData);
                    }

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

            oMessager.setSystemKey(system_key, req.db, tenant.dbname);

            oMessager.onMessage(req.body, function (err, response) {
                if (err) {
                    res.json(helper.services._createErrorPacket(err));
                } else {
                    res.json(helper.services._createSuccessPacket(response));
                }
            });
        },
        fileUpload: function (req, res, next) {
            var fstream;
            var oParams = req.query;
            req.pipe(req.busboy);
            var tenant = req.tenant;
            var files = 0;
            var fRes = [];

            var fnGetMime = function (file) {
                if (file.toLowerCase().indexOf(".pdf") > -1) {
                    return "application/pdf";
                }
                if (file.toLowerCase().indexOf(".jpg") > -1 || file.toLowerCase().indexOf(".jpeg") > -1) {
                    return "image/jpeg";
                }

                if (file.toLowerCase().indexOf(".png") > -1) {
                    return "image/png";
                }

                if (file.toLowerCase().indexOf(".3gp") > -1) {
                    return "video/3gpp";
                }

                if (file.toLowerCase().indexOf(".mp4") > -1) {
                    return "video/mp4";
                }
                return "text/plain";
            };


            req.busboy.on('file', function (fieldname, file, filename) {
                ++files;
                var sFilePath = req.up + "/" + filename;
                fstream = fs.createWriteStream(sFilePath);
                file.pipe(fstream);
                fstream.on('close', function () {
                    req.db.insertToTable(tenant.dbname + '.file_entry', {
                        name: filename,
                        path: sFilePath,
                        field: fieldname,
                        create: (new Date()).getTime(),
                        mime: fnGetMime(filename),
                        params: oParams
                    }, function (oResult) {
                        fRes.push(oResult);
                        if (files === fRes.length) {
                            res.json(helper.services._createSuccessPacket(fRes, true));
                        }

                    });
                });
            });


        },
        fileDownload: function (req, res, next) {
            var tenant = req.tenant;
            var reqId = req.query.id;
            req.db.findById(tenant.dbname + ".file_entry", reqId, function (result) {
                if (result) {
                    try {
                        var stats = fs.statSync(result.path);
                        var fileSizeInBytes = stats["size"]
                        res.setHeader('Content-disposition', 'inline; filename=' + result.name);
                        res.setHeader('Content-type', result.mime);
                        res.setHeader('Content-Length', fileSizeInBytes);
                        var filestream = fs.createReadStream(result.path);
                        filestream.pipe(res);

                    } catch (e) {
                        res.end("File not found !!");
                    }
                } else {
                    res.end("File not found !!");
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