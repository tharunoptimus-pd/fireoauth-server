const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const APISchema = new Schema({

	domainName: { type: String, required: true },
	transactionNumbers: { type: Number, default: 0 }

}, { timestamps: true });

let API = mongoose.model('API', APISchema)
module.exports = API;