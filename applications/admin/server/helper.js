var util = require('./util');
var fs = require('fs');
var mongoAPI = require('mongodb');


var tableNameFormat = function (text) {
    return text.replace(/\.?([A-Z]+)/g, function (x, y) {
        return "_" + y.toLowerCase();
    }).replace(/^_/, "");
};

module.exports = {
    doLogin: function (req, res, next) {
        var user = req.body.email;
        var password = req.body.secret;
        req.db.find(req.tenant.dbname + ".accounts", {"email": user}, function (result) {
            var oData = result.length ? result[0] : null;
            if (oData && oData.secret === password) {
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
                        v.name=v.value;
                        v.value=v._id;
                        
                        return v;
                    });
                    res.json(ug);
                });
                break;
            default:


        }
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
            res.json(result);
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