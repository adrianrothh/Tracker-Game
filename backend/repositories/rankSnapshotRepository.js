const pool = require('../config/db');

async function save(jogador_id, rank, rr) {
  await pool.query(
    'INSERT INTO rank_snapshots (jogador_id, rank, rr) VALUES (?, ?, ?)',
    [jogador_id, rank, rr]
  );
}

async function findByJogadorId(jogador_id) {
  const [rows] = await pool.query(
    'SELECT * FROM rank_snapshots WHERE jogador_id = ? ORDER BY data_coleta ASC',
    [jogador_id]
  );
  return rows;
}

module.exports = { save, findByJogadorId };