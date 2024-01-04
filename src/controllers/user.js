const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateToken } = require('../services/jwt.js');
// test action
const testUser = (req, res) => {
    return res.status(200).send({
        message: "Message sent from controllers/user.js"
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: "failure",
            message: "Missing data"
        });
    }

    // validate user exists
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


module.exports = {
    testUser,
    login,
    createUser,
}