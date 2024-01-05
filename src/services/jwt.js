const moment = require('moment');
const jwt = require('jwt-simple');

// SECRET KEY
const KEY = "asdfghjkl";

const generateToken = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix(),
    }

    return jwt.encode(payload, KEY);
}

module.exports = {
    KEY,
    generateToken,
}