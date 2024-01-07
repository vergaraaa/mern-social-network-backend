const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/auth');
const { saveFollow } = require('../controllers/follow');

router.post("/save", validateToken, saveFollow);


module.exports = router;