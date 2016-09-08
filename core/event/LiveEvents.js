var Client = require('node-xmpp-client');
var gcm = require('node-gcm');


var LiveEvents = function (oConfig) {
    this.isOnline = false;
    this.config = oConfig;

    this.client = new Client({
        type: 'client',
        jid: oConfig.jid,
        password: oConfig.system_key,
        host: oConfig.host,
        port: oConfig.port,
        legacySSL: true,
        preferred: 'PLAIN'
    });

    this.client.connection.socket.setTimeout(0);
    this.client.connection.socket.setKeepAlive(true, 10000);

    var that = this;

    this.client.on('online', function () {
        that.isOnline = true;
    });

    this.client.on('error', function (e) {
        that.isOnline = false;
    });

    this.client.on('offline', function () {
        that.isOnline = false;
    });

    this.client.on('stanza', function (stanza) {
        that.onAfterMessage(stanza);
    });
};

LiveEvents.prototype.onAfterMessage = function (stanza) {
    console.log("MGS=" + stanza);
};

LiveEvents.prototype.sendMessage = function (oData, to, callback) {
    var message = new gcm.Message({
        data: oData
    });

    var sender = new gcm.Sender(this.client.system_key);
    var regTokens = to.split(";");

    sender.send(message, {registrationTokens: regTokens}, function (err, response) {
        if (callback && typeof (callback) === "function") {
            callback(err, response);
        }
    });

};


module.exports = LiveEvents;