var Schema = require('../Schema');


var GlobalConfig = Schema("message_queue", {
    from: {type: "string", value: ""},
    to: {type: "string", value: ""},
    message: {type: "string", value: ""},
    type: {type: "string", value: "SINGLE"},
    state: {type: "number", value: 0},
    time: {type: "string", value: Date.now}
});


GlobalConfig.methods({
});

module.exports = GlobalConfig;