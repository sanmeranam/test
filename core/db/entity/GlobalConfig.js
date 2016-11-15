var Schema = require('../Schema');


var GlobalConfig = Schema("global_config", {
    key: {type: "string", value: ""},
    scope: {type: "string", value: "GLOBAL"},
    value: {}
});


GlobalConfig.methods({
});

module.exports = GlobalConfig;