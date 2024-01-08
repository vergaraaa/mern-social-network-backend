const { Router } = require("express");
const router = Router();
const { createPost, deletePost } = require("../controllers/post");
const { validateToken } = require('../middlewares/auth');

router.post("/create", validateToken, createPost);

router.delete("/delete/:id", validateToken, deletePost);


module.exports = router;