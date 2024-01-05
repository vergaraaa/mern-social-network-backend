const { Schema, model } = require("mongoose");

const UserSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
    },
    bio: {
        type: String,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
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

UserSchema.method('toJSON', function () {
    // before object are the fields that i dont want to return
    // in user is stored the fields that i want to return
    const { __v, _id, password, ...user } = this.toObject();
    user.id = _id;

    return user;
});

module.exports = model("User", UserSchema);