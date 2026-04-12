const pool = require('../config/db');

async function findByEmail(email) {
  const [rows] = await pool.query(
    'SELECT * FROM usuarios WHERE email = ?', [email]
  );
  return rows[0];
}

async function create(nome, email, senhaHash) {
  const [result] = await pool.query(
    'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
    [nome, email, senhaHash]
  );
  return result.insertId;
}

async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, nome, email, criado_em FROM usuarios WHERE id = ?', [id]
  );
  return rows[0];
}

async function deleteById(id) {
  await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
}

module.exports = { findByEmail, create, findById, deleteById };
