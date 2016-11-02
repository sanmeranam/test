var GLOBAL = require('../../../core/GLOBAL');
var Defer = require('./defer');

var Dashboard = {
    data: function (dbName, res) {
        this.dbName = dbName;

        var df = new Defer();

        df.finish(function (result) {
            res.json(result);
        });


        GLOBAL.db.find(dbName + ".form_meta", {}, df.add('form_length', function (result) {
            return result.length;
        }));
        GLOBAL.db.find(dbName + ".accounts", {}, df.add('user_length', function (result) {
            return result.length;
        }));
        GLOBAL.db.find(dbName + ".global_config", {key: 'user_group'}, df.add('user_group_length', function (result) {
            return result.length;
        }));

        GLOBAL.db.find(dbName + ".device_access", {}, df.add('app_active', function (result) {
            return result.length;
        }));

        GLOBAL.db.find("tenant_master", {database: dbName}, df.add('app_code', function (result) {
            if (result && result.length) {
                return result[0]._id;
            }
            return "";
        }));

        GLOBAL.db.find(dbName + ".form_data", {}, df.add('form_data', function (result) {
            var oRes = {length: result.length};

            var data = {};
            var locations = [];
            if (result && result.length) {

                result = result.map(function (v) {
                    var name = v.form_name.split(" ").join("_");

                    data[name] = data[name] || {daily: {}};

                    var date = (new Date(v.create_date)).toString();
                    
                    
                    var m = date.split(" ");
                    var key = m[1] + " " + m[2] + " " + m[3];

                    if (!data[name].daily[key]) {
                        data[name].daily[key] = 0;
                    }
                    data[name].daily[key] += 1;

                    for (var m in v.stage_history) {
                        var his = v.stage_history[m];
                        if (his.lat && his.lng) {
                            locations.push({
                                lt: his.lat,
                                lg: his.lng,
                                u: his.user,
                                i: v._id,
                                n: v.form_name
                            });
                            break;
                        }
                    }

                    return v;
                });
            }
            oRes.usage = data;
            oRes.markers = locations;

            return oRes;
        }));

    }
};
module.exports = Dashboard;
