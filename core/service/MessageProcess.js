var gcm = require('node-gcm');

var MessageProcess = {
    setSystemKey: function (sysKey, db, dbname) {
        this.SystemKey = sysKey;
        this.db = db;
        this.dbname = dbname;
    },
    onMessage: function (oPack, callback) {
        var sType = oPack.TYPE;
        switch (sType) {
            case "SINGLE_MESSAGE":
                this.singleForward(oPack.TO, oPack.TOKEN, oPack.MESSAGE, callback);
                break;
            case "FEED_MESSAGE":
                break;
            default:
                callback("Invalid packet", null);
        }
    },
    singleForwardToWeb: function () {

    },
    singleForward: function (to, from, msg, callback) {
        var that = this;
        this.db.findById(this.dbname + ".accounts", to, function (user) {
            if (user) {
                if (user.cgm_token) {
                    var message = new gcm.Message({
                        data: {message1: msg, from1: from, event: 'USER_EVENT', action: 'USER_MESSAGE'}
                    });

                    var sender = new gcm.Sender(that.SystemKey);

                    sender.send(message, {registrationTokens: [user.cgm_token]}, function (err, response) {
                        callback(err, response);
                    });
                } else {
                    if (!user.inbox)
                        user.inbox = [];
                    user.inbox.push({
                        from: from,
                        message: msg,
                        read: false,
                        time: Date.now()
                    });
                    this.db.updateById(that.dbname + ".accounts", user._id.toString(), user, function (rrr) {
                        callback(null, rrr);
                        that.singleForwardToWeb();
                    });
                }
            } else {
                callback("Not found", null);
            }
        });



    }
};



module.exports = MessageProcess;