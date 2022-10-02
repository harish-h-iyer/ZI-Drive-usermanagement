const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true,
        unique: true
    },
    firstName : {
        type: String
    },
    lastName : {
        type: String
    },
    phoneNumber : {
        type: String
    },
    gender : {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    created_at: {
        type: Date
    }
});

module.exports = mongoose.model("users", userSchema, "users");