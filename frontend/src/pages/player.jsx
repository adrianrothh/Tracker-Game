import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

function Player() {
  const { nome, tag } = useParams()
  const [playerData, setPlayerData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    async function buscar() {
      try {
        const res = await axios.get(`http://localhost:3000/api/player/na/${nome}/${tag}`)
        setPlayerData(res.data.data)
      } catch (err) {
        setErro("Jogador não encontrado")
      } finally {
        setLoading(false)
      }
    }
    buscar()
  }, [nome, tag])

  if (loading) return <div className="p-8">Carregando...</div>
  if (erro) return <div className="text-red-400 p-8">{erro}</div>
  if (!playerData) return <div className="p-8">Carregando...</div>
  console.log("playerData completo:", playerData)

  const jogador = playerData.jogador
  const stats = playerData.stats
  const partidas = playerData.partidas || []

  return (
    <div>
      <h1>{jogador.riot_name}#{jogador.riot_tag}</h1>
      <p>Rank: {jogador.rank}</p>

      <h2>Visão Geral</h2>
      <p>Vitórias: {stats.vitorias}</p>
      <p>Derrotas: {stats.derrotas}</p>
      <p>Win%: {stats.winrate}</p>
      <p>K/D Ratio: {stats.kdr_geral}</p>
      <p>Kills: {stats.kills_totais}</p>
      <p>Deaths: {stats.deaths_totais}</p>
      <p>Assists: {stats.assists_totais}</p>
      <p>KAST: {stats.kast ?? '—'}</p>
      <p>First Bloods: {stats.first_bloods ?? '—'}</p>
      <p>Flawless Rounds: {stats.flawless_rounds ?? '—'}</p>
      <p>Aces: {stats.aces ?? '—'}</p>

      <h2>Histórico de Partidas</h2>
      {partidas.map((partida, index) => (
        <div key={index}>
          <p>
            {partida.mapa} — {partida.agente} —
            {partida.kills}/{partida.deaths}/{partida.assists} —
            {partida.resultado}
          </p>
        </div>
      ))}
    </div>
  )
}

export default Player