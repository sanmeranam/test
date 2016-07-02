var Structure = {
    form_meta_flow: {
        user_group: "",
        stage: 0,
        name: "",
        next: []
    },
    form_meta: {
        "form_name": "",
        "flow": {},
        "meta": {},
        "config": {
            "logo": ""
        },
        "history": {
            "created": {
                "date": 1466958465028,
                "user": ""
            },
            "modified": []
        },
        "current_state": 0
    },
    account_user: {
        first_name: "",
        last_name: "",
        email: "",
        secret: "",
        contact: "",
        inbox: []
    },
    account_user_group: {
        access_admin: true,
        access_user: true,
        access_setting: true,
        access_meta: true,
        access_billing: true,
        users: []
    },
    account_history_entry: {
        location: "",
        date: "",
        user: "",
        action: ""
    },
    account: {
        account_id: "",
        logo: "",
        state: 0,
        address: {
            org: "",
            address1: "",
            address2: "",
            state: "",
            country: "",
            contact1: "",
            contact2: ""
        },
        history: {
            created: {},
            modified: []
        },
        user_group: {},
        verification: {
            address: false,
            super_admin: false,
            payment: false,
            billing: false
        },
        billing: {
        }
    }
};

module.exports = {
    createFormMeta: function (oDefaultData) {
        var oData = JSON.parse(JSON.stringify(Structure.form_meta));
        return Object.assign(oData, oDefaultData);
    }
};