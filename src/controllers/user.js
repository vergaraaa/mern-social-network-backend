const express = require('express');

// test action
const testUser = (req, res) => {
    return res.status(200).send({
        message: "Message sent from controllers/user.js"
    });
};


// export actions
module.exports = {
    testUser
}