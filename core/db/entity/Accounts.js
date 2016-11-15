var Schema = require('../Schema');


var Accounts = Schema("accounts", {
    first_name: {type: "string", value: ""},
    last_name: {type: "string", value: ""},
    email: {type: "string", value: ""},
    secret: {type: "string", value: ""},
    profile: {type: "string", value: ""},
    cgm_token: {type: "string", value: ""},
    web_token: {type: "string", value: ""},
    group: {type: "string", value: ""},
    admin: {type: "boolean", value: false}
});


Accounts.methods({
    getForSession: function () {
        return {
            _id: this._._id,
            first_name: this._.first_name,
            last_name: this._.last_name,
            email: this._.email,
            admin: this._.admin,
            group: this._.group
        };
    }
});

module.exports = Accounts;