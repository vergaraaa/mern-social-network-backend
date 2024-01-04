const express = require('express');
const router = express.Router();
const { testUser, login, createUser } = require("../controllers/user");

router.get("/test", testUser);

router.post("/login", login);

router.post("/register", createUser);

module.exports = router;