const { Schema, model } = require("mongoose");

const userDB = new Schema({
    userID: { type: String, required: true },
    guildID: { type: String, required: true },
    balance: { type: Number, default: 0 },
});

module.exports = model("user", userDB);
