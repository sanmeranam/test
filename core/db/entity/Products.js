var Schema = require('../Schema');


var Products = Schema("product_master", {
    name: {type: "string", value: ""},
    code: {type: "string", value: ""},
    images: [],
    description: {type: "string", value: ""},
    stock: {type: "number", value: 0},
    price: {type: "number", value: 0},
    discount: {
        percent: {type: "number", value: 0},
        from: {type: "string", value: ""},
        to: {type: "string", value: ""}
    },
    tax: {
        percent: {type: "number", value: 0},
        type: {type: "string", value: ""}
    }
});


Products.methods({
});

module.exports = Products;