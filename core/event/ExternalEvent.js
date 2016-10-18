var cServerEvent = require('sse');
var GLOBAL = require('../GLOBAL');

var ExternalEvent = function (httpApi) {
    this.sse = new cServerEvent(httpApi, {
        path: '/heartbeat',
        verifyRequest: this.verifyRequest
    });
    this.sse.on('connection', this.onConnection);
};

ExternalEvent.prototype.verifyRequest = function () {
    return true;
};

ExternalEvent.prototype.onConnection = function (client) {
    var cookie = client.req.headers.cookie;
    var sesion = cookie.replace("connect.sid=s%3A", "");
    var sKey = sesion.split(".")[0];

    GLOBAL.web_sessions[sKey] = client;

    GLOBAL.db.find('c4f_master.sessions', {_id: sKey}, function (oResult) {
        oResult = oResult && oResult.length ? oResult[0] : null;

        if (oResult && oResult.session) {
            var oUser = JSON.parse(oResult.session).user;

            GLOBAL.db.findById(oUser.tenant.dbname + ".accounts", oUser._id, function (user) {
                if (user) {
                    user.web_token = sKey;
                    GLOBAL.db.updateById(oUser.tenant.dbname + ".accounts", user._id, user, function () {
                        console.log("Session = updated.");
                    });
                }
            });
        }
    });


    client.send(JSON.stringify({
        event: 'SYS_EVENT', action: 'CONNECTED'
    }));
};


module.exports = ExternalEvent;