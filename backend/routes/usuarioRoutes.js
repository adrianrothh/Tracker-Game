const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/profile', authMiddleware, usuarioController.getProfile);
router.delete('/', authMiddleware, usuarioController.deleteAccount);

module.exports = router;