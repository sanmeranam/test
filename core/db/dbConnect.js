var mongoAPI = require('mongodb');
var mongo = mongoAPI.MongoClient;

module.exports = function (sURL) {
    this.sDBURL = sURL;
};

/**
 * 
 * @param {type} document
 * @param {type} callBack
 * @returns {undefined}
 */
module.exports.prototype.openConnection = function (document, callBack) {
    callBack = callBack || function () {
    };
    mongo.connect(this.sDBURL, function (err, db) {
        if (err) {
            callBack(null, null, err);
        } else {
            callBack(db, db.collection(document));
        }
    });
};

/**
 * 
 * @param {type} sTable
 * @param {type} oData
 * @param {type} callback
 * @returns {undefined}
 */
module.exports.prototype.insertToTable = function (sTable, oData, callback) {
    callback = callback || function () {
    };
    this.openConnection(sTable, function (db, conn, err) {
        if (db && conn) {
            conn.insert(oData, function (err, data) {
                if (data) {
                    callback(data);
                } else {
                    callback(null);
                }
                db.close();
            });
        } else {
            callback([]);
        }
    });
};

/**
 * 
 * @param {type} sTable
 * @param {type} sId
 * @param {type} callback
 * @returns {undefined}
 */
module.exports.prototype.findById = function (sTable, sId, callback) {
    callback = callback || function () {
    };
    this.openConnection(sTable, function (db, conn, err) {
        if (db && conn) {
            var oId = null;
            try {
                oId = new mongoAPI.ObjectId(sId);
                conn.findOne({"_id": oId}, function (err, data) {
                    if (data && data._id) {
                        callback(data);
                    } else {
                        callback(null);
                    }
                    db.close();
                });
            } catch (e) {
                callback(null);
                return;
            }
        } else {
            callback([]);
        }
    });
};

module.exports.prototype.findByIds = function (sTable, aId, callback) {
    callback = callback || function () {
    };

    this.openConnection(sTable, function (db, conn, err) {
        if (db && conn) {
            var oIds = [];
            for (var i in aId)
                oIds.push(new mongoAPI.ObjectId(aId[i]));


            conn.find({'_id': {$in: oIds}}, function (err, cursor) {
                console.log(err);
                console.log(cursor);
                if (err) {
                    callback([]);
                    db.close();
                } else if (cursor.toArray) {
                    cursor.toArray(function (err, items) {
                        callback(items);
                        db.close();
                    });
                } else {
                    callback(cursor);
                    db.close();
                }
            });
        } else {
            callback([]);
        }
    });
};

/**
 * 
 * @param {type} sTable
 * @param {type} oFilter
 * @param {type} callback
 * @returns {undefined}
 */
module.exports.prototype.find = function (sTable, oFilter, callback) {
    callback = callback || function () {
    };

    this.openConnection(sTable, function (db, conn, err) {
        if (db && conn) {
            conn.find(oFilter, function (err, cursor) {
                if (err) {
                    callback([]);
                    db.close();
                } else {
                    cursor.toArray(function (err, items) {
                        callback(items);
                        db.close();
                    });
                }

            });
        } else {
            callback([]);
        }
    });
};

/**
 * 
 * @param {type} sTable
 * @param {type} sId
 * @param {type} oNewData
 * @param {type} callback
 * @returns {undefined}
 */
module.exports.prototype.updateById = function (sTable, sId, oNewData, callback) {
    callback = callback || function () {
    };
    this.openConnection(sTable, function (db, conn, err) {
        if (db && conn) {
            oNewData._id = new mongoAPI.ObjectId(sId);
            conn.update({"_id": new mongoAPI.ObjectId(sId)}, oNewData, function (err, result) {
                if (result) {
                    callback(result);
                } else {
                    callback(err);
                }
                db.close();
            });
        } else {
            callback(err);
        }
    });
};


/**
 * 
 * @param {type} sTable
 * @param {type} sId
 * @param {type} callback
 * @returns {undefined}
 */
module.exports.prototype.removeById = function (sTable, sId, callback) {
    callback = callback || function () {
    };
    this.openConnection(sTable, function (db, conn, err) {
        if (db && conn) {
            conn.remove({"_id": new mongoAPI.ObjectId(sId)}, function (err, result) {
                if (result) {
                    callback(result);
                } else {
                    callback(null);
                }
                db.close();
            });
        } else {
            callback(null);
        }
    });
};