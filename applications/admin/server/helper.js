var util = require('./util');
var fs = require('fs');
var mongoAPI = require('mongodb');
var Jimp = require("jimp");
var GLOBAL = require('../../../core/GLOBAL');
var oMessager = require('../../../core/service/MessageProcess');
var oAnalytics = require('./analytics');
var oDashBoard = require('./dashboard');
var oExcelExpo = require('./export_excel');

var Accounts = require('../../../core/db/entity/Accounts');
var FormMeta = require('../../../core/db/entity/FormMeta');
var FileEntry = require('../../../core/db/entity/FileEntry');

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
        var sIs = req.query.fid;

        var qury = sIs ? {_id: sIs} : {};

        FormMeta.find(req.tenant.dbname, qury, function (result) {
            if (result) {
                result = result.map(function (f) {
                    return {
                        name: f._.form_name,
                        value: f._._id,
                        fields: helper._collectFields(f._.model_view)
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

        Accounts.find(req.tenant.dbname, {"email": user, secret: password}, function (result) {
            result = result.length ? result[0] : null;
            if (result) {
                var oData = result.getForSession();
                oData.tenant = req.tenant;
                req.session.user = oData;
                res.redirect("/");
            } else {
                res.redirect("/login?error=true");
            }
        });
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

        Accounts.findById(tenant.dbname, USER_ID, function (account) {
            if (account && account._.profile) {
                var base64Data = account._.profile.replace(/^data:image\/(png|gif|jpeg);base64,/, "");
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
        var user = req.session.user;
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
            case '$message':
                req.db.find(req.tenant.dbname + '.message_queue', {'$or': [{"to": user._id}, {"from": user._id}]}, function (ug) {
                    res.json(ug);
                });
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
    },
    getFormUsage: function (req, res, next) {
        req.db.find(req.tenant.dbname + ".form_data", {meta_id: req.query.id}, function (result) {
            var data = {
                total: result.length,
                daily: {}
            };

            if (result && result.length) {
                result = result.map(function (v) {
                    var m = (new Date(v.create_date)).toString().split(" ");
                    var key = m[1] + " " + m[2] + " " + m[3];

                    if (!data.daily[key]) {
                        data.daily[key] = 0;
                    }
                    data.daily[key] += 1;
                    return v;
                });
            }
            data.id = req.query.id;
            res.json(data);
        });
    },
    getFormAnalytics: function (req, res, next) {

        if (req.query.delete) {
            req.db.findById(req.tenant.dbname + ".form_meta", req.query.id, function (metaData) {


                var aCharts = metaData.charts;
                metaData.charts = aCharts.filter(function (v) {
                    return v.created != req.query.delete;
                });

                req.db.updateById(req.tenant.dbname + ".form_meta", req.query.id, metaData, function (o) {
                    res.json(o);
                });
            });
        } else {
            var aPro = new oAnalytics(req.query.id, req.tenant.dbname);
            aPro.process(res);
        }
    },
    exportForm: function (req, res, next) {
        var ee = new oExcelExpo(req.query.id, res, req.tenant.dbname, req.tenant.domain);
    },
    getDashboardData: function (req, res) {
        oDashBoard.data(req.tenant.dbname, res);
    },
    addFormAnalytics: function (req, res) {
        var oBody = req.body;
        var data = oBody.data;
        var fid = oBody.id;

        req.db.findById(req.tenant.dbname + ".form_meta", fid, function (metaData) {
            if (metaData) {
                metaData.charts = metaData.charts || [];
                metaData.charts.push(data);

                req.db.updateById(req.tenant.dbname + ".form_meta", fid, metaData, function (o) {
                    res.json(o);
                });
            }
        });
    },
    fileUpload: function (req, res, next) {
        var fstream;
        var oParams = req.query;
        req.pipe(req.busboy);
        var tenant = req.tenant;
        var files = 0;
        var fRes = [];

        var fnGetMime = function (file) {
            if (file.toLowerCase().indexOf(".pdf") > -1) {
                return "application/pdf";
            }
            if (file.toLowerCase().indexOf(".jpg") > -1 || file.toLowerCase().indexOf(".jpeg") > -1) {
                return "image/jpeg";
            }

            if (file.toLowerCase().indexOf(".png") > -1) {
                return "image/png";
            }

            if (file.toLowerCase().indexOf(".3gp") > -1) {
                return "video/3gpp";
            }

            if (file.toLowerCase().indexOf(".mp4") > -1) {
                return "video/mp4";
            }
            return "text/plain";
        };


        req.busboy.on('file', function (fieldname, file, filename) {
            ++files;
            var sFilePath = req.up + "/" + filename;
            fstream = fs.createWriteStream(sFilePath);
            file.pipe(fstream);
            fstream.on('close', function () {
                var ofile = new FileEntry({
                    name: filename,
                    path: sFilePath,
                    field: fieldname,
                    create: (new Date()).getTime(),
                    mime: fnGetMime(filename),
                    params: oParams
                });
                ofile.setDB(tenant.dbname);
                ofile.save(function (oResult) {
                    fRes.push(oResult);
                    if (files === fRes.length) {
                        res.json(fRes);
                    }
                });
            });
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
        var oTable = require('../../../core/db/entity/' + req.params.table);
        oTable.findById(req.tenant.dbname, req.params.id, function (result) {
            res.json(result._);
        });
    },
    restGetField: function (req, res, next) {
//        var sTable = req.tenant.dbname + "." + tableNameFormat(req.params.table);
        var sKey = req.params.field;
        var sValue = req.params.val;

        if (sKey === "_id" || sKey === "_ref") {
            sValue = new mongoAPI.ObjectId(sValue);
        }
        var oFilter = {};
        oFilter[sKey] = sValue;

        var oTable = require('../../../core/db/entity/' + req.params.table);
        oTable.find(req.tenant.dbname, oFilter, function (result) {
            result=result.map(function(v){
               return v._; 
            });
            res.json(result);
        });
    },
    restGetAll: function (req, res, next) {
        var oTable = require('../../../core/db/entity/' + req.params.table);
        oTable.find(req.tenant.dbname, req.query, function (result) {
            result=result.map(function(v){
               return v._; 
            });
            res.json(result);
        });
    },
    restCreate: function (req, res, next) {
        var oTable = require('../../../core/db/entity/' + req.params.table);
        var tbl = new oTable(req.body);
        tbl.setDB(req.tenant.dbname);
        tbl.save(function (result) {
            res.json(result);
        });
    },
    restUpdate: function (req, res, next) {
        var sId = req.params.id;
        var oTable = require('../../../core/db/entity/' + req.params.table);
        var tbl = new oTable(req.body);
        tbl.setDB(req.tenant.dbname);
        tbl._id = sId;
        tbl.save(function (result) {
            res.json(result);
        });
    },
    restDelete: function (req, res, next) {
        var sId = req.params.id;
        var oTable = require('../../../core/db/entity/' + req.params.table);
        var tbl = new oTable();
        tbl.setDB(req.tenant.dbname);
        tbl._id = sId;
        tbl.remove(function (result) {
            res.json(result);
        });
    },
    sendSingleMessage: function (req, res, next) {
        var system_key = GLOBAL.Config.gcm.system_key;
        var tenant = req.tenant;
        oMessager.setSystemKey(system_key, req.db, tenant.dbname);

        oMessager.onMessage(req.body, function (err, response) {
            if (err) {
                res.json({type: "ERROR", body: err});
            } else {
                res.json({type: "SUCCESS", body: response});
            }
        });
    },
    sendGroupMessage: function (req, res, next) {
    }
};

module.exports = helper;