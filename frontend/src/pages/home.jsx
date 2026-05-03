import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Home() {
  const [nome, setNome] = useState("")
  const [tag, setTag] = useState("")
  const [msg, setMsg] = useState("")
  const navigate = useNavigate()

  function handleBuscar(e) {
    e.preventDefault()
    if (!nome || !tag) {
      setMsg("Preencha o nome e a tag")
      return
    }
    navigate(`/player/${nome}/${tag}`)
  }

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h1 className="text-white text-4xl font-bold mb-2">Valorant Tracker</h1>
        <p className="text-gray-400">Acompanhe suas estatísticas e evolução no Valorant</p>
      </div>

      <form onSubmit={handleBuscar} className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Nome (ex: MIBR aspas)"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          placeholder="Tag (ex: naxy)"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition"
        >
          Buscar Jogador
        </button>
      </form>

      {msg && <p className="text-red-400 text-sm">{msg}</p>}

      <div className="flex gap-4 mt-4">
        <a href="/login" className="text-gray-400 hover:text-white text-sm transition">Entrar</a>
        <a href="/cadastro" className="text-gray-400 hover:text-white text-sm transition">Criar conta</a>
      </div>
    </div>
  )
}