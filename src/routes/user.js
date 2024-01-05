const express = require('express');
const router = express.Router();
const { testUser, login, createUser, getUser, getUsers, updateUser } = require("../controllers/user");
const { validateToken } = require('../middlewares/auth');

router.get("/test", validateToken, testUser);

router.post("/login", login);

router.post("/register", createUser);

router.get("/list/:page?", validateToken, getUsers)

router.route("/:id")
    .get(validateToken, getUser)
    .put(validateToken, updateUser);


module.exports = router;