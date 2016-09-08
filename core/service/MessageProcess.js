var gcm = require('node-gcm');

var MessageProcess = {
    onMessage: function (oPack,callback) {
        var sType = oPack.TYPE;
        switch (sType) {
            case "SINGLE_MESSAGE":
                this.singleForward(oPack.TO,oPack.FROM,oPack.MESSAGE,callback);
                break;
            case "FEED_MESSAGE":
                break;
        }
    },
    singleForward: function (to,from,msg,callback) {
        var message = new gcm.Message({
            data: msg,
            from:from
        });

        var sender = new gcm.Sender(this.client.system_key);
        var regTokens = [to];

        sender.send(message, {registrationTokens: regTokens}, function (err, response) {
            callback(err,response);
        });
    }
};



module.exports = MessageProcess;