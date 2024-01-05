const express = require('express');
const router = express.Router();
const { testUser, login, createUser, getUser } = require("../controllers/user");
const { validateToken } = require('../middlewares/auth');

router.get("/test", validateToken, testUser);

router.post("/login", login);

router.post("/register", createUser);

router.route("/:id")
    .get(validateToken, getUser);


module.exports = router;