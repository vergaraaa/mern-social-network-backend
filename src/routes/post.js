const { Router } = require("express");
const router = Router();
const multer = require('multer');
const { createPost, deletePost, getUserPosts, uploadPostImage, getImage, getFeed } = require("../controllers/post");
const { validateToken } = require('../middlewares/auth');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./src/uploads/posts");
    },
    filename: (req, file, cb) => {
        cb(null, "post-" + Date.now() + "-" + file.originalname);
    },
});

const uploads = multer({ storage });

router.post("/create", validateToken, createPost);

router.delete("/delete/:id", validateToken, deletePost);

router.get("/user/:id/:page?", validateToken, getUserPosts);

router.post("/upload-image/:id", [
    validateToken, uploads.single("file"),
], uploadPostImage);

router.get("/image/:file", getImage);

router.get("/feed/:page?", validateToken, getFeed);

module.exports = router;