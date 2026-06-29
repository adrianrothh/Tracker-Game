const pool = require("../config/db");

function formatarJogador(jogador) {
  if (!jogador) return null;

  return {
    ...jogador,
    card:
      jogador.card_large || jogador.card_wide || jogador.card_small
        ? {
            small: jogador.card_small,
            large: jogador.card_large,
            wide: jogador.card_wide,
            id: jogador.card_id,
          }
        : null,
  };
}

async function findByRiotId(riot_name, riot_tag) {
  const [rows] = await pool.query(
    "SELECT * FROM jogadores WHERE riot_name = ? AND riot_tag = ?",
    [riot_name, riot_tag],
  );

  return formatarJogador(rows[0]);
}

async function create(riot_name, riot_tag, puuid) {
  const [result] = await pool.query(
    "INSERT INTO jogadores (riot_name, riot_tag, puuid) VALUES (?, ?, ?)",
    [riot_name, riot_tag, puuid],
  );

  return result.insertId;
}

async function update(id, rank, card = null) {
  await pool.query(
    "UPDATE jogadores SET `rank` = ?, card_small = ?, card_large = ?, card_wide = ?, card_id = ?, atualizado_em = NOW() WHERE id = ?",
    [
      rank,
      card?.small || null,
      card?.large || null,
      card?.wide || null,
      card?.id || null,
      id,
    ],
  );
}

async function findByPuuid(puuid) {
  const [rows] = await pool.query("SELECT * FROM jogadores WHERE puuid = ?", [
    puuid,
  ]);

  return formatarJogador(rows[0]);
}

module.exports = { findByRiotId, create, update, findByPuuid };
