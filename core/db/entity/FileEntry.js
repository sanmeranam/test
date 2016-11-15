var Schema = require('../Schema');


var FileEntry = Schema("file_entry", {
    name: {type: "string", value: ""},
    path: {type: "string", value: ""},
    field: {type: "string", value: ""},
    create: {type: "string", value: ""},
    mime: {type: "string", value: ""},
    params: {
        field_id: {type: "string", value: ""},
        field_type: {type: "string", value: ""},
        temp_form_id: {type: "string", value: ""}
    }
});


FileEntry.methods({
});

module.exports = FileEntry;