const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ClientSchema = new Schema({
	firstName: { type: String, required: true, trim: true },
	lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String },
    apis : [{ type: Schema.Types.ObjectId, ref: 'API' }],
    
}, { timestamps: true });

let Client = mongoose.model('Client', ClientSchema)
module.exports = Client;