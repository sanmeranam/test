var util = require('./util');
var fs=require('fs');

module.exports = {
    doLogin: function (req, res, next) {
        var user = req.body.email;
        var password = req.body.secret;

        req.db.find("accounts", {'user_group.users.email': user}, function (result) {
            var oData = result.length ? result[0] : null;
            if (oData) {
                var userGp = oData.user_group;
                var thisUser = null;
                var users = userGp.filter(function (ug) {
                    ug = ug.users.filter(function (v) {
                        if (v.email === user && v.secret === password) {
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

                    req.session.user = {
                        account: oData.account_id,
                        user: thisUser,
                        role: access
                    };
                    res.redirect("/");
                } else {
                    res.redirect("/login?error=true");
                }
            }else{
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
        req.db.find('form_meta', {"account_id":req.session.user.account}, function (data) {
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
    getControlSchema:function(req, res, next){
        res.json(JSON.parse(fs.readFileSync("./applications/admin/server/control_schema.json")));
    }
};