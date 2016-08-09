var fs = require('fs');

var helper = {
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