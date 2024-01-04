const express = require('express');
const router = express.Router();
const { testUser, createUser } = require("../controllers/user");

router.get("/test", testUser);

router.route("/")
    .post(createUser);

module.exports = router;