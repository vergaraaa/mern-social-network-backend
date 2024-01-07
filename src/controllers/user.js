const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateToken } = require('../services/jwt.js');
const mongoosePagination = require('mongoose-pagination');
const followService = require("../services/followUserIds.js");


// test action
const testUser = (req, res) => {
    return res.status(200).send({
        message: "Message sent from controllers/user.js",
        user: req.user,
    });
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: "failure",
                message: "Missing data"
            });
        }

        // validate if user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                status: "failure",
                message: "User not found",
            });
        }

        // match password
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({
                status: "failure",
                message: "Incorrect credentials"
            });
        }

        // token
        const token = generateToken(user);

        return res.status(200).json({
            status: "success",
            user: user,
            token
        });
    } catch (error) {
        return res.status(500).json({
            status: "failure",
            message: error.message
        });
    }
}

const createUser = async (req, res) => {
    try {
        // get body of request
        let body = req.body;

        // validation
        if (!body.name || !body.email || !body.password || !body.username) {
            return res.status(400).json({
                status: "failure",
                message: "Missing data"
            });
        }

        const users = await User.find({
            $or: [
                { email: body.email.toLowerCase() },
                { username: body.username.toLowerCase() },
            ]
        })

        if (users.length > 0) {
            return res.status(409).json({
                status: "failure",
                message: "Email or username already exists"
            });
        }

        // encrypt password
        const hashedPassword = await bcrypt.hash(body.password, 10);
        body.password = hashedPassword;

        // create user
        const newUser = User(req.body);

        // save user
        await newUser.save();

        // response
        return res.status(200).json({
            status: "success",
            user: newUser
        });
    } catch (error) {
        return res.status(500).json({
            status: "failure",
            message: error.message
        });
    }
};

const getUser = async (req, res) => {
    let { id } = req.params;

    try {
        const user = await User.findById(id).select({ role: 0 });

        if (!user) {
            return res.status(404).json({
                status: "failure",
                message: "User not found",
            });
        }

        // following info
        const followInfo = await followService.followThisUser(req.user.id, id);

        return res.status(200).json({
            status: "success",
            user,
            following: followInfo.following ?? {},
            follower: followInfo.follower ?? {},
        });
    } catch (error) {
        return res.status(500).json({
            status: "failure",
            message: error.message
        });
    }
}

const getUsers = async (req, res) => {
    try {

        let page = !req.params.page ? 1 : parseInt(req.params.page);

        let itemsPerPage = 5;

        const total = await User.countDocuments({});
        const users = await User.find().sort("_id").paginate(page, itemsPerPage);

        return res.status(200).json({
            status: "success",
            page,
            users,
            itemsPerPage,
            total,
            pages: Math.ceil(total / itemsPerPage),
        });
    } catch (error) {
        return res.status(500).json({
            status: "failure",
            message: error.message
        });
    }
}

const updateUser = async (req, res) => {
    try {
        let { exp, iat, role, image, ...userIdentity } = req.user;
        let userToUpdate = req.body;

        // check if email is taken
        let user = await User.findOne({ email: userToUpdate.email });

        if (user && user._id != userIdentity.id) {
            return res.status(409).json({
                status: "failure",
                message: "Email already exists"
            });
        }

        // check if username is taken
        user = await User.findOne({ username: userToUpdate.username });

        if (user) {
            return res.status(409).json({
                status: "failure",
                message: "Username already exists"
            });
        }

        // if password exists encrypt it
        if (userToUpdate.password) {
            const hashedPassword = await bcrypt.hash(userToUpdate.password, 10)
            userToUpdate.password = hashedPassword;
        }

        // update
        const updatedUser = await User.findByIdAndUpdate(userIdentity.id, userToUpdate, { new: true });

        return res.status(200).json({
            status: "success",
            user: updatedUser,
        });

    } catch (error) {
        return res.status(500).json({
            status: "failure",
            message: error.message
        });
    }
}

const uploadImage = async (req, res) => {
    try {
        let file = req.file;

        // validate existence file 
        if (!file) {
            return res.status(409).json({
                status: "failure",
                message: "Image not provided",
            });
        }

        // get filename
        let image = file.originalname;

        // get file extension
        const imageSplit = image.split("\.");
        const extension = imageSplit[1].toLowerCase();

        console.log(extension);

        // validate extension
        if (extension != "png" && extension != "jpg" &&
            extension != "jpeg" && extension != "gif") {

            // delete file if not valid
            fs.unlink(req.file.path, (error) => {
                return res.status(409).json({
                    status: "failure",
                    msg: "Invalid image format"
                });
            })
        }
        else {
            let userUpdated = await User.findOneAndUpdate(
                { _id: req.user.id },
                { image: req.file.filename },
                { new: true }
            );

            return res.status(200).json({
                status: "success",
                user: userUpdated,
                file: req.file,
            });
        }
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
        const filePath = "./src/uploads/avatars/" + file;

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

module.exports = {
    testUser,
    login,
    createUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImage,
}