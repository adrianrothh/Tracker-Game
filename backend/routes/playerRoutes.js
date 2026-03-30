const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

router.get('/:region/:name/:tag', playerController.getPlayer);

module.exports = router;