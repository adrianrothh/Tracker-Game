const fetch = require('node-fetch');
const jogadorRepository = require('../repositories/jogadorRepository');
const partidaRepository = require('../repositories/partidaRepository');
const rankSnapshotRepository = require('../repositories/rankSnapshotRepository');
const BASE_URL = 'https://api.henrikdev.xyz/valorant';
const API_KEY = process.env.HENRIK_API_KEY;
const headers = { 'Authorization': API_KEY };

async function getPlayerData(region, name, tag, forceUpdate = false) {

  let jogador = await jogadorRepository.findByRiotId(name, tag);
  const precisaAtualizar = !jogador || forceUpdate || dadosExpirados(jogador.atualizado_em);

  if (!precisaAtualizar) {
    const partidas = await partidaRepository.findByJogadorId(jogador.id);
    const ultimas5 = partidas.slice(0, 5);
    return {
      fonte: 'banco',
      jogador,
      partidas: ultimas5,
      stats: calcularEstatisticas(partidas)
    };
  }

  const [accountRes, mmrRes, matchesRes, allMatchesRes] = await Promise.all([
    fetch(`${BASE_URL}/v1/account/${name}/${tag}`, { headers }),
    fetch(`${BASE_URL}/v2/mmr/${region}/${name}/${tag}`, { headers }),
    fetch(`${BASE_URL}/v3/matches/${region}/${name}/${tag}?size=5&mode=competitive`, { headers }),
    fetch(`${BASE_URL}/v3/matches/${region}/${name}/${tag}?size=50&mode=competitive`, { headers })
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
  const allMatches = allMatchesRes.ok ? await allMatchesRes.json() : { data: [] };
  const puuid = account.data.puuid;

if (!jogador) {
  const id = await jogadorRepository.create(name, tag, puuid);
  jogador = { id, riot_name: name, riot_tag: tag, puuid };
} else {
  await jogadorRepository.update(jogador.id, mmr.data?.current_data?.currenttierpatched);
  await rankSnapshotRepository.save(  // ← adiciona isso
    jogador.id,
    mmr.data?.current_data?.currenttierpatched || null,
    mmr.data?.current_data?.ranking_in_tier || null
  );
}

if (allMatches.data && allMatches.data.length > 0) {
    for (const match of allMatches.data) {
      const jogadorDaPartida = match.players?.all_players?.find(p => p.puuid === puuid);
      const rounds_played = match.metadata?.rounds_played || 1;
      const headshots = jogadorDaPartida?.stats?.headshots || 0;
      const bodyshots = jogadorDaPartida?.stats?.bodyshots || 0;
      const legshots = jogadorDaPartida?.stats?.legshots || 0;
      const totalShots = headshots + bodyshots + legshots;
      const damage_made = jogadorDaPartida?.damage_made || 0;
      const score = jogadorDaPartida?.stats?.score || 0;
      const { firstBloods, aces } = calcularFirstBloodsEAces(match, puuid);
      const timeDoJogador = jogadorDaPartida?.team?.toLowerCase();
      const redGanhou = match.teams?.red?.has_won === true;
      const jogadorGanhou = (timeDoJogador === 'red' && redGanhou) ||
                            (timeDoJogador === 'blue' && !redGanhou);

      await partidaRepository.upsert({
        jogador_id: jogador.id,
        match_id: match.metadata.matchid,
        mapa: match.metadata.map,
        modo: match.metadata.mode,
        agente: jogadorDaPartida?.character || null,
        kills: jogadorDaPartida?.stats?.kills || 0,
        deaths: jogadorDaPartida?.stats?.deaths || 0,
        assists: jogadorDaPartida?.stats?.assists || 0,
        kdr: jogadorDaPartida?.stats?.deaths > 0
          ? (jogadorDaPartida.stats.kills / jogadorDaPartida.stats.deaths).toFixed(2)
          : jogadorDaPartida?.stats?.kills || 0,
        resultado: jogadorGanhou ? 'Vitória' : 'Derrota',
        data_partida: new Date(match.metadata.game_start * 1000),
        headshot_percent: totalShots > 0 ? ((headshots / totalShots) * 100).toFixed(2) : 0,
        acs: (score / rounds_played).toFixed(2),
        dano_por_round: (damage_made / rounds_played).toFixed(2),
        first_bloods: firstBloods,
        aces: aces
      });
    }
  }

  const todasPartidas = await partidaRepository.findByJogadorId(jogador.id);
  const ultimas5 = todasPartidas.slice(0, 5);

  return {
    fonte: 'api',
    jogador: {
      id: jogador.id,
      riot_name: name,
      riot_tag: tag,
      puuid: puuid,
      rank: mmr.data?.current_data?.currenttierpatched || null,
      atualizado_em: new Date()
    },
    partidas: ultimas5,
    stats: calcularEstatisticas(todasPartidas)
  };
}

function dadosExpirados(atualizado_em) {
  if (!atualizado_em) return true;
  const diff = Date.now() - new Date(atualizado_em).getTime();
  return diff > 30 * 60 * 1000;
}

function calcularEstatisticas(partidas) {
  if (!partidas || partidas.length === 0) return null;

  const total = partidas.length;
  const vitorias = partidas.filter(p => p.resultado === 'Vitória').length;
  const kills = partidas.reduce((acc, p) => acc + (p.kills || 0), 0);
  const deaths = partidas.reduce((acc, p) => acc + (p.deaths || 0), 0);
  const assists = partidas.reduce((acc, p) => acc + (p.assists || 0), 0);
  const acs = partidas.reduce((acc, p) => acc + parseFloat(p.acs || 0), 0);
  const dano = partidas.reduce((acc, p) => acc + parseFloat(p.dano_por_round || 0), 0);
  const hs = partidas.reduce((acc, p) => acc + parseFloat(p.headshot_percent || 0), 0);
  const firstBloods = partidas.reduce((acc, p) => acc + (p.first_bloods || 0), 0);
  const aces = partidas.reduce((acc, p) => acc + (p.aces || 0), 0);

  return {
    total_partidas: total,
    vitorias,
    derrotas: total - vitorias,
    winrate: ((vitorias / total) * 100).toFixed(1) + '%',
    kdr_geral: deaths > 0 ? (kills / deaths).toFixed(2) : kills,
    kills_totais: kills,
    deaths_totais: deaths,
    assists_totais: assists,
    acs_medio: (acs / total).toFixed(2),
    dano_por_round_medio: (dano / total).toFixed(2),
    headshot_percent_medio: (hs / total).toFixed(2) + '%',
    first_bloods_totais: firstBloods,
    aces_totais: aces
  };
}

function calcularFirstBloodsEAces(match, puuid) {
  const kills = match.kills || [];
  let firstBloods = 0;
  let aces = 0;

  // Agrupa kills por round
  const killsPorRound = {};
  for (const kill of kills) {
    const round = kill.round;
    if (!killsPorRound[round]) killsPorRound[round] = [];
    killsPorRound[round].push(kill);
  }

  for (const round in killsPorRound) {
    const killsDoRound = killsPorRound[round];

    // First Blood — primeiro kill do round
    const primeiroKill = killsDoRound.reduce((min, k) =>
      k.kill_time_in_round < min.kill_time_in_round ? k : min
    );
    if (primeiroKill.killer_puuid === puuid) firstBloods++;

    // Aces — 5 kills no mesmo round pelo mesmo jogador
    const killsDoJogador = killsDoRound.filter(k => k.killer_puuid === puuid);
    if (killsDoJogador.length >= 5) aces++;
  }

  return { firstBloods, aces };
}

module.exports = { getPlayerData };