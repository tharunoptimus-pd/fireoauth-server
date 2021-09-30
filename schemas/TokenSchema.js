const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TokenSchema = new Schema({
	sessionId: { type: String, required: true },
	firstName: { type: String, trim: true },
	lastName: { type: String, trim: true },
    email: { type: String, trim: true },
    profilePic: { type: String }
}, { timestamps: true });

let Token = mongoose.model('Token', TokenSchema)
module.exports = Token;