const { Router } = require("express");
const router = Router();
const { createPost } = require("../controllers/post");
const { validateToken } = require('../middlewares/auth');

router.post("/create", validateToken, createPost);


module.exports = router;