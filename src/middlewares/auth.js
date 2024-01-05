const moment = require('moment');
const jwt = require('jwt-simple');
const { KEY } = require("../services/jwt");

const validateToken = (req, res, next) => {
    var token = req.headers.authorization;

    if (!token) {
        return res.status(403).json({
            status: "failure",
            message: "Token not provided"
        });
    }
    // clean token
    token = token.replace(/['"]+/g, '');

    // decode token
    try {
        let payload = jwt.decode(token, KEY);

        // check token expiration
        if (payload.exp <= moment().unix()) {
            return res.status(401).json({
                status: "failure",
                message: "Expired token"
            });
        }

        req.user = payload;

        next();
    } catch (error) {
        return res.status(500).json({
            status: "failure",
            message: error.message
        });
    }
}

module.exports = {
    validateToken
}