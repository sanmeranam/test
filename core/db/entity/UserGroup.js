var Schema = require('../Schema');


var UserGroup = Schema("user_group", {
    name: {type: "string", value: ""},
    users: [],
    role: {
    }
});


UserGroup.methods({
    addUser: function (user) {
        if (user && user._id) {
            this.users = this.users || [];
            this.users.push(user._id);
        }
    }
});

module.exports = UserGroup;