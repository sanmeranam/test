var gcm = require('node-gcm');
var GLOBAL = require('../GLOBAL');

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
                this.singleForward(oPack.TO, oPack.FROM, oPack.MESSAGE, callback);
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
        var oMessagePack = {
            from: from,
            to: to,
            message: msg,
            type: "SINGLE",
            state: 1, //1-new,2-sent,3-faild,
            time: Date.now()
        };
        var that = this;

        //Save to db first
        this.db.insertToTable(this.dbname + ".message_queue", oMessagePack, function (mResult) {
            var oMessage = mResult.ops[0];

            MessageProcess._getuserDeviceToken(to, function (gToken, wToken) {
                
                if (gToken) {
                    var message = new gcm.Message({
                        data: {message1: msg, from1: from, event: 'USER_EVENT', action: 'USER_MESSAGE'}
                    });
                    var sender = new gcm.Sender(that.SystemKey);
                    sender.send(message, {registrationTokens: [gToken]}, function (err, response) {
                        callback(err, response);
                        oMessage.state = err ? 1 : 2;
                        that.db.updateById(that.dbname + ".message_queue", oMessage._id, oMessage, function (rrr) {});
                    });
                }
                if(wToken) {
                    if (GLOBAL.web_sessions && GLOBAL.web_sessions[wToken]) {
                        GLOBAL.web_sessions[wToken].send(JSON.stringify({message: msg, from: from, event: 'USER_EVENT', action: 'USER_MESSAGE'}));
                    }
                } else {
                    callback("Device not available.", null);
                }
            });
        });
    },
    _getuserDeviceToken: function (sId, callback) {
        this.db.findById(this.dbname + ".accounts", sId, function (user) {
            if (user && user.cgm_token) {
                callback(user.cgm_token,null);
            } else  if (user && user.web_token){
                callback(null, user.web_token);
            }else{
                callback(null,null);
            }
        });
    }
};



module.exports = MessageProcess;