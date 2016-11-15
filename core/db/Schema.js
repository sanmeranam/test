var mongoAPI = require('mongodb');
var GLOBAL = require('../GLOBAL');

var Schema = function (sName, oStruct) {
    var Model = function (oProp) {
        this._={};
        if (oProp && typeof (oProp) === "object") {
            this._invoke(this._, oProp);
        }
    };

    Model._table = sName.toLowerCase();
    Model._default = {};
    Model.find = function (sDB, oFilter, callback) {
        GLOBAL.db.find(sDB + "." + Model._table, oFilter, function (result) {
            if (result) {
                result = result.map(function (v) {
                    var ins = new Model(v);
                    ins.setDB(sDB);
                    return ins;
                });
                callback(result);
            } else {
                callback([]);
            }
        });
    };
    Model.findById = function (sDB, sId, callback) {
        if (sId instanceof mongoAPI.ObjectId) {

        } else {
            sId = new mongoAPI.ObjectId(sId);
        }

        GLOBAL.db.findById(sDB + "." + Model._table, sId, function (result) {
            if (result) {
                var ins = new Model(result);
                ins.setDB(sDB);
                callback(ins);
            } else {
                callback(null);
            }
        });


    };

    Model.methods = function (deff) {
        for (var i in deff) {
            Model.prototype[i] = deff[i];
        }
    };

    var pro = {
        _invoke: function (oBase, obj) {
            var _default = this._class._default;

            var done = [];
            for (var i in oBase) {

                if (typeof (oBase[i]) == "function" || i.indexOf("__") > -1) {
                    continue;
                }
                if (obj[i]) {
                    done.push(i);
                    if (typeof (obj[i]) == "object" && !obj[i].hasOwnProperty("push")) {
                        oBase[i] = oBase[i] || {};
                        this._invoke(oBase[i], obj[i]);
                    } else {
                        oBase[i] = obj[i];
                    }

                } else if (_default[i]) {
                    oBase[i] = typeof (_default[i]) == "function" ? _default[i]() : _default[i];
                }
            }
            if (obj._id) {
                oBase._id = obj._id;
            }
            for (var m in obj) {
                if (done.indexOf(m) == -1) {
                    oBase[m] = obj[m];
                }
            }
        },
        set: function (obj) {
            this._invoke(this._, obj);
        },
        setDB: function (sDb) {
            this.__dbname = sDb;
        },
        save: function (callback) {
            var that = this;
            if (this._._id) {
                if (this._._id instanceof mongoAPI.ObjectId) {
                    this._._id = this._._id.toString();
                }
                GLOBAL.db.updateById(this.__dbname + "." + Model._table, this._._id, this._get(), function () {
                    callback(that);
                });
            } else {
                delete(this._._id);
                GLOBAL.db.insertToTable(this.__dbname + "." + Model._table, this._get(), function (ops) {
                    if (ops.result.ok) {
                        that._id = ops.insertedIds[0];
                        callback(that);
                    }
                });
            }
        },
        remove: function (callback) {
            if (this._._id) {
                if (this._._id instanceof mongoAPI.ObjectId) {
                    this._._id = this._._id.toString();
                }
                GLOBAL.db.removeById(this.__dbname + "." + Model._table, this._._id, callback);
            } else {
                callback(null);
            }
        },
        _get: function () {
            return this._;
        }
    };

    var fnPro = function (base, obj) {

        for (var m in obj) {
            var deff = obj[m];
            if (typeof (deff) == "object") {
                if (deff.hasOwnProperty("value") || deff.hasOwnProperty("type")) {
                    switch (deff.type) {
                        case "number":
                            base[m] = deff.value || 0;
                            break;
                        case "boolean":
                            base[m] = deff.value || false;
                            break;
                        case "date":
                            base[m] = new Date();
                            break;
                        case "array":
                            base[m] = [];
                        case "string":
                        default:
                            base[m] = deff.value || "";
                            break;
                    }
                    if (deff.value) {
                        Model._default[m] = deff.value;
                    }

                } else {
                    base[m] = {};
                    fnPro(base[m], deff);
                }
            } else {
                base[m] = deff;
            }
        }
    };

    fnPro(pro, oStruct);

    Model.prototype = pro;

    Model.prototype._class = Model;
    return Model;
};



module.exports = Schema;