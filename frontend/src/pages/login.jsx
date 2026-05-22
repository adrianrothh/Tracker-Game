import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

export default function Login() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [msg, setMsg] = useState("")
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      })

      const data = await res.json()

      console.log("Resposta do Login:", data);

      if (!res.ok) {
        setMsg(data.message || "Erro ao fazer login")
        return
      }

      // 1. Caminho corrigido para puxar o token do lugar certo:
      localStorage.setItem("token", data.data.token) 
      
      // 2. Redirecionamento reativado (sem as barras //):
      navigate("/home")

    } catch (err) {
      setMsg("Erro ao conectar com o servidor")
    }
  }

  return (
    <div className="relative min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">

      <div className="relative z-10 w-full max-w-md">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Entrar na sua conta
          </h1>
          <p className="text-gray-400">
            Acesse suas estatísticas e histórico
          </p>
        </div>

        {/* CARD */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 sm:p-8"
        >
          <div className="flex flex-col gap-4">

            {/* EMAIL */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white">
                Email
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* SENHA */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white">
                Senha
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 py-3 rounded-lg font-semibold transition-colors"
            >
              Entrar
            </button>
          </div>

          {/* CRIAR CONTA */}
          <div className="mt-6 text-center text-sm text-gray-400">
            Não tem uma conta?{" "}
            <Link
              to="/cadastro"
              className="font-medium text-red-500 hover:underline"
            >
              Criar conta
            </Link>
          </div>

          {/* MESSAGE */}
          {msg && (
            <p className="text-red-400 mt-4 text-sm text-center font-medium">
              {msg}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}