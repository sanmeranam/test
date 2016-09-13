var util = require('./util');
var fs = require('fs');
var mongoAPI = require('mongodb');
var Jimp = require("jimp");

var tableNameFormat = function (text) {
    return text.replace(/\.?([A-Z]+)/g, function (x, y) {
        return "_" + y.toLowerCase();
    }).replace(/^_/, "");
};

var helper= {
    doLogin: function (req, res, next) {
        var user = req.body.email;
        var password = req.body.secret;
        req.db.find(req.tenant.dbname + ".accounts", {"email": user}, function (result) {
            var oData = result.length ? result[0] : null;
            if (oData && oData.secret === password) {
                oData.profile="";
                req.session.user = oData;
                res.redirect("/");
            } else {
                res.redirect("/login?error=true");
            }
        }
        );
    },
    doLogout: function (req, res, next) {
        req.session.destroy();
        res.redirect("/login?logout=true");
    },
    getSession: function (req, res, next) {
        var user = req.session.user;
        if (user) {
            res.json(util.createResponse(true, user));
        } else {
            res.json(util.createResponse(false, "Error"));
        }
    },
    getAvtar:function(req,res){
        var USER_ID = req.query._u;
            var size = req.query._s;
            var tenant = req.tenant;
            req.db.findById(tenant.dbname + ".accounts", USER_ID, function (result) {
                if (result && result.profile) {
                    var base64Data = result.profile.replace(/^data:image\/(png|gif|jpeg);base64,/, "");
                    var binaryData = new Buffer(base64Data, 'base64');
                    res.set('Content-Type', 'image/png');

                    if (size) {
                        size=parseInt(size);
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
    getControlSchema: function (req, res, next) {
        res.json(JSON.parse(fs.readFileSync("./applications/admin/server/control_schema.json")));
    },
    getGlobalConfig: function (req, res, next) {
        var type = req.params.context;
        req.db.find(req.tenant.dbname + '.global_config', {"key": type}, function (data) {
            res.json(data);
        });
    },
    getAllUserGroup: function (req, res, next) {
        var user = req.session.user;
        if (user) {
            req.db.find(req.tenant.dbname + ".accounts", {'account_id': user.account}, function (result) {
                var oData = result.length ? result[0] : null;
                if (oData) {
                    res.json(oData.user_group);
                }
            });
        } else {
            res.json([]);
        }
    },
    updateUserGroup: function (req, res, next) {
        var user = req.session.user;
        if (user) {
            req.db.find(req.tenant.dbname + ".accounts", {'account_id': user.account}, function (result) {
                var oData = result.length ? result[0] : null;
                if (oData) {
                    oData.user_group = req.body;
                    req.db.updateById('accounts', oData._id, oData, function (data) {
                        res.json(data);
                    });
                }
            });
        } else {
            res.json({error: "error"});
        }
    },
    getGlobalVariables: function (req, res, next) {
        var type = req.params.context;
        switch (type) {
            case '$users':
                var sTable = req.tenant.dbname + ".accounts";

                req.db.find(sTable, {}, function (users) {
                    users = users.map(function (v) {
                        delete(v.secret);
                        delete(v.inbox);
                        delete(v.profile);
                        v.name = v.first_name + " " + v.last_name;
                        v.value = v._id;
                        return v;
                    });
                    res.json(users);
                });
                break;
            case '$products':
                break;
            case '$user_group':
                req.db.find(req.tenant.dbname + '.global_config', {"key": 'user_group'}, function (ug) {
                    ug = ug.map(function (v) {
                        v.name = v.value;
                        v.value = v._id;

                        return v;
                    });
                    res.json(ug);
                });
                break;
            default:


        }
    },
    restAccountsHook: function (table, data) {
        if (table.toLowerCase() == "accounts") {
            return data.map(function (v) {
                v.profile = "";
                return v;
            });
        }
        return data;
    },
    restGet: function (req, res, next) {
        var sTable = req.tenant.dbname + "." + tableNameFormat(req.params.table);
        var sId = req.params.id;
        
        req.db.findById(sTable, sId, function (result) {            
            res.json(result);
        });
    },
    restGetField: function (req, res, next) {
        var sTable = req.tenant.dbname + "." + tableNameFormat(req.params.table);
        var sKey = req.params.field;
        var sValue = req.params.val;

        if (sKey === "_id" || sKey === "_ref") {
            sValue = new mongoAPI.ObjectId(sValue);
        }
        var oFilter = {};
        oFilter[sKey] = sValue;
        req.db.find(sTable, oFilter, function (result) {
            res.json(result);
        });
    },
    restGetAll: function (req, res, next) {
        var sTable = req.tenant.dbname + "." + tableNameFormat(req.params.table);
        req.db.find(sTable, {}, function (result) {            
            res.json(helper.restAccountsHook(req.params.table,result));
        });
    },
    restCreate: function (req, res, next) {
        var sTable = req.tenant.dbname + "." + tableNameFormat(req.params.table);
        var oData = req.body;
        req.db.insertToTable(sTable, oData, function (result) {
            res.json(result);
        });
    },
    restUpdate: function (req, res, next) {
        var sTable = req.tenant.dbname + "." + tableNameFormat(req.params.table);
        var sId = req.params.id;
        var oData = req.body;
        req.db.updateById(sTable, sId, oData, function (result) {
            res.json(result);
        });
    },
    restDelete: function (req, res, next) {
        var sTable = req.tenant.dbname + "." + tableNameFormat(req.params.table);
        var sId = req.params.id;
        req.db.removeById(sTable, sId, function (result) {
            res.json(result);
        });
    }
};

module.exports = helper;