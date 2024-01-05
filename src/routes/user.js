const express = require('express');
const router = express.Router();
const { testUser, login, createUser, getUser, getUsers } = require("../controllers/user");
const { validateToken } = require('../middlewares/auth');

router.get("/test", validateToken, testUser);

router.post("/login", login);

router.post("/register", createUser);

router.get("/list/:page?", validateToken, getUsers)

router.get("/:id", validateToken, getUser);



module.exports = router;