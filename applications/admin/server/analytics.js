var GLOBAL = require('../../../core/GLOBAL');


var Analytics = function (formMetaId, dbName) {
    this.formId = formMetaId;
    this.dbName = dbName;
};

Analytics.prototype.applyGT = function (sValue, aData) {

};

Analytics.prototype.applyLT = function (sValue, aData) {

};
Analytics.prototype.applyET = function (sValue, aData) {

};
Analytics.prototype.applyNET = function (sValue, aData) {

};

Analytics.prototype.applyContains = function (sValue, aData) {

};

Analytics.prototype._deepFilterData = function (cItem, aData) {
    var qvalue = {};

    for (var i = 0; i < aData.length; i++) {
        var row = aData[i];
        for (var m = 0; m < row.length; m++) {
            var cell = row[m];

            var bFinal = true;
            for (var c = 0; c < cItem.conditions.length; c++) {
                var cnd = cItem.conditions[c];
                switch (cnd.type) {
                    case "eq":
                        bFinal = bFinal && cell._v == cnd.value;
                        break;
                    case "nq":
                        bFinal = bFinal && cell._v != cnd.value;
                        break;
                    case "lt":
                        bFinal = bFinal && cell._v < cnd.value;
                        break;
                    case "gt":
                        bFinal = bFinal && cell._v > cnd.value;
                        break;
                    case "cnt":
                        bFinal = bFinal && cell._v.indexOf(cnd.value) > -1;
                        break;
                }
            }




            if (cell._i == cItem.field && bFinal) {

                if (!qvalue.hasOwnProperty(cell._v)) {
                    qvalue[cell._v] = 1;
                } else {
                    qvalue[cell._v] += 1;
                }
            }
        }
    }


    var result = {
        title: "",
        labels: Object.keys(qvalue),
        data: [],
        colors: [],
        total: 0,
        avg: 0,
        sum: 0
    };

    result.total = result.labels.length;

    for (var i = 0; i < result.labels.length; i++) {
        var skey = result.labels[i];
        result.data.push(qvalue[skey]);
        result.sum += qvalue[skey];
        result.colors.push("#" + Math.random().toString(16).slice(2, 8));
    }

    result.avg = result.sum / result.total;

    return result;

};
Analytics.prototype._filterData = function (oCharts, aData) {
    var finalResult = [];

    for (var i = 0; i < oCharts.length; i++) {
        var iChart = oCharts[i];
        var resChat = this._deepFilterData(iChart, aData);

        resChat.title = iChart.name;
        resChat.type = iChart.type;
        finalResult.push(resChat);
    }

    return finalResult;
};

Analytics.prototype.process = function (oRes) {

    var that = this;

    GLOBAL.db.findById(this.dbName + ".form_meta", this.formId, function (metaData) {
        if (!metaData) {
            oRes.json([]);
            return;
        }
        var aCharts = metaData.charts;

        GLOBAL.db.find(that.dbName + ".form_data", {meta_id: that.formId}, function (result) {
            var aData = result.map(function (v) {
                return v.data;
            });
            oRes.json(that._filterData(aCharts, aData));
        });
    });

};



module.exports = Analytics;