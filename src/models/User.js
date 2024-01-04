const { Schema, model } = require("mongoose");

const UserSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        default: "role_user",
    },
    image: {
        type: String,
        default: "default.png",
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = model("User", UserSchema);