const fetch = require("node-fetch");
const pool = require("../config/db");
const jogadorRepository = require("../repositories/jogadorRepository");
const partidaRepository = require("../repositories/partidaRepository");
const rankSnapshotRepository = require("../repositories/rankSnapshotRepository");

const BASE_URL = "https://api.henrikdev.xyz/valorant";
const API_KEY = process.env.HENRIK_API_KEY;
const headers = { Authorization: API_KEY };

async function getPlayerData(region, name, tag, forceUpdate = false) {
  // 1. Busca o jogador localmente primeiro
  let jogador = await jogadorRepository.findByRiotId(name, tag);

  // Trava de segurança de 2 minutos contra abusos de forceUpdate
  const atualizadoRecentemente =
    jogador &&
    Date.now() - new Date(jogador.atualizado_em).getTime() < 2 * 60 * 1000;

  const forcarDefinitivo = forceUpdate && !atualizadoRecentemente;

  const precisaAtualizar =
    !jogador || forcarDefinitivo || dadosExpirados(jogador.atualizado_em);

  // Se NÃO precisa atualizar, entra no fluxo normal de cache
  if (!precisaAtualizar) {
    const partidas = await partidaRepository.findByJogadorId(jogador.id);

    if (partidas && partidas.length > 0) {
      const partidasOrdenadas = partidas.sort(
        (a, b) => new Date(b.data_partida) - new Date(a.data_partida),
      );

      const ultimas10 = partidasOrdenadas.slice(0, 10);
      const ultimas10ComPerformance =
        adicionarPerformanceNasPartidas(ultimas10);

      return {
        fonte: "banco",
        jogador,
        partidas: ultimas10ComPerformance,
        stats: calcularEstatisticas(ultimas10),
      };
    }

    console.log(
      "Jogador encontrado no banco, mas sem partidas. Buscando na API...",
    );
  }

  // 2. Se precisa atualizar, envelopamos no try/catch para segurança
  try {
    const [accountRes, mmrRes, matchesRes] = await Promise.all([
      fetch(`${BASE_URL}/v1/account/${name}/${tag}`, { headers }),
      fetch(`${BASE_URL}/v2/mmr/${region}/${name}/${tag}`, { headers }),
      fetch(
        `${BASE_URL}/v3/matches/${region}/${name}/${tag}?size=10&mode=competitive`,
        { headers },
      ),
    ]);

    if (accountRes.status === 404) {
      const err = new Error("Jogador não encontrado");
      err.status = 404;
      throw err;
    }

    if (!accountRes.ok || !mmrRes.ok || !matchesRes.ok) {
      const err = new Error("Erro ao consultar a API do Valorant");
      err.status = 502;
      throw err;
    }

    const account = await accountRes.json();
    const mmr = await mmrRes.json();
    const matches = await matchesRes.json();

    const puuid = account.data.puuid;
    const novasPartidas = matches.data || [];
    const card = account.data?.card || null;

    // Logs temporários de controle
    console.log("Status matches:", matchesRes.status);
    console.log("Partidas buscadas da API:", novasPartidas.length);

    // Cria ou atualiza o perfil do jogador
    if (!jogador) {
      const jogadorPorPuuid = await jogadorRepository.findByPuuid(puuid);

      if (jogadorPorPuuid) {
        jogador = jogadorPorPuuid;

        await jogadorRepository.update(
          jogador.id,
          mmr.data?.current_data?.currenttierpatched,
          card,
        );
      } else {
        const id = await jogadorRepository.create(name, tag, puuid);
        const rankAtual = mmr.data?.current_data?.currenttierpatched || null;

        await jogadorRepository.update(id, rankAtual, card);

        jogador = {
          id,
          riot_name: name,
          riot_tag: tag,
          puuid,
          rank: rankAtual,
        };
      }
    } else {
      await jogadorRepository.update(
        jogador.id,
        mmr.data?.current_data?.currenttierpatched,
        card,
      );

      await rankSnapshotRepository.save(
        jogador.id,
        mmr.data?.current_data?.currenttierpatched || null,
        mmr.data?.current_data?.ranking_in_tier || null,
      );
    }

    // Salva as partidas novas recebidas
    if (novasPartidas.length > 0) {
      let partidasSalvas = 0;

      for (const match of novasPartidas) {
        const jogadorDaPartida = match.players?.all_players?.find(
          (p) => p.puuid === puuid,
        );

        if (!jogadorDaPartida) continue;

        const rounds_played = match.metadata?.rounds_played || 1;

        const headshots = jogadorDaPartida?.stats?.headshots || 0;
        const bodyshots = jogadorDaPartida?.stats?.bodyshots || 0;
        const legshots = jogadorDaPartida?.stats?.legshots || 0;
        const totalShots = headshots + bodyshots + legshots;

        const damage_made = jogadorDaPartida?.damage_made || 0;
        const damage_received = jogadorDaPartida?.damage_received || 0;
        const score = jogadorDaPartida?.stats?.score || 0;

        const { firstBloods, aces } = calcularFirstBloodsEAces(match, puuid);

        const timeDoJogador = jogadorDaPartida?.team?.toLowerCase();
        const redGanhou = match.teams?.red?.has_won === true;
        const blueGanhou = match.teams?.blue?.has_won === true;

        let resultado;

        if (!redGanhou && !blueGanhou) {
          resultado = "Empate";
        } else {
          const jogadorGanhou =
            (timeDoJogador === "red" && redGanhou) ||
            (timeDoJogador === "blue" && blueGanhou);

          resultado = jogadorGanhou ? "Vitória" : "Derrota";
        }

        await partidaRepository.upsert({
          jogador_id: jogador.id,
          match_id: match.metadata.matchid,
          mapa: match.metadata.map,
          modo: match.metadata.mode,
          agente: jogadorDaPartida.character || null,
          kills: jogadorDaPartida.stats?.kills || 0,
          deaths: jogadorDaPartida.stats?.deaths || 0,
          assists: jogadorDaPartida.stats?.assists || 0,
          kdr:
            jogadorDaPartida.stats?.deaths > 0
              ? (
                  jogadorDaPartida.stats.kills / jogadorDaPartida.stats.deaths
                ).toFixed(2)
              : jogadorDaPartida.stats?.kills || 0,
          resultado,
          data_partida: new Date(match.metadata.game_start * 1000),
          headshot_percent:
            totalShots > 0 ? ((headshots / totalShots) * 100).toFixed(2) : 0,
          acs: (score / rounds_played).toFixed(2),
          ddelta_por_round: (
            (damage_made - damage_received) /
            rounds_played
          ).toFixed(2),
          first_bloods: firstBloods,
          aces,
          detalhes_json: JSON.stringify({
            metadata: {
              matchid: match.metadata?.matchid || null,
              map: match.metadata?.map || null,
              mode: match.metadata?.mode || null,
              rounds_played: match.metadata?.rounds_played || null,
              game_start: match.metadata?.game_start || null,
            },
            teams: match.teams || null,
            players: (match.players?.all_players || []).map((player) => ({
              puuid: player.puuid,
              name: player.name,
              tag: player.tag,
              team: player.team,
              character: player.character,
              currenttier_patched: player.currenttier_patched,
              damage_made: player.damage_made,
              damage_received: player.damage_received,
              stats: {
                kills: player.stats?.kills || 0,
                deaths: player.stats?.deaths || 0,
                assists: player.stats?.assists || 0,
                score: player.stats?.score || 0,
                headshots: player.stats?.headshots || 0,
                bodyshots: player.stats?.bodyshots || 0,
                legshots: player.stats?.legshots || 0,
              },
            })),
          }),
        });

        partidasSalvas++;
      }

      console.log("Partidas salvas no banco:", partidasSalvas);
    }

    // Busca tudo do banco pós-salvamento e aplica limite/ordenação
    const todasPartidas = await partidaRepository.findByJogadorId(jogador.id);

    const todasPartidasOrdenadas = todasPartidas.sort(
      (a, b) => new Date(b.data_partida) - new Date(a.data_partida),
    );

    const ultimas10 = todasPartidasOrdenadas.slice(0, 10);
    const ultimas10ComPerformance = adicionarPerformanceNasPartidas(ultimas10);

    if (todasPartidasOrdenadas.length > 10) {
      const partidasParaDeletar = todasPartidasOrdenadas.slice(10);

      for (const partidaAntiga of partidasParaDeletar) {
        await pool.query(
          "DELETE FROM partidas WHERE match_id = ? AND jogador_id = ?",
          [partidaAntiga.match_id, jogador.id],
        );
      }

      console.log(
        `Limpeza concluída: ${partidasParaDeletar.length} partidas antigas removidas.`,
      );
    }

    return {
      fonte: "api",
      jogador: {
        id: jogador.id,
        riot_name: name,
        riot_tag: tag,
        puuid: puuid,
        rank: mmr.data?.current_data?.currenttierpatched || null,
        card,
        atualizado_em: new Date(),
      },
      partidas: ultimas10ComPerformance,
      stats: calcularEstatisticas(ultimas10),
    };
  } catch (error) {
    console.error(
      `[Henrik API Erro]: Falha ao atualizar dados de ${name}#${tag}.`,
      error.message,
    );

    // SE A API FALHAR MAS JÁ TEMOS DADOS SALVOS: Aciona a Boia de Salvação (Fallback)
    if (jogador) {
      console.log(
        `[Fallback]: Retornando cache existente devido à instabilidade da API.`,
      );

      const partidas = await partidaRepository.findByJogadorId(jogador.id);

      const partidasOrdenadas = partidas.sort(
        (a, b) => new Date(b.data_partida) - new Date(a.data_partida),
      );

      const ultimas10 = partidasOrdenadas.slice(0, 10);
      const ultimas10ComPerformance =
        adicionarPerformanceNasPartidas(ultimas10);

      return {
        fonte: "banco_fallback",
        jogador,
        partidas: ultimas10ComPerformance,
        stats: calcularEstatisticas(ultimas10),
      };
    }

    // Se não tem dados locais, repassa o erro adiante
    throw {
      status: error.status || 503,
      message:
        error.message ||
        "A API de Valorant está instável e este jogador não possui dados armazenados.",
    };
  }
}

function dadosExpirados(atualizado_em) {
  if (!atualizado_em) return true;

  const minutosExpiracao = parseInt(process.env.CACHE_EXPIRATION_MINUTES) || 30;
  const milissegundosExpiracao = minutosExpiracao * 60 * 1000;
  const dataAtualizacao = new Date(atualizado_em);
  const diferencaTempo = Date.now() - dataAtualizacao.getTime();

  return diferencaTempo > milissegundosExpiracao;
}

function statusVazio() {
  return {
    total_partidas: 0,
    vitorias: 0,
    empates: 0,
    derrotas: 0,
    winrate: "0%",
    kdr_geral: "0.00",
    kda_geral: "0.00",
    kills_totais: 0,
    deaths_totais: 0,
    assists_totais: 0,
    acs_medio: "0.00",
    ddelta_por_round_medio: "0.00",
    headshot_percent_medio: "0.00%",
    first_bloods_totais: 0,
    aces_totais: 0,
    performance: {
      score: 0,
      rank: "C",
    },
  };
}

function calcularEstatisticas(partidas) {
  if (!partidas || partidas.length === 0) return statusVazio();

  const total = partidas.length;

  const vitorias = partidas.filter((p) => p.resultado === "Vitória").length;
  const empates = partidas.filter((p) => p.resultado === "Empate").length;

  const kills = partidas.reduce((acc, p) => acc + (p.kills || 0), 0);
  const deaths = partidas.reduce((acc, p) => acc + (p.deaths || 0), 0);
  const assists = partidas.reduce((acc, p) => acc + (p.assists || 0), 0);

  const acs = partidas.reduce((acc, p) => acc + parseFloat(p.acs || 0), 0);

  const ddelta = partidas.reduce(
    (acc, p) => acc + parseFloat(p.ddelta_por_round || 0),
    0,
  );

  const hs = partidas.reduce(
    (acc, p) => acc + parseFloat(p.headshot_percent || 0),
    0,
  );

  const firstBloods = partidas.reduce(
    (acc, p) => acc + (p.first_bloods || 0),
    0,
  );

  const aces = partidas.reduce((acc, p) => acc + (p.aces || 0), 0);

  const kda_geral =
    deaths > 0
      ? ((kills + assists) / deaths).toFixed(2)
      : (kills + assists).toFixed(2);

  const kdr_geral_num = deaths > 0 ? kills / deaths : kills;

  // --- ALGORITMO DO PERFORMANCE SCORE GERAL (0 a 100)
  const winrate_num = vitorias / total;
  const acs_medio_num = acs / total;
  const ddelta_medio_num = ddelta / total;

  const score_winrate = limitarScore(winrate_num * 100);
  const score_kdr = limitarScore(kdr_geral_num * 50);
  const score_acs = limitarScore((acs_medio_num / 250) * 100);
  const score_ddelta = limitarScore(((ddelta_medio_num + 50) / 100) * 100);

  let performance_score =
    score_winrate * 0.25 +
    score_kdr * 0.25 +
    score_acs * 0.25 +
    score_ddelta * 0.25;

  performance_score = limitarScore(performance_score);

  const performance_rank = calcularPerformanceRank(performance_score);

  return {
    total_partidas: total,
    vitorias,
    empates,
    derrotas: total - vitorias - empates,
    winrate: (winrate_num * 100).toFixed(1) + "%",
    kdr_geral: kdr_geral_num.toFixed(2),
    kda_geral,
    kills_totais: kills,
    deaths_totais: deaths,
    assists_totais: assists,
    acs_medio: acs_medio_num.toFixed(2),
    ddelta_por_round_medio: ddelta_medio_num.toFixed(2),
    headshot_percent_medio: (hs / total).toFixed(2) + "%",
    first_bloods_totais: firstBloods,
    aces_totais: aces,
    performance: {
      score: Math.round(performance_score),
      rank: performance_rank,
    },
  };
}

function adicionarPerformanceNasPartidas(partidas) {
  return partidas.map((partida) => {
    const performance = calcularPerformancePartida(partida);

    return {
      ...partida,
      performance_score: performance.score,
      performance_rank: performance.rank,
    };
  });
}

function calcularPerformancePartida(partida) {
  const kdr = Number(partida.kdr || 0);
  const acs = Number(partida.acs || 0);
  const ddelta = Number(partida.ddelta_por_round || 0);

  let resultadoScore = 0;

  if (partida.resultado === "Vitória") resultadoScore = 100;
  else if (partida.resultado === "Empate") resultadoScore = 50;
  else resultadoScore = 0;

  const score_resultado = limitarScore(resultadoScore);
  const score_kdr = limitarScore(kdr * 50);
  const score_acs = limitarScore((acs / 250) * 100);
  const score_ddelta = limitarScore(((ddelta + 50) / 100) * 100);

  let performance_score =
    score_resultado * 0.25 +
    score_kdr * 0.25 +
    score_acs * 0.25 +
    score_ddelta * 0.25;

  performance_score = limitarScore(performance_score);

  return {
    score: Math.round(performance_score),
    rank: calcularPerformanceRank(performance_score),
  };
}

function limitarScore(valor) {
  const numero = Number(valor);

  if (!Number.isFinite(numero)) return 0;

  return Math.max(0, Math.min(100, numero));
}

function calcularPerformanceRank(score) {
  if (score >= 90) return "S+";
  if (score >= 80) return "S";
  if (score >= 65) return "A";
  if (score >= 50) return "B";

  return "C";
}

function calcularFirstBloodsEAces(match, puuid) {
  const kills = match.kills || [];

  let firstBloods = 0;
  let aces = 0;

  const killsPorRound = {};

  for (const kill of kills) {
    const round = kill.round;

    if (!killsPorRound[round]) killsPorRound[round] = [];

    killsPorRound[round].push(kill);
  }

  for (const round in killsPorRound) {
    const killsDoRound = killsPorRound[round];

    const primeiroKill = killsDoRound.reduce((min, k) =>
      k.kill_time_in_round < min.kill_time_in_round ? k : min,
    );

    if (primeiroKill.killer_puuid === puuid) firstBloods++;

    const killsDoJogador = killsDoRound.filter((k) => k.killer_puuid === puuid);

    if (killsDoJogador.length >= 5) aces++;
  }

  return { firstBloods, aces };
}

module.exports = { getPlayerData };
