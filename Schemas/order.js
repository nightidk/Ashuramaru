const { model, Schema } = require("mongoose");

const orders = new Schema({
    id: {
        type: String,
        required: true,
    },
    customerID: {
        type: String,
        required: true,
    },
    techSpecifiaction: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    support: {
        type: Boolean,
        required: true,
    },
    designer: {
        type: Boolean,
        required: true,
    },
    designerTechSpecifiaction: {
        type: String,
        default: "Нет",
    },
    typeWork: {
        type: Number,
        required: true,
    },
});

module.exports = model("order", orders);
