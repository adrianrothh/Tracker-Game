const usuarioRepository = require('../repositories/usuarioRepository.js');

async function getProfile(req, res) {
  try {
    const usuario = await usuarioRepository.findById(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    res.status(200).json({ success: true, data: usuario });
  } catch (err) {
    console.error('Erro no getProfile:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

async function deleteAccount(req, res) {
  try {
    await usuarioRepository.deleteById(req.usuario.id);
    res.status(200).json({ success: true, message: 'Conta excluída com sucesso' });
  } catch (err) {
    console.error('Erro no deleteAccount:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getProfile, deleteAccount };