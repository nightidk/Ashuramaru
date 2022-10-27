const { model, Schema } = require("mongoose");

const bans = new Schema({});

module.exports = model("ban", bans);
