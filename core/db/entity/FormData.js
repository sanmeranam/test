var Schema = require('../Schema');


var FormData = Schema("form_data", {
    internal_id: {type: "string", value: ""},
    meta_id: {type: "string", value: ""},
    form_name: {type: "string", value: "The Form"},
    create_date: {type: "string", value: ""},
    version: {type: "number", value: 1},
    model: {},
    stage_history: [],
    next_stage: {type: "object", value: null},
    current_action: {},
    flow: {},
    data: []
});


FormData.methods({
});

module.exports = FormData;