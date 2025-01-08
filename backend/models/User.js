const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    hobbies: { type: [String], required: true },
    country: { type: String, required: true },
    interests: { type: [String], required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;