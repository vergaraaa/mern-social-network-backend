const moment = require('moment');
const jwt = require('jwt-simple');

// SECRET KEY
const KEY = "asdfghjkl";

const generateToken = (user) => {
    const payload = {
        ...user,
        iat: moment().unix(),
        exp: moment().add(30, "days"),
    }

    return jwt.encode(payload, KEY);
}

module.exports = {
    generateToken,
}