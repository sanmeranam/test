
var FormFactory = {
    createForm: function (db, tenant, user, group, FormMeta) {
        //TODO
        /**
         * Check flow
         * Create form structure
         * create current_stage
         * create flow entry
         * Make db entry
         * response entry
         */

        return {};
    },
    getAccessForms: function (db,dbname, user, group, callback) {

        db.find(dbname + ".form_meta", {state: 1}, function (result) {
            if (result) {
                var filteredForms = result.filter(function (v) {
                    var resut=FormFactory._checkAccess(user,group,v.flow);
                    if(resut.fc){
                        v.fc=true;
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
        FormFactory.FlatFlow(flow, flatList);
        var bAccessCreate=false;
        var fList = flatList.filter(function (v) {
            switch (v.type) {
                case "create":
                    if (v.model.fields.by.value.toLowerCase() === "any") {
                        bAccessCreate=true;
                        return {fa:true,fc:true};
                    } else if (v.model.fields.by.value.toLowerCase() === "user" && v.model.fields.user.value === user) {
                        bAccessCreate=true;
                        return true;
                    } else if (v.model.fields.by.value.toLowerCase() === "group" && v.model.fields.user_group.value === group) {
                        bAccessCreate=true;
                        return true;
                    }
                    break;
                case "user":
                    if (v.model.fields.user.value === user) {
                        return true;
                    }
                    break;
                case "user_group":
                    if (v.model.fields.user_group.value === group) {
                        return true;
                    }
                    break;
            }
            return false;
        });
        return {fa:fList.length > 0,fc:bAccessCreate};
    },
    FlatFlow: function (flow, mList) {
        mList.push(flow);

        for (var m in flow.next) {
            var inFl = flow.next[m];
            FormFactory.FlatFlow(inFl,mList);
        }
    }
};

module.exports = FormFactory;