var util = require('./util');
var fs = require('fs');
var mongoAPI = require('mongodb');
var Jimp = require("jimp");
var GLOBAL = require('../../../core/GLOBAL');
var oMessager = require('../../../core/service/MessageProcess');

var tableNameFormat = function (text) {
    return text.replace(/\.?([A-Z]+)/g, function (x, y) {
        return "_" + y.toLowerCase();
    }).replace(/^_/, "");
};

var helper = {
    _getObject: function (ins, trg) {
        if (ins._n && ins._a.value) {
            trg[ins._d] = {
                type: ins._n,
                id: ins._d,
                label: ins._a.label.value
            };
        }
        if (ins._c && ins._c.length) {
            for (var m in ins._c) {
                helper._getObject(ins._c[m], trg);
            }
        }
    },
    _collectFields: function (model_view) {
        var resData = {};
        for (var iPage in model_view) {
            helper._getObject(model_view[iPage], resData);
        }
        return resData;
    },
    getFormDetails: function (req, res) {
        req.db.find(req.tenant.dbname + ".form_meta", {}, function (result) {
            if (result) {
                result = result.map(function (f) {
                    return {
                        name: f.form_name,
                        value: f._id,
                        fields: helper._collectFields(f.model_view)
                    };
                });

                res.json(result);
            } else {
                res.json([]);
            }
        });
    },
    doLogin: function (req, res, next) {
        var user = req.body.email;
        var password = req.body.secret;
        req.db.find(req.tenant.dbname + ".accounts", {"email": user}, function (result) {
            var oData = result.length ? result[0] : null;
            if (oData && oData.secret === password) {
                oData.profile = "";
                oData.tenant = req.tenant;
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
    getAvtar: function (req, res) {
        var USER_ID = req.query._u;
        var size = req.query._s;
        var tenant = req.tenant;
        req.db.findById(tenant.dbname + ".accounts", USER_ID, function (result) {
            if (result && result.profile) {
                var base64Data = result.profile.replace(/^data:image\/(png|gif|jpeg);base64,/, "");
                var binaryData = new Buffer(base64Data, 'base64');
                res.set('Content-Type', 'image/png');

                if (size) {
                    size = parseInt(size);
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
                res.end("");
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
                    req.db.updateById(req.tenant.dbname + '.accounts', oData._id, oData, function (data) {
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
            case '$sms':
                var sTable = req.tenant.dbname + ".template_factory";

                req.db.find(sTable, {type: 'SMS'}, function (temps) {
                    temps = temps.map(function (v) {
                        v.value = v._id;
                        return v;
                    });
                    res.json(temps);
                });
                break;
            case '$email':
                var sTable = req.tenant.dbname + ".template_factory";

                req.db.find(sTable, {type: 'EMAIL'}, function (temps) {
                    temps = temps.map(function (v) {
                        v.value = v._id;
                        return v;
                    });
                    res.json(temps);
                });
                break;
            case '$notify':
                break;
            case '$pdf':
                break;
            case '$excel':
                break;
            case '$forms':
                helper.getFormDetails(req, res);
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
    getVideoFile: function (req, res, next) {
        var sId = req.query.id;

        req.db.findById(req.tenant.dbname + ".file_entry", sId, function (result) {
            if (result) {
                try {
                    var stats = fs.statSync(result.path);

                    var range = req.headers.range;
                    if (!range) {
                        return res.sendStatus(416);
                    }

                    var positions = range.replace(/bytes=/, "").split("-");
                    var start = parseInt(positions[0], 10);
                    var total = stats.size;
                    var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
                    var chunksize = (end - start) + 1;

                    res.writeHead(206, {
                        "Content-Range": "bytes " + start + "-" + end + "/" + total,
                        "Accept-Ranges": "bytes",
                        "Content-Length": chunksize,
                        "Content-Type": "video/mp4"
                    });

                    var stream = fs.createReadStream(result.path, {start: start, end: end})
                            .on("open", function () {
                                stream.pipe(res);
                            })
                            .on("error", function (err) {
                                res.end(err);
                            });
                } catch (e) {
                    res.sendStatus(404);
                }
            } else {
                res.sendStatus(404);
            }
        });

    },
    getImageFile: function (req, res, next) {
        helper.getPdfFile(req, res, next);
    },
    getAudioFile: function (req, res, next) {
        helper.getPdfFile(req, res, next);
    },
    getPdfFile: function (req, res, next) {
        var tenant = req.tenant;
        var reqId = req.query.id;
        req.db.findById(tenant.dbname + ".file_entry", reqId, function (result) {
            if (result) {
                try {
                    var stats = fs.statSync(result.path);
                    var fileSizeInBytes = stats["size"]
                    res.setHeader('Content-disposition', 'inline; filename=' + result.name);
                    res.setHeader('Content-type', result.mime);
                    res.setHeader('Content-Length', fileSizeInBytes);
                    var filestream = fs.createReadStream(result.path);
                    filestream.pipe(res);

                } catch (e) {
                    res.end("File not found !!");
                }
            } else {
                res.end("File not found !!");
            }
        });
    }
    ,
    getFormUsage: function (req, res, next) {
        req.db.find(req.tenant.dbname + ".form_data", {meta_id: req.query.id}, function (result) {
            var data = {
                total: result.length,
                daily: {}
            };

            if (result && result.length) {
                result = result.map(function (v) {
                    var m = v.create_date.split(" ");
                    var key = m[1] + " " + m[2] + " " + m[5];

                    if (!data.daily[key]) {
                        data.daily[key] = 0;
                    }
                    data.daily[key] += 1;
                    return v;
                });
            }
            res.json(data);
        });
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
            res.json(helper.restAccountsHook(req.params.table, result));
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
    },
    sendSingleMessage: function (req, res, next) {
        var system_key = GLOBAL.Config.gcm.system_key;
        var tenant = req.tenant;
        oMessager.setSystemKey(system_key, req.db, tenant.dbname);

        oMessager.onMessage(req.body, function (err, response) {
            if (err) {
                res.json({type:"ERROR",body:err});
            } else {
                res.json({type:"SUCCESS",body:response});
            }
        });
    },
    sendGroupMessage: function (req, res, next) {

    }
};

module.exports = helper;