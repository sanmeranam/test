var cServerEvent = require('sse');

var ExternalEvent = function (httpApi) {
    this.sse = new cServerEvent(httpApi, {
        path: '/heartbeat',
        verifyRequest: this.verifyRequest
    });    
};

ExternalEvent.prototype.verifyRequest = function () {
    return true;
};


module.exports = ExternalEvent;