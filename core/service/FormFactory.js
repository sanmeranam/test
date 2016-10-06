
var FormFactory = {
    createForm: function (db, dbname, oUser, FormMetaId, callback) {
        //TODO
        /**
         * Check flow
         * Create form structure
         * create current_stage
         * create flow entry
         * Make db entry
         * response entry
         */

        db.findById(dbname + ".form_meta", FormMetaId, function (res) {
            callback({meta: res, data: {}});
        });

        return {};
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
//        var flatList = [];
        //FormFactory.FlatFlow(flow, flatList);
        var bAccessCreate = false;
        var fList = flow.filter(function (v) {
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