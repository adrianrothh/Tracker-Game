const favoritosService = require('../services/favoritosService');

async function addFavorito(req, res) {
  const { riot_name, riot_tag, puuid } = req.body;
  const usuario_id = req.usuario.id;

  if (!riot_name || !riot_tag) {
    return res.status(400).json({ success: false, message: 'Preencha riot_name e riot_tag' });
  }

  try {
    const result = await favoritosService.addFavorito(usuario_id, riot_name, riot_tag, puuid);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    console.error('Erro ao adicionar favorito:', err);
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
}

async function removeFavorito(req, res) {
  const { id } = req.params;
  const usuario_id = req.usuario.id;

  try {
    const result = await favoritosService.removeFavorito(id, usuario_id);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error('Erro ao remover favorito:', err);
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
}

async function listFavoritos(req, res) {
  const usuario_id = req.usuario.id;

  try {
    const favoritos = await favoritosService.listFavoritos(usuario_id);
    res.status(200).json({ success: true, data: favoritos });
  } catch (err) {
    console.error('Erro ao listar favoritos:', err);
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
}

module.exports = { addFavorito, removeFavorito, listFavoritos };