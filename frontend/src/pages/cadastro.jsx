import { useState } from "react"
import { Link } from "react-router-dom"

export default function Cadastrar() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [msg, setMsg] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()

    if (senha !== confirmarSenha) {
      setMsg("As senhas não coincidem")
      return
    }

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome,
          email,
          senha
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setMsg(data.message || "Erro ao cadastrar")
        return
      }

      setMsg("Cadastro realizado com sucesso!")
      setNome("")
      setEmail("")
      setSenha("")
      setConfirmarSenha("")

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
            Criar conta
          </h1>
          <p className="text-gray-400">
            Comece a acompanhar suas estatísticas
          </p>
        </div>

        {/* CARD */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 sm:p-8"
        >
          <div className="flex flex-col gap-4">

            {/* NOME */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white">Nome</label>
              <input
                type="text"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* EMAIL */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white">Email</label>
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
              <label className="text-sm font-medium text-white">Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* CONFIRMAR SENHA */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white">Confirmar senha</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
                className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 py-3 rounded-lg font-semibold transition-colors"
            >
              Criar conta
            </button>
          </div>

          {/* VOLTAR LOGIN */}
          <div className="mt-6 text-center text-sm text-gray-400">
            Já tem uma conta?{" "}
            <Link
              to="/"
              className="font-medium text-red-500 hover:underline"
            >
              Entrar
            </Link>
          </div>

          {/* MESSAGE */}
          {msg && (
            <p className={`mt-4 text-center text-sm font-medium ${
              msg.includes("sucesso") ? "text-green-400" : "text-red-400"
            }`}>
              {msg}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}