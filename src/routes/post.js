const { Router } = require("express");
const router = Router();
const { createPost, deletePost, getUserPosts } = require("../controllers/post");
const { validateToken } = require('../middlewares/auth');

router.post("/create", validateToken, createPost);

router.delete("/delete/:id", validateToken, deletePost);

router.get("/user/:id/:page?", validateToken, getUserPosts);


module.exports = router;