const pool = require('../config/db');

async function upsert(partida) {
  await pool.query(
    `INSERT INTO partidas 
      (jogador_id, match_id, mapa, modo, agente, kills, deaths, assists, kdr, resultado, data_partida, headshot_percent, acs, dano_por_round, first_bloods, aces)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      mapa = VALUES(mapa),
      modo = VALUES(modo),
      agente = VALUES(agente),
      kills = VALUES(kills),
      deaths = VALUES(deaths),
      assists = VALUES(assists),
      kdr = VALUES(kdr),
      resultado = VALUES(resultado),
      headshot_percent = VALUES(headshot_percent),
      acs = VALUES(acs),
      dano_por_round = VALUES(dano_por_round),
      first_bloods = VALUES(first_bloods),
      aces = VALUES(aces)`,
    [
      partida.jogador_id,
      partida.match_id,
      partida.mapa,
      partida.modo,
      partida.agente,
      partida.kills,
      partida.deaths,
      partida.assists,
      partida.kdr,
      partida.resultado,
      partida.data_partida,
      partida.headshot_percent,
      partida.acs,
      partida.dano_por_round,
      partida.first_bloods,
      partida.aces
    ]
  );
}

async function findByJogadorId(jogador_id) {
  const [rows] = await pool.query(
    'SELECT * FROM partidas WHERE jogador_id = ? ORDER BY data_partida DESC',
    [jogador_id]
  );
  return rows;
}

module.exports = { upsert, findByJogadorId };