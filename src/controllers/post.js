const Post = require("../models/Post");
const mongoosePagination = require('mongoose-pagination');
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

const getUserPosts = async (req, res) => {
    try {
        const userId = req.params.id;

        let page = req.params.page ? parseInt(req.params.page) : 1

        const itemsPerPage = 5;

        const total = await Post.countDocuments({ user: userId });

        const posts = await Post
            .find({ user: userId })
            .sort("-created_at")
            .populate("user", "-password -role -__v")
            .paginate(page, itemsPerPage);

        return res.status(200).json({
            status: "success",
            page,
            total: Math.ceil(total / itemsPerPage),
            posts,
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
    getUserPosts,
}