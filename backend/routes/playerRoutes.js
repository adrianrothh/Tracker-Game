const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

router.get('/rank-history/:region/:name/:tag', playerController.getRankHistory);
router.get('/:region/:name/:tag', playerController.getPlayer);
router.get('/match/:matchId', playerController.getMatchDetails);
router.post('/update/:region/:name/:tag', playerController.updatePlayer);


module.exports = router;