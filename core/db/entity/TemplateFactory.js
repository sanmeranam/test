var Schema = require('../Schema');


var TemplateFactory = Schema("template_factory", {
    name: {type: "string", value: ""},
    type: {type: "string", value: ""},
    form_id: {type: "string", value: ""},
    body: {type: "string", value: ""}
});


TemplateFactory.methods({
});

module.exports = TemplateFactory;