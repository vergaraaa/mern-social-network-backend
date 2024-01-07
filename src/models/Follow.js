const { Schema, model } = require("mongoose");

const FollowSchema = Schema({
    user: {
        type: Schema.ObjectId,
        ref: "User",
        required: true,
    },
    followed: {
        type: Schema.ObjectId,
        ref: "User",
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

FollowSchema.method('toJSON', function () {
    // before object are the fields that i dont want to return
    // in user is stored the fields that i want to return
    const { __v, _id, ...follow } = this.toObject();
    follow.id = _id;

    return follow;
});

module.exports = model("Follow", FollowSchema);