var util = require('./util');
var fs = require('fs');

module.exports = {
    doLogin: function (req, res, next) {
        var user = req.body.email;
        var password = req.body.secret;

        req.db.find("accounts", {"user_group.users.email": user}, function (result) {
            var oData = result.length ? result[0] : null;
            if (oData) {
                var userGp = oData.user_group;
                var thisUser = null;
                var thisGroup = null;
                var users = userGp.filter(function (ug) {
                    ug = ug.users.filter(function (v) {
                        if (v.email === user && v.secret === password) {
                            thisGroup = ug;
                            thisUser = v;
                            return true;
                        }
                        return false;
                    });
                    return ug.length;
                });

                if (thisUser) {
                    var access = users[0];
                    delete(access.users);
                    delete(thisUser.secret);

                    thisUser.path = thisGroup.id + ":" + thisUser.id;

                    req.session.user = {
                        account: oData.account_id,
                        user: thisUser,
                        role: access
                    };
                    res.redirect("/");
                } else {
                    res.redirect("/login?error=true");
                }
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
    getFormMeta: function (req, res, next) {
        var id = req.params.id;
        req.db.findById('form_meta', id, function (data) {
            res.json(data);
        });
    },
    getFormMetaAll: function (req, res, next) {
        req.db.find('form_meta', {"account_id": req.session.user.account}, function (data) {
            res.json(data);
        });
    },
    updateFormMeta: function (req, res, next) {
        var id = req.params.id;
        req.db.updateById('form_meta', id, req.body, function (data) {
            res.json(data);
        });
    },
    saveFormMeta: function (req, res, next) {
        req.db.insertToTable('form_meta', req.body, function (data) {
            res.json(data);
        });
    },
    getFormData: function (req, res, next) {
        var id = req.params.id;
        req.db.findById('form_data', id, function (data) {
            res.json(data);
        });
    },
    getFormDataAll: function (req, res, next) {
        req.db.find('form_data', {"account_id": req.session.user.account}, function (data) {
            res.json(data);
        });
    },
    updateFormData: function (req, res, next) {
        var id = req.params.id;
        req.db.updateById('form_data', id, req.body, function (data) {
            res.json(data);
        });
    },
    saveFormData: function (req, res, next) {
        req.db.insertToTable('form_data', req.body, function (data) {
            res.json(data);
        });
    },
    getControlSchema: function (req, res, next) {
        res.json(JSON.parse(fs.readFileSync("./applications/admin/server/control_schema.json")));
    },
    getGlobalConfig: function (req, res, next) {
        var type = req.params.context;
        req.db.find('global_config', {"key": type}, function (data) {
            res.json(data);
        });
    },
    getAllUserGroup: function (req, res, next) {
        var user = req.session.user;
        if (user) {
            req.db.find("accounts", {'account_id': user.account}, function (result) {
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
            req.db.find("accounts", {'account_id': user.account}, function (result) {
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
        var account = req.params.account;

        req.db.find("accounts", {'account_id': account}, function (result) {
            var oData = result.length ? result[0] : null;
            if (oData) {
                switch (type) {
                    case '$users':
                        var aUserGrp = oData.user_group;
                        var users = [];
                        for (var i = 0; i < aUserGrp.length; i++) {
                            users = users.concat(aUserGrp[i].users);
                        }
                        users = users.map(function (v) {
                            delete(v.secret);
                            delete(v.inbox);
                            v.name = v.first_name + " " + v.last_name;
                            v.value = v.email;
                            return v;
                        });
                        res.json(users);
                        break;
                    case '$products':
                        break;
                    case '$user_group':
                        var aUserGrp = oData.user_group;
                        aUserGrp = aUserGrp.map(function (v) {
                            delete(v.users);
                            v.name = v.group_name;
                            v.value = v.group_name;
                            return v;
                        });
                        res.json(aUserGrp);
                        break;
                    default:


                }
            }
        });
    }
};