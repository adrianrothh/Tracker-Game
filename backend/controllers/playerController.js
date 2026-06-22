const playerService = require('../services/playerService');

async function getPlayer(req, res) {
  const { region, name, tag } = req.params;
  const forceUpdate = req.query.force === 'true';
  
  try {
    const data = await playerService.getPlayerData(region, name, tag, forceUpdate);
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Erro completo:', err);
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
}

async function updatePlayer(req, res) {
  const { region, name, tag } = req.params;

  try {
    const data = await playerService.getPlayerData(region, name, tag, true);
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Erro no updatePlayer:', err);
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
}

async function getRankHistory(req, res) {
  const { region, name, tag } = req.params;

  try {
    const jogador = await require('../repositories/jogadorRepository').findByRiotId(name, tag);
    if (!jogador) {
      return res.status(404).json({ success: false, message: 'Jogador não encontrado' });
    }
    const history = await require('../repositories/rankSnapshotRepository').findByJogadorId(jogador.id);
    res.status(200).json({ success: true, data: history });
  } catch (err) {
    console.error('Erro no getRankHistory:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

async function getMatchDetails(req, res) {
  try {
    const { matchId } = req.params;
    const data = await playerService.getMatchDetailsFromAPI(matchId);
    
    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error("[Controller Erro Match]:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Erro ao buscar detalhes da partida."
    });
  }
}

module.exports = { getPlayer, updatePlayer, getRankHistory, getMatchDetails };