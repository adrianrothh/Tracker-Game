const pool = require('../config/db');

async function add(usuario_id, jogador_id) {
  const [result] = await pool.query(
    'INSERT INTO favoritos (usuario_id, jogador_id) VALUES (?, ?)',
    [usuario_id, jogador_id]
  );
  return result.insertId;
}

async function remove(id, usuario_id) {
  await pool.query(
    'DELETE FROM favoritos WHERE id = ? AND usuario_id = ?',
    [id, usuario_id]
  );
}

async function listByUser(usuario_id) {
  const [rows] = await pool.query(
    `SELECT f.id, j.riot_name, j.riot_tag, j.puuid, j.atualizado_em
     FROM favoritos f
     JOIN jogadores j ON f.jogador_id = j.id
     WHERE f.usuario_id = ?`,
    [usuario_id]
  );
  return rows;
}

async function findDuplicate(usuario_id, jogador_id) {
  const [rows] = await pool.query(
    'SELECT * FROM favoritos WHERE usuario_id = ? AND jogador_id = ?',
    [usuario_id, jogador_id]
  );
  return rows[0];
}

module.exports = { add, remove, listByUser, findDuplicate };