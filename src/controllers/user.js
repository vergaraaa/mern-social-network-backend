const bcrypt = require('bcrypt');
const User = require('../models/User');

// test action
const testUser = (req, res) => {
    return res.status(200).send({
        message: "Message sent from controllers/user.js"
    });
};

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
    createUser,
}