var Schema = require('../Schema');


var FlowFactory = Schema("flow_factory", {
    _t: {type: "string", value: ""},
    _n: {type: "number", value: 1},
    _s: {type: "number", value: 0},
    _a: [],
    _f: {}
});


FlowFactory.methods({
});

module.exports = FlowFactory;