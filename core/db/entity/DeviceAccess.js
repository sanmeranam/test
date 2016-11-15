var Schema = require('../Schema');


var DeviceAccess = Schema("device_access", {
    DEVICE_ID: {type: "string", value: ""},
    SCAN_ID: {type: "string", value: ""},
    DEVICE_MODEL: {type: "string", value: ""},
    DEVICE_SCREEN: {type: "string", value: ""},
    IN_DATE: {type: "string", value: ""},
    IN_USER: {type: "string", value: ""},
    LOCATION: {}
});


DeviceAccess.methods({
});

module.exports = DeviceAccess;