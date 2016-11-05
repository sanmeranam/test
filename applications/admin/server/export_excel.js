var GLOBAL = require('../../../core/GLOBAL');
var excel = require('node-excel-export');
var isWin = /^win/.test(process.platform);


var ExcelExport = function (fId, res, dbName, domain) {

    this.downloadPath = isWin ? GLOBAL.Config.file_download.url : GLOBAL.Config.file_download.url_unix;

    this.downloadPath = this.downloadPath.replace("{domain}", domain);
    this.mapUrl = "http://maps.google.com/?q=";


    var that = this;

    GLOBAL.db.find(dbName + ".form_data", {meta_id: fId}, function (result) {
        if (!result.length) {
            res.send("Something went wrong.");
            return;
        }
        var expRec = result[0];

        var fieldMap = that._collectFields(expRec.model);

        result = result.map(function (v) {
            return that._filter(v.data);
        });

        var specf = that._specific(result[0]);


        result = result.map(function (v) {
            return that._mapData(v, fieldMap);
        });



        var report = excel.buildExport([{
                name: "report", // <- Specify sheet name (optional) 
                specification: specf, // <- Report specification 
                data: result // <-- Report data 
            }]);

        var name = expRec.form_name.toLowerCase().split(" ").join("_");
        res.attachment(name + '_report.xlsx');
        res.send(report);

    });


};


ExcelExport.prototype._getObject = function (ins, trg) {
    if (ins._n && ins._a.value) {
        trg[ins._d] = ins._a;
    }
    if (ins._c && ins._c.length) {
        for (var m in ins._c) {
            this._getObject(ins._c[m], trg);
        }
    }
};

ExcelExport.prototype._collectFields = function (model_view) {
    var resData = {};
    for (var iPage in model_view) {
        this._getObject(model_view[iPage], resData);
    }
    return resData;
};

ExcelExport.prototype._filter = function (aData) {
    return aData.filter(function (v) {
        switch (v._t) {
            case "heading":
            case "link":
            case "text":
            case "image":
                return false;
            default:
                return true;
        }
    });
};

ExcelExport.prototype._specific = function (aData) {
    var result = {};
    var header = {
        fill: {
            fgColor: {
                rgb: 'FF000000'
            }
        },
        font: {
            color: {
                rgb: 'FFFFFFFF'
            },
            sz: 14,
            bold: true
        }
    };

    for (var i = 0; i < aData.length; i++) {
        var v = aData[i];
        result[v._i] = {
            displayName: v._l,
            headerStyle: header,
            width: 100
        };
    }
    return result;
};

ExcelExport.prototype._mapData = function (aData, fieldMap) {
    var result = {};

    for (var i = 0; i < aData.length; i++) {
        var v = aData[i];
        var label = v._i;
        var mdl = fieldMap[v._i];

        switch (v._t) {
            case "audio_record":
            case "video_record":
            case "sign_input":
            case "file_attach":
            case "photo_attach":
                result[label] = v._v?this.downloadPath + v._v:"";
                break;
            case "location":
                result[label] = v._v.lat ? this.mapUrl + v._v.lat + "," + v._v.lng : "";
                break;
            case "products":
                break;
            case "address":
                break;
            case "rating":
                result[label] = v._v+"/"+mdl.stars.value;
                break;
            case "switch":
                result[label] = v._v?"YES":"NO";
                break;
            case "multi_options":
                vals = [];
                for (var i in mdl.options.value) {
                    if (v._v[i]) {
                        vals.push(mdl.options.value[i]);
                    }
                }
                break;
            default:
                result[label] = v._v;
        }

    }
    return result;
};













module.exports = ExcelExport;