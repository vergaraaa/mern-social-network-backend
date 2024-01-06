const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateToken } = require('../services/jwt.js');
const mongoosePagination = require('mongoose-pagination');

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

        return res.status(200).json({
            status: "success",
            user
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
        return res.status(200).json({
            status: "success",
            file: req.file,
            files: req.files,
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
    uploadImage
}