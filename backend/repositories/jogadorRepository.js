const pool = require('../config/db');

async function findByRiotId(riot_name, riot_tag) {
  const [rows] = await pool.query(
    'SELECT * FROM jogadores WHERE riot_name = ? AND riot_tag = ?',
    [riot_name, riot_tag]
  );
  return rows[0];
}

async function create(riot_name, riot_tag, puuid) {
  const [result] = await pool.query(
    'INSERT INTO jogadores (riot_name, riot_tag, puuid) VALUES (?, ?, ?)',
    [riot_name, riot_tag, puuid]
  );
  return result.insertId;
}

module.exports = { findByRiotId, create };  