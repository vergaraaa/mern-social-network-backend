const Post = require("../models/Post");

const createPost = async (req, res) => {
    try {
        const body = req.body;

        if (!body.text) {
            return res.status(422).json({
                status: "failure",
                message: "Missing data"
            });
        }

        // create new post
        let newPost = Post(body);
        newPost.user = req.user.id;

        await newPost.save();

        return res.status(200).json({
            status: "success",
            post: newPost
        });
    } catch (error) {
        return res.status(500).json({
            status: "failure",
            message: error.message
        });
    }
}

const deletePost = async (req, res) => {
    try {
        let { id } = req.params;

        const post = await Post.findOneAndDelete({
            _id: id,
            user: req.user.id
        });

        if (!post) {
            return res.status(404).json({
                status: "failure",
                message: "This post doesnt exist"
            });
        }

        return res.status(200).json({
            status: "success",
            post,
        });
    } catch (error) {
        return res.status(500).json({
            status: "failure",
            message: error.message
        });
    }
}

module.exports = {
    createPost,
    deletePost,
}