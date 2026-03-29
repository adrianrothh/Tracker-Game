const playerService = require('../services/playerService');

async function getPlayer(req, res) {
  const { region, name, tag } = req.params;

  try {
    const data = await playerService.getPlayerData(region, name, tag);
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Erro interno do servidor'
    });
  }
}

module.exports = { getPlayer };