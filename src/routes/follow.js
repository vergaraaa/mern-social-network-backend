const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/auth');
const { saveFollow, deleteFollow } = require('../controllers/follow');

router.post("/save", validateToken, saveFollow);

router.delete("/unfollow/:id", validateToken, deleteFollow);


module.exports = router;