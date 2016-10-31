var GLOBAL = require('../../../core/GLOBAL');
var excel = require('node-excel-export');
var isWin = /^win/.test(process.platform);


var ExcelExport = function (fId, res, dbName, domain) {

    this.downloadPath = isWin ? GLOBAL.Config.file_download.url : GLOBAL.Config.file_download.url_unix;

    this.downloadPath = this.downloadPath.replace("{domain}", domain);
    this.mapUrl = "http://maps.google.com/?q=";


    var that = this;

    GLOBAL.db.find(dbName + ".form_data", {meta_id: fId}, function (result) {
        result = result.map(function (v) {
            return that._filter(v.data);
        });
        
        
        if (result.length) {
            var specf = that._specific(result[0]);
        }
        
        result = result.map(function (v) {
            return that._mapData(v);
        });

        

        var report = excel.buildExport([{
                name: "report", // <- Specify sheet name (optional) 
                specification: specf, // <- Report specification 
                data: result // <-- Report data 
            }]);

        res.attachment('excel_report.xlsx');
        res.send(report);

    });


};

ExcelExport.prototype._filter = function (aData) {
    return aData.filter(function (v) {
        switch (v._t) {
            case "heading":
            case "link":
            case "text":
            case "image":
                return false;
            case "audio_record":
            case "video_record":
            case "sign_input":
            case "file_attach":
            case "photo_attach":
            case "location":
            case "products":
            case "address":
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

ExcelExport.prototype._mapData = function (aData) {
    var result = {};

    for (var i = 0; i < aData.length; i++) {
        var v = aData[i];
        var label = v._i;

        switch (v._t) {
            case "audio_record":
            case "video_record":
            case "sign_input":
            case "file_attach":
            case "photo_attach":
                result[label] = this.downloadPath + v._v;
                break;
            case "location":
                result[label] = this.mapUrl + v._v.lat + "," + v._v.lng;
                break;
            case "products":
                break;
            case "address":
                break;
            default:
                result[label] = v._v;
        }

    }
    return result;
};













module.exports = ExcelExport;