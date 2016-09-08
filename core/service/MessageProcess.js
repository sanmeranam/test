var gcm = require('node-gcm');

var MessageProcess = {
    onMessage: function (oPack) {
        var sType = oPack.TYPE;
        switch (sType) {
            case "SINGLE_MESSAGE":
                this.singleForward(oPack.TO,oPack.MESSAGE);
                break;
            case "FEED_MESSAGE":
                break;
        }
    },
    singleForward: function (to, msg) {
        var message = new gcm.Message({
            data: msg
        });

        var sender = new gcm.Sender(this.client.system_key);
        var regTokens = [to];

        sender.send(message, {registrationTokens: regTokens}, function (err, response) {
            
        });
    }
};



module.exports = MessageProcess;