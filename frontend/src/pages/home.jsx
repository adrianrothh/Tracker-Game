import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

export default function Home() {
  const [nome, setNome] = useState("")
  const [tag, setTag] = useState("")
  const [msg, setMsg] = useState("")
  const navigate = useNavigate()

  function handleBuscar(e) {
    e.preventDefault()
    if (!nome || !tag) {
      setMsg("Preencha o nome e a tag (#)")
      return
    }
    navigate(`/player/${nome}/${tag}`)
  }

  return (
    <div className="relative min-h-screen bg-gray-950 text-white">
      
      {/* TEXTURA DE FUNDO INFINITA */}
      <div 
        className="fixed inset-0 opacity-3 pointer-events-none z-0" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '60px 60px'
        }} 
      />

      {/* CONTEÚDO */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-start text-center px-4 py-30 overflow-x-hidden">

        <div className="flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Acompanhe suas{" "}
            <span className="text-red-500">estatísticas</span>
            <br />
            de Valorant
          </h1>

          <p className="max-w-2xl text-gray-400 mb-10 text-lg">
            Busque qualquer jogador por Riot ID e veja estatísticas detalhadas,
            histórico de partidas e evolução completa.
          </p>

          {/* SEARCH */}
          <form onSubmit={handleBuscar} className="flex flex-col sm:flex-row gap-3 w-full max-w-xl">
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
            />
            <input
              type="text"
              placeholder="Tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-28 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
            />
            <button className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg font-semibold transition-colors">
              Buscar
            </button>
          </form>

          {msg && <p className="text-red-400 mt-3 text-sm font-medium">{msg}</p>}

          {/* FEATURES */}
          <div className="mt-20 grid gap-6 sm:grid-cols-3 w-full max-w-5xl">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-xl text-center">
              <div className="mb-3 text-2xl flex justify-center">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              
              <h3 className="font-semibold mb-1">Estatísticas Detalhadas</h3>
              <p className="text-sm text-gray-400">
                K/D, ACS, HS%, Win Rate e mais
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-xl text-center">
              <div className="mb-3 text-2xl flex justify-center">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h3 className="font-semibold mb-1">Histórico de Partidas</h3>
              <p className="text-sm text-gray-400">
                Veja suas partidas recentes
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-xl text-center">
              <div className="mb-3 text-2xl flex justify-center">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              </div>
              
              <h3 className="font-semibold mb-1">Ranks e Progressão</h3>
              <p className="text-sm text-gray-400">
                Acompanhe seu rank e evolução
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}