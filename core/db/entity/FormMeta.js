var Schema = require('../Schema');


var FormMeta = Schema("form_meta", {
    form_name: {type: "string", value: ""},
    display_title: {type: "string", value: ""},
    version: {type: "number", value: 1},
    flow: {},
    model_view: {},
    charts: [],
    config: {},
    history: {
        created: {
            date: {type: "string", value: Date.now},
            user_id: {type: "string", value: ""},
            user: {type: "string", value: ""}
        },
        modified: []
    }
});


FormMeta.methods({
   
});

module.exports = FormMeta;
