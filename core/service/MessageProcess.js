var gcm = require('node-gcm');

var MessageProcess = {
    onMessage: function (oPack) {
        var sType = oPack.TYPE;
        switch (sType) {
            case "SINGLE_MESSAGE":
                this.singleForward(oPack.TO,oPack.FROM,oPack.MESSAGE);
                break;
            case "FEED_MESSAGE":
                break;
        }
    },
    singleForward: function (to,from,msg) {
        var message = new gcm.Message({
            data: msg,
            from:from
        });

        var sender = new gcm.Sender(this.client.system_key);
        var regTokens = [to];

        sender.send(message, {registrationTokens: regTokens}, function (err, response) {
            
        });
    }
};



module.exports = MessageProcess;