const pool = require("../config/db");

async function upsert(partida) {
  await pool.query(
    `INSERT INTO partidas 
      (
        jogador_id,
        match_id,
        mapa,
        modo,
        agente,
        kills,
        deaths,
        assists,
        kdr,
        resultado,
        data_partida,
        headshot_percent,
        acs,
        ddelta_por_round,
        first_bloods,
        aces,
        detalhes_json
      )
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      mapa = VALUES(mapa),
      modo = VALUES(modo),
      agente = VALUES(agente),
      kills = VALUES(kills),
      deaths = VALUES(deaths),
      assists = VALUES(assists),
      kdr = VALUES(kdr),
      resultado = VALUES(resultado),
      data_partida = VALUES(data_partida),
      headshot_percent = VALUES(headshot_percent),
      acs = VALUES(acs),
      ddelta_por_round = VALUES(ddelta_por_round),
      first_bloods = VALUES(first_bloods),
      aces = VALUES(aces),
      detalhes_json = VALUES(detalhes_json)`,
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
      partida.ddelta_por_round,
      partida.first_bloods,
      partida.aces,
      partida.detalhes_json || null,
    ],
  );
}

async function findByJogadorId(jogador_id) {
  const [rows] = await pool.query(
    "SELECT * FROM partidas WHERE jogador_id = ? ORDER BY data_partida DESC",
    [jogador_id],
  );

  return rows;
}

async function findDetailsByJogadorAndMatch(jogador_id, match_id) {
  const [rows] = await pool.query(
    "SELECT * FROM partidas WHERE jogador_id = ? AND match_id = ? LIMIT 1",
    [jogador_id, match_id],
  );

  if (rows.length === 0) return null;

  const partida = rows[0];

  let detalhes = null;

  try {
    detalhes = partida.detalhes_json ? JSON.parse(partida.detalhes_json) : null;
  } catch (error) {
    console.error("Erro ao converter detalhes_json:", error.message);
  }

  return {
    ...partida,
    detalhes,
  };
}

async function deleteByJogadorId(jogador_id) {
  await pool.query("DELETE FROM partidas WHERE jogador_id = ?", [jogador_id]);
}

module.exports = {
  upsert,
  findByJogadorId,
  findDetailsByJogadorAndMatch,
  deleteByJogadorId,
};