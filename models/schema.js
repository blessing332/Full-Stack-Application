const mongoose = require('mongoose')
const Schema = mongoose.Schema
const dateSchema = new Schema ({
    name: { type: String },
    occupation: { type: String },
    age: { type: Number },
    interests: String,
    race: { type: String },
    isInterested: Boolean,
}, { timestamps: true })
const Date = mongoose.model('Date', dateSchema)
module.exports = Date;
