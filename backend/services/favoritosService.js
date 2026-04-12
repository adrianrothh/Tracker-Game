const favoritosRepository = require('../repositories/favoritosRepository');
const jogadorRepository = require('../repositories/jogadorRepository');

async function addFavorito(usuario_id, riot_name, riot_tag, puuid) {
  let jogador = await jogadorRepository.findByRiotId(riot_name, riot_tag);

  if (!jogador) {
    const id = await jogadorRepository.create(riot_name, riot_tag, puuid);
    jogador = { id };
  }

  const duplicado = await favoritosRepository.findDuplicate(usuario_id, jogador.id);
  if (duplicado) {
    const err = new Error('Jogador já está nos favoritos');
    err.status = 409;
    throw err;
  }

  await favoritosRepository.add(usuario_id, jogador.id);
  return { message: 'Jogador adicionado aos favoritos' };
}

async function removeFavorito(id, usuario_id) {
  await favoritosRepository.remove(id, usuario_id);
  return { message: 'Jogador removido dos favoritos' };
}

async function listFavoritos(usuario_id) {
  return await favoritosRepository.listByUser(usuario_id);
}

module.exports = { addFavorito, removeFavorito, listFavoritos };