const express = require('express');
const router = express.Router();
const favoritosController = require('../controllers/favoritosController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, favoritosController.addFavorito);
router.delete('/:id', authMiddleware, favoritosController.removeFavorito);
router.get('/', authMiddleware, favoritosController.listFavoritos);

module.exports = router;