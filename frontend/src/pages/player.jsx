import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

function Player() {
  const {nome, tag} = useParams()
  const [playerData, setPlayerData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)
  const [isFavorito, setIsFavorito] = useState(false)
  const [favId, setFavId] = useState(null)

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

  // FAVORITO FAVORITO FAVORITO
  useEffect(() => {
    async function checarFavorito() {
      const token = localStorage.getItem("token")
      if (!token) return // Se não estiver logado, nem checa

      try {
        const res = await axios.get("http://localhost:3000/api/favorites", {
          headers: { Authorization: `Bearer ${token}` }
        })
        const listaFavoritos = res.data.data || []
        
        // Procura na lista do banco se o jogador atual está lá
        const favoritoEncontrado = listaFavoritos.find(
          (fav) => fav.riot_name.toLowerCase() === nome.toLowerCase() && fav.riot_tag.toLowerCase() === tag.toLowerCase()
        )

        if (favoritoEncontrado) {
          setIsFavorito(true)
          setFavId(favoritoEncontrado.id) // Salva o ID do banco para poder deletar depois
        }
      } catch (err) {
        console.error("Erro ao checar favoritos", err)
      }
    }
    checarFavorito()
  }, [nome, tag])

  // --- NOVA FUNÇÃO: FAVORITAR / DESFAVORITAR ---
  async function handleToggleFavorito() {
    const token = localStorage.getItem("token")
    if (!token) {
      alert("Você precisa fazer login para favoritar jogadores!")
      return
    }

    try {
      if (isFavorito) {
        // Se já é favorito, envia o DELETE
        await axios.delete(`http://localhost:3000/api/favorites/${favId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setIsFavorito(false)
        setFavId(null)
      } else {
        // Se não é favorito, envia o POST
        await axios.post("http://localhost:3000/api/favorites", 
          { riot_name: nome, riot_tag: tag }, 
          { headers: { Authorization: `Bearer ${token}` } }
        )
        // Recarrega a página para o useEffect rodar novamente e pegar o ID gerado no banco
        window.location.reload() 
      }
    } catch (err) {
      console.error("Erro ao favoritar", err)
    }
  }

  if (loading) return <div className="p-8">Carregando...</div>
  if (erro) return <div className="text-red-400 p-8">{erro}</div>
  if (!playerData) return <div className="p-8">Carregando...</div>
  
  const jogador = playerData.jogador
  const stats = playerData.stats
  const partidas = playerData.partidas || []

  // ==========================================
  // INÍCIO DO TESTE DE DEBUG FRONT X BACK
  // ==========================================
  console.log("==========================================");
  console.log("🕵️ TESTE FRONTEND VS BACKEND: RESULTADOS");
  console.log("==========================================");
  partidas.forEach((partida, index) => {
    console.log(`Partida ${index + 1} | Mapa: ${partida.mapa} | KDA: ${partida.kills}/${partida.deaths}/${partida.assists} | 🚨 O BACKEND ENVIOU: "${partida.resultado}"`);
  });
  console.log("==========================================");
  // ==========================================

  return (
    <div className="pl-20 py-10">
      {/* --- NOVO CABEÇALHO DO JOGADOR COM O BOTÃO DE FAVORITO --- */}
      <div className="flex items-center gap-6 mb-4">
        <h1 className="text-3xl font-bold">{jogador.riot_name}#{jogador.riot_tag}</h1>
        
        <button 
          onClick={handleToggleFavorito}
          className={`px-4 py-2 rounded-lg font-bold transition-colors ${
            isFavorito 
              ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-500' 
              : 'bg-yellow-500 hover:bg-yellow-400 text-black'
          }`}
        >
          {isFavorito ? '★ Remover Favorito' : '☆ Favoritar'}
        </button>
      </div>
      
      <p>Rank: {jogador.rank}</p>

      <h2>Visão Geral</h2>
      <p>Vitórias: {stats.vitorias}</p>
      <p>Derrotas: {stats.derrotas}</p>
      <p>Win%: {stats.winrate}</p>
      <p>K/D Ratio: {stats.kdr_geral}</p>
      <p>Kills: {stats.kills_totais}</p>
      <p>Deaths: {stats.deaths_totais}</p>
      <p>Assists: {stats.assists_totais}</p>
      <p>First Bloods: {stats.first_bloods_totais ?? '—'}</p>
      <p>Aces: {stats.aces_totais ?? '—'}</p>

      <h2>Histórico de Partidas</h2>
      {partidas.map((partida, index) => (
        <div key={index}>
          <p>
            {partida.mapa} — {partida.agente} —
            {partida.kills}/{partida.deaths}/{partida.assists} —
            <strong>{partida.resultado}</strong>
          </p>
        </div>
      ))}
    </div>
  )
}

export default Player