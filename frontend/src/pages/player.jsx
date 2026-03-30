import accountData from '../mocks/account.json'
import mmrData from '../mocks/mmr.json'
import matchesData from '../mocks/matches.json'

function Player() {
  const account = accountData.data
  const mmr = mmrData.data
  const matches = matchesData.data
  const myPuuid = account.puuid

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

      <p>Rank Atual: {mmr.current.tier.name} — {mmr.current.rr} RR</p>
      <p>Peak: {mmr.peak.tier.name} ({mmr.peak.season.short.toUpperCase()})</p>
      <p>Vitórias: {wins}</p>
      <p>Derrotas: {losses}</p>
      <p>Win%: {winPercent}%</p>
      <p>K/D Ratio: {kd}</p>
      <p>Kills: {totalKills}</p>
      <p>Deaths: {totalDeaths}</p>
      <p>Assists: {totalAssists}</p>
      <p>Kills/Round: {killsPerRound}</p>
      <p>Headshot%: {hsPercent}%</p>
      <p>Dano/Round: {damagePerRound}</p>
      <p>ACS: {ACS}</p>
      <p>KAST: -</p>
      <p>KAD Ratio: {KAD}</p>
      <p>DDΔ/Round: {DDdelta}</p>
      <p>First Bloods: —</p>
      <p>Flawless Rounds: —</p>
      <p>Aces: —</p>

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