const { Schema, model } = require("mongoose");

const guild = new Schema({
    guildID: { type: String, requried: true },
    language: {
        type: String,
        required: true,
    },
    prefix: {
        type: String,
        default: ".",
    },
});

module.exports = model("guild", guild);
