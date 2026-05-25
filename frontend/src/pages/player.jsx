import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import StatCard from '../components/statcard'
import MatchCard from '../components/matchcard'
import PlayerHeader from '../components/playerheader'


function Player() {
  const {nome, tag} = useParams()
  const [playerData, setPlayerData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)
  const [isFavorito, setIsFavorito] = useState(false)
  const [favId, setFavId] = useState(null)
  const [agentImages, setAgentImages] = useState({})

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

  useEffect(() => {
    async function checarFavorito() {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        const res = await axios.get("http://localhost:3000/api/favorites", {
          headers: { Authorization: `Bearer ${token}` }
        })
        const listaFavoritos = res.data.data || []
        const favoritoEncontrado = listaFavoritos.find(
          (fav) => fav.riot_name.toLowerCase() === nome.toLowerCase() && fav.riot_tag.toLowerCase() === tag.toLowerCase()
        )
        if (favoritoEncontrado) {
          setIsFavorito(true)
          setFavId(favoritoEncontrado.id)
        }
      } catch (err) {
        console.error("Erro ao checar favoritos", err)
      }
    }
    checarFavorito()
  }, [nome, tag])

  useEffect(() => {
    async function buscarAgentes() {
      try {
        const res = await axios.get('https://valorant-api.com/v1/agents?isPlayableCharacter=true')
        const mapa = {}
        res.data.data.forEach(agente => {
          mapa[agente.displayName] = agente.displayIcon
        })
        setAgentImages(mapa)
      } catch (err) {
        console.error("Erro ao buscar imagens dos agentes", err)
      }
    }
    buscarAgentes()
  }, [])

  async function handleToggleFavorito() {
    const token = localStorage.getItem("token")
    if (!token) {
      alert("Você precisa fazer login para favoritar jogadores!")
      return
    }

    try {
      if (isFavorito) {
        await axios.delete(`http://localhost:3000/api/favorites/${favId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setIsFavorito(false)
        setFavId(null)
      } else {
        await axios.post("http://localhost:3000/api/favorites",
          { riot_name: nome, riot_tag: tag },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        window.location.reload()
      }
    } catch (err) {
      console.error("Erro ao favoritar", err)
    }
  }

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Carregando...</div>
  if (erro) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-red-400">{erro}</div>
  if (!playerData) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Carregando...</div>
  if (!playerData.jogador) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Carregando...</div>

  const jogador = playerData.jogador
  const stats = playerData.stats
  const partidas = playerData.partidas || []

  return (
  <div className="min-h-screen bg-gray-950 text-white">

    <PlayerHeader
      jogador={jogador}
      isFavorito={isFavorito}
      handleToggleFavorito={handleToggleFavorito}
    />

    <div className="max-w-5xl mx-auto px-8 py-6 flex flex-col gap-6">

      <div className="grid grid-cols-3 gap-4">
        <StatCard titulo="Vitórias / Derrotas" valor={`${stats.vitorias}W — ${stats.derrotas}L`} subtitulo={`${stats.winrate} winrate`} />
        <StatCard titulo="K/D Ratio" valor={stats.kdr_geral} cor="text-green-400" />
        <StatCard titulo="KDA" valor={`${stats.kills_totais} / ${stats.deaths_totais} / ${stats.assists_totais}`} />
        <StatCard titulo="ACS Médio" valor={stats.acs_medio} cor="text-yellow-400" />
        <StatCard titulo="Dano/Round" valor={stats.dano_por_round_medio} cor="text-orange-400" />
        <StatCard titulo="Headshot%" valor={stats.headshot_percent_medio} cor="text-blue-400" />
        <StatCard titulo="First Bloods" valor={stats.first_bloods_totais} cor="text-red-400" />
        <StatCard titulo="Aces" valor={stats.aces_totais} cor="text-purple-400" />
        <StatCard titulo="Total Partidas" valor={stats.total_partidas} />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="font-bold text-lg">Histórico de Partidas</h2>
        </div>
        <div className="flex flex-col divide-y divide-gray-800">
          {partidas.map((partida, index) => (
            <MatchCard key={index} partida={partida} agentImages={agentImages} />
          ))}
        </div>
      </div>

    </div>
  </div>
  )
}

export default Player