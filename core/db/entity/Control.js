var Schema = require('../Schema');


var Control = Schema("Control", {
    node: {type: "string", value: ""},
    type: {type: "string", value: "field"},
    iformat: {type: "string", value: "control_{1}"},
    properties: {
        name: {
            t:"",
            v:"",
            list:"",
            source:""
        }
    },
    icon: {type: "string", value: "<i class='fa fa-caret-square-o-down'></i>"}
});


Control.methods({
});

module.exports = Control;