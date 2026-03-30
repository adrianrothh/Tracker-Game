const fetch = require('node-fetch');

const BASE_URL = 'https://api.henrikdev.xyz/valorant';
const API_KEY = process.env.HENRIK_API_KEY;

const headers = {
  'Authorization': API_KEY
};

async function getPlayerData(region, name, tag) {
  const [accountRes, mmrRes, matchesRes] = await Promise.all([
    fetch(`${BASE_URL}/v1/account/${name}/${tag}`, { headers }),
    fetch(`${BASE_URL}/v2/mmr/${region}/${name}/${tag}`, { headers }),
    fetch(`${BASE_URL}/v3/matches/${region}/${name}/${tag}?size=5`, { headers })
  ]);

  if (accountRes.status === 404) {
    const err = new Error('Jogador não encontrado');
    err.status = 404;
    throw err;
  }

  if (!accountRes.ok || !mmrRes.ok || !matchesRes.ok) {
    const err = new Error('Erro ao consultar a API do Valorant');
    err.status = 502;
    throw err;
  }

  const account = await accountRes.json();
  const mmr = await mmrRes.json();
  const matches = await matchesRes.json();

  return {
    account: account.data,
    mmr: mmr.data,
    matches: matches.data
  };
}

module.exports = { getPlayerData };
