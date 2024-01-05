const express = require('express');
const router = express.Router();
const { testUser, login, createUser } = require("../controllers/user");
const { validateToken } = require('../middlewares/auth');

router.get("/test", validateToken, testUser);

router.post("/login", login);

router.post("/register", createUser);

module.exports = router;