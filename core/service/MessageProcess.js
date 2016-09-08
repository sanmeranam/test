var gcm = require('node-gcm');

var MessageProcess = {
    setSystemKey:function(sysKey){
        this.SystemKey=sysKey;
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
                callback("Invalid packet",null);
        }
    },
    singleForward: function (to, from, msg, callback) {
        var message = new gcm.Message({
            data:{message1:msg,from1:from}
        });

        var sender = new gcm.Sender(this.SystemKey);
        var regTokens = [];
        regTokens.push(to);

        sender.send(message, {registrationTokens: regTokens}, function (err, response) {
            callback(err, response);
        });
    }
};



module.exports = MessageProcess;