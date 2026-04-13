import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Buscar() {
  const [nome, setNome] = useState("")
  const [tag, setTag] = useState("")
  const [msg, setMsg] = useState("")
  const navigate = useNavigate()

  async function handleBuscar(e) {
    e.preventDefault()

    if (!nome || !tag) {
      setMsg("Preencha o nome e a tag")
      return
    }

    navigate(`/player/${nome}/${tag}`)
  }

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 w-full max-w-md">
        <h2 className="text-white text-2xl font-bold mb-6 text-center">Buscar Jogador</h2>

        <form onSubmit={handleBuscar} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nome (ex: Gusgb4 シ)"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Tag (ex: yikes)"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            required
            className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition"
          >
            Buscar
          </button>
        </form>

        {msg && <p className="mt-4 text-center text-sm text-red-400">{msg}</p>}
      </div>
    </div>
  )
}