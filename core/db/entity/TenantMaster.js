var Schema = require('../Schema');


var TenantMaster = Schema("tenant_master", {
    domain: {type: "string", value: ""},
    database: {type: "string", value: ""},
    base: {
        url: {type: "string", value: "/"},
        api: {type: "string", value: "/api"}
    },
    branding: {
        name: {type: "string", value: ""},
        theme: {},
        logo: {type: "string", value: ""}
    },
    version: {type: "numnber", value: 1},
    setting: {
        notif: {type: "boolean", value: true},
        chat: {type: "boolean", value: true},
        track: {type: "boolean", value: true},
        products: {type: "boolean", value: true}
    },
    isnew: {type: "boolean", value: true},
    active: {type: "boolean", value: true},
    verified: {type: "boolean", value: false},
    admin: {
        source: {type: "string", value: ""},
        email: {type: "string", value: ""}
    },
    org: {
        name: {type: "string", value: ""},
        addess: {type: "string", value: ""}
    }

});


TenantMaster.methods({
});

module.exports = TenantMaster;