import { useState } from "react";

export default function Cadastrar() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

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
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message || "Erro ao cadastrar");
        return;
      }

      setMsg("Cadastro realizado com sucesso!");
      setNome("");
      setEmail("");
      setSenha("");

    } catch (err) {
      setMsg("Erro ao conectar com o servidor");
    }
  }

  return (
  <div className="min-h-screen bg-gray-800 flex items-center justify-center">
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 w-full max-w-md">
      <h2 className="text-white text-2xl font-bold mb-6 text-center">Criar conta</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition"
        >
          Cadastrar
        </button>
      </form>

      {msg && (
        <p className={`mt-4 text-center text-sm ${msg.includes("sucesso") ? "text-green-400" : "text-red-400"}`}>
          {msg}
        </p>
      )}
    </div>
  </div>
)
}