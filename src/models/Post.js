const { Schema, model } = require("mongoose");

const PostSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: "User"
    },
    text: {
        type: String,
        required: true,
    },
    file: {
        type: String,
    },
    created_at: {
        type: String,
        default: Date.now,
    },
});

PostSchema.method('toJSON', function () {
    const { __v, _id, ...post } = this.toObject();
    post.id = _id;

    return post;
});

module.exports = model("Post", PostSchema);