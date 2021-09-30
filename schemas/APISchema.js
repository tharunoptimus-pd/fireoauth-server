const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const APISchema = new Schema({

	domainName: { type: String, required: true },
	needFirstName: { type: Boolean, default: false },
	needLastName: { type: Boolean, default: false },
	needEmail: { type: Boolean, default: false },
	needProfilePic: { type: Boolean, default: false },
	requestedTransactions: { type: Number, default: 0 },
	transactionNumbers: { type: Number, default: 0 }

}, { timestamps: true });

let API = mongoose.model('API', APISchema)
module.exports = API;