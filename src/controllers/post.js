const fs = require('fs');
const path = require('path');
const Post = require("../models/Post");
const mongoosePagination = require('mongoose-pagination');

const followService = require("../services/followUserIds");

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
            user: req.user._id
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
            .populate("user", "-password -role -__v -email")
            .paginate(page, itemsPerPage);

        return res.status(200).json({
            status: "success",
            page,
            total,
            pages: Math.ceil(total / itemsPerPage),
            posts,
        });
    } catch (error) {
        return res.status(500).json({
            status: "failure",
            message: error.message
        });
    }
}

const uploadPostImage = async (req, res) => {
    try {
        let postId = req.params.id;
        let file = req.file;

        // validate existence file 
        if (!file) {
            return res.status(422).json({
                status: "failure",
                message: "Image not provided",
            });
        }

        // get filename
        let image = file.originalname;

        // get file extension
        const imageSplit = image.split("\.");
        const extension = imageSplit[1].toLowerCase();

        // validate extension
        if (extension != "png" && extension != "jpg" &&
            extension != "jpeg" && extension != "gif") {

            // delete file if not valid
            return fs.unlink(req.file.path, (error) => {
                if (error) throw error;

                return res.status(422).json({
                    status: "failure",
                    msg: "Invalid image format"
                });
            });
        }

        let postUpdated = await Post.findOneAndUpdate(
            { user: req.user.id, _id: postId },
            { file: req.file.filename },
            { new: true }
        );

        if (!postUpdated) {
            return fs.unlink(req.file.path, (error) => {
                return res.status(404).json({
                    status: "failure",
                    msg: "Post doesnt exist"
                });
            });
        }

        return res.status(200).json({
            status: "success",
            user: postUpdated,
            file: req.file,
        });
    } catch (error) {
        return res.status(500).json({
            status: "failure",
            message: error.message
        });
    }
}

const getImage = async (req, res) => {
    try {
        // get url param
        let { file } = req.params;

        // create path
        const filePath = "./src/uploads/posts/" + file;

        // validate file existence
        fs.stat(filePath, (error, exists) => {
            if (!exists) {
                return res.status(404).json({
                    status: "failure",
                    msg: "Image not found",
                    file,
                    filePath,
                });
            }

            return res.sendFile(path.resolve(filePath));
        });
    } catch (error) {
        return res.status(500).json({
            status: "failure",
            message: error.message
        });
    }
}

const getFeed = async (req, res) => {
    try {
        // get page
        let page = req.params.page ? parseInt(req.params.page) : 1

        const itemsPerPage = 5;

        // get following
        const { following } = await followService.followUserIds(req.user._id);

        const total = await Post.find({ user: { $in: following } }).countDocuments();

        // get posts
        const posts = await Post
            .find({ user: { $in: following } })
            .populate("user", "-__v -password -role -email")
            .sort("-created_at")
            .paginate(page, itemsPerPage);

        return res.status(200).json({
            status: "success",
            total,
            page,
            pages: Math.ceil(total / itemsPerPage),
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
    uploadPostImage,
    getImage,
    getFeed,
}