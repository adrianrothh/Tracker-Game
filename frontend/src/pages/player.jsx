import playerData from '../mocks/player.json'


function Player() {
  const account = playerData.data.account
  const mmr = playerData.data.mmr
  const matches = playerData.data.matches
  const myPuuid = "3c977bd2-1f15-5a51-a3ca-0c2c87193d6b"

  const totalKills = matches.reduce((acc, match) => {
    const me = match.players.all_players.find(p => p.puuid === myPuuid)
    return acc + (me ? me.stats.kills : 0)
  }, 0)

  const totalDeaths = matches.reduce((acc, match) => {
    const me = match.players.all_players.find(p => p.puuid === myPuuid)
    return acc + (me ? me.stats.deaths : 0)
  }, 0)

  const totalAssists = matches.reduce((acc, match) => {
    const me = match.players.all_players.find(p => p.puuid === myPuuid)
    return acc + (me ? me.stats.assists : 0)
  }, 0)

  const totalHeadshots = matches.reduce((acc, match) => {
    const me = match.players.all_players.find(p => p.puuid === myPuuid)
    return acc + (me ? me.stats.headshots : 0)
  }, 0)

  const totalBodyshots = matches.reduce((acc, match) => {
    const me = match.players.all_players.find(p => p.puuid === myPuuid)
    return acc + (me ? me.stats.bodyshots : 0)
  }, 0)

  const totalLegshots = matches.reduce((acc, match) => {
    const me = match.players.all_players.find(p => p.puuid === myPuuid)
    return acc + (me ? me.stats.legshots : 0)
  }, 0)

  const totalDamage = matches.reduce((acc, match) => {
    const me = match.players.all_players.find(p => p.puuid === myPuuid)
    return acc + (me ? me.damage_made : 0)
  }, 0)

  const totalDamageReceived = matches.reduce((acc, match) => {
    const me = match.players.all_players.find(p => p.puuid === myPuuid)
    return acc + (me ? me.damage_received : 0)
  }, 0)

  const totalRounds = matches.reduce((acc, match) => {
    return acc + match.metadata.rounds_played
  }, 0)

  const wins = matches.filter(match => {
    const me = match.players.all_players.find(p => p.puuid === myPuuid)
    const myTeam = me.team.toLowerCase()
    return match.teams[myTeam].has_won
  }).length
  
  
  const totalScore = matches.reduce((acc, match) => {
  const me = match.players.all_players.find(p => p.puuid === myPuuid)
  return acc + me.stats.score
  }, 0)

  const allRounds = matches.flatMap(match => match.rounds || [])


  const firstBloods = allRounds.reduce((acc, round) => {
  const allKills = round.player_stats?.flatMap(p => p.kill_events || []) || []
  if (allKills.length === 0) return acc
  const firstKill = allKills.reduce((a, b) =>
    a.kill_time_in_round < b.kill_time_in_round ? a : b
  )
  return firstKill.killer_puuid === myPuuid ? acc + 1 : acc
  }, 0)

  const aces = allRounds.filter(round => {
    const myStats = round.player_stats?.find(p => p.player_puuid === myPuuid)
    return myStats?.kills === 5
  }).length

  const flawlessRounds = allRounds.filter(round => {
    const myStats = round.player_stats?.find(p => p.player_puuid === myPuuid)
    if (!myStats) return false
    const myTeam = myStats.player_team
    const roundWon = round.winning_team === myTeam
    if (!roundWon) return false
    const anyTeammmateDied = round.player_stats?.some(p =>
      p.player_team === myTeam &&
      round.player_stats?.some(ps =>
        ps.kill_events?.some(k => k.victim_puuid === p.player_puuid)
      )
    )
    return !anyTeammmateDied
  }).length


  const kastRounds = allRounds.filter(round => {
    const myStats = round.player_stats?.find(p => p.player_puuid === myPuuid)
    if (!myStats) return false
    const hadKill = myStats.kills > 0
    const hadAssist = round.player_stats?.some(p =>
      p.kill_events?.some(k =>
        k.assistants?.some(a => a.assistant_puuid === myPuuid)
      )
    )
    const iDied = round.player_stats?.some(p =>
      p.kill_events?.some(k => k.victim_puuid === myPuuid)
    )
    const survived = !iDied
    const myTeam = myStats.player_team
    const myDeathEvent = round.player_stats?.flatMap(p => p.kill_events || [])
      .find(k => k.victim_puuid === myPuuid)
    const wasTraded = iDied && myDeathEvent ? round.player_stats?.flatMap(p => p.kill_events || [])
      .some(k =>
        round.player_stats?.find(ps => ps.player_puuid === k.killer_puuid)?.player_team === myTeam &&
        k.kill_time_in_round > myDeathEvent.kill_time_in_round &&
        k.kill_time_in_round - myDeathEvent.kill_time_in_round <= 5000
      ) : false
    return hadKill || hadAssist || survived || wasTraded
  }).length

  const KAST = allRounds.length > 0 ? Math.round((kastRounds / allRounds.length) * 100) : 0
  

  const ACS = totalRounds > 0 ? Math.round(totalScore / totalRounds) : 0
  const KAD = ((totalKills + totalAssists) / totalDeaths).toFixed(2)
  const DDdelta = ((totalDamage - totalDamageReceived) / totalRounds).toFixed(2)

  const losses = matches.length - wins

  const kd = totalDeaths > 0 ? (totalKills / totalDeaths).toFixed(2) : totalKills
  const winPercent = matches.length > 0 ? Math.round((wins / matches.length) * 100) : 0
  const totalShots = totalHeadshots + totalBodyshots + totalLegshots
  const hsPercent = totalShots > 0 ? Math.round((totalHeadshots / totalShots) * 100) : 0
  const damagePerRound = totalRounds > 0 ? Math.round(totalDamage / totalRounds) : 0
  const killsPerRound = totalRounds > 0 ? (totalKills / totalRounds).toFixed(2) : 0

  

  return (
    <div>
      <h1>{account.name}#{account.tag}</h1>
      <p>Região: {account.region.toUpperCase()} · Nível: {account.account_level}</p>

      <h2>Visão Geral</h2>

      <p>Rank Atual: {mmr.current_data?.currenttierpatched} — {mmr.current_data?.ranking_in_tier} RR</p>
      <p>Peak: {mmr.highest_rank?.patched_tier} ({mmr.highest_rank?.season})</p>
      <p>Vitórias: {wins}</p>
      <p>Derrotas: {losses}</p>
      <p>Win%: {winPercent}%</p>
      <p>K/D Ratio: {kd}</p>
      <p>Kills: {totalKills}</p>
      <p>Deaths: {totalDeaths}</p>
      <p>Assists: {totalAssists}</p>
      <p>Kills/Round: {killsPerRound}</p>
      <p>Headshot: {hsPercent}%</p>
      <p>Dano/Round: {damagePerRound}</p>
      <p>ACS: {ACS}</p>
      <p>KAST: {KAST}</p>
      <p>KAD Ratio: {KAD}</p>
      <p>DDΔ/Round: {DDdelta}</p>
      <p>First Bloods: {firstBloods}</p>
      <p>Flawless Rounds: {flawlessRounds}</p>
      <p>Aces: {aces}</p>

      <h2>Histórico de Partidas</h2>
      {matches.map(match => {
        const me = match.players.all_players.find(p => p.puuid === myPuuid)
        const myTeam = me.team.toLowerCase()
        const venceu = match.teams[myTeam].has_won

        return (
          <div key={match.metadata.matchid}>
            <p>
              {match.metadata.map} — {me.character} —
              {me.stats.kills}/{me.stats.deaths}/{me.stats.assists} —
              {venceu ? ' Vitória' : ' Derrota'}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export default Player