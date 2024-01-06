const express = require('express');
const router = express.Router();
const multer = require('multer');
const { validateToken } = require('../middlewares/auth');
const { testUser, login, createUser, getUser, getUsers, updateUser, uploadImage } = require("../controllers/user");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./src/uploads/avatars");
    },
    filename: (req, file, cb) => {
        cb(null, "avatar-" + Date.now() + "-" + file.originalname);
    },
});

const uploads = multer({ storage });

router.get("/test", validateToken, testUser);

router.post("/login", login);

router.post("/register", createUser);

router.get("/list/:page?", validateToken, getUsers)

router.route("/:id")
    .get(validateToken, getUser)
    .put(validateToken, updateUser);

router.post("/upload-image", [uploads.single("file"), validateToken], uploadImage);


module.exports = router;