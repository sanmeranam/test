var FlowManager = require('./FlowManager');
var GLOBAL = require('../GLOBAL');


var FormFactory = {
    createForm: function (tenant, FormData, callback) {
        var sTable = tenant.dbname + ".form_data";
        GLOBAL.db.insertToTable(sTable, FormData, function (repo) {
            if (callback) {
                callback(repo);
            }

            var fm = new FlowManager(repo.ops[0], tenant);
            if (fm.hasNextFlow()) {
                fm.processFlow();
            }

        });
    },
    updateForm: function (tenant, FormData, callback) {
        var sTable = tenant.dbname + ".form_data";
        GLOBAL.db.updateById(sTable, FormData._id, FormData, function (repo) {
            if (callback) {
                callback(repo);
            }
            var fm = new FlowManager(FormData, tenant);
            if (fm.hasNextFlow()) {
                fm.processFlow();
            }
        });
    },
    getAccessForms: function (db, dbname, user, group, callback) {

        db.find(dbname + ".form_meta", {state: 1}, function (result) {
            if (result) {
                var filteredForms = result.filter(function (v) {
                    var resut = FormFactory._checkAccess(user, group, v.flow);
                    if (resut.fc) {
                        v.fc = true;
                    }
                    return resut.fa;
                });
                callback(filteredForms);
            } else {
                callback([]);
            }
        });
    },
    _checkAccess: function (user, group, flow) {
        var flatList = [];
        for (var m in flow) {
            flatList.push(flow[m]);
        }
        var bAccessCreate = false;
        var fList = flatList.filter(function (v) {
            switch (v._t) {
                case "CREATE":
                    if (v._f.by.value.toLowerCase() === "any") {
                        bAccessCreate = true;
                        return {fa: true, fc: true};
                    } else if (v._f.by.value.toLowerCase() === "user" && v._f.user.value === user) {
                        bAccessCreate = true;
                        return true;
                    } else if (v._f.by.value.toLowerCase() === "group" && v._f.user_group.value === group) {
                        bAccessCreate = true;
                        return true;
                    }
                    break;
                case "USER":
                    if (v._f.user.value === user) {
                        return true;
                    }
                    break;
                case "GROUP":
                    if (v._f.user_group.value === group) {
                        return true;
                    }
                    break;
                case "NOTIF":
                    if (v._f.to.value.toLowerCase() === "user" && v._f.user.value === user) {
                        bAccessCreate = true;
                        return true;
                    } else if (v._f.to.value.toLowerCase() === "group" && v._f.user_group.value === group) {
                        bAccessCreate = true;
                        return true;
                    }
                    break;
            }
            return false;
        });
        return {fa: fList.length > 0, fc: bAccessCreate};
    },
    FlatFlow: function (flow, mList) {
        mList.push(flow);

        for (var m in flow.next) {
            var inFl = flow.next[m];
            FormFactory.FlatFlow(inFl, mList);
        }
    }
};

module.exports = FormFactory;