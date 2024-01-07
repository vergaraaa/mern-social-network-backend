const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/auth');
const { saveFollow, deleteFollow, getFollowers, getFollowing } = require('../controllers/follow');

router.post("/save", validateToken, saveFollow);

router.delete("/unfollow/:id", validateToken, deleteFollow);

router.get("/following/:id?/:page?", validateToken, getFollowing);

router.get("/followers/:id?/:page?", validateToken, getFollowers);


module.exports = router;