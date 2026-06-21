import Tooltip from "./tooltip"

function MatchCard({ partida, agentImages }) {
  const getResultadoStyle = (resultado) => {
    if (resultado === "Vitória") {
      return {
        label: "Vitória",
        text: "text-green-400",
        border: "border-green-500/40",
        bg: "from-green-500/15 via-gray-950 to-gray-950",
        badge: "border-green-500/30 bg-green-500/10 text-green-300",
        glow: "bg-green-500/10",
      }
    }

    if (resultado === "Empate") {
      return {
        label: "Empate",
        text: "text-yellow-400",
        border: "border-yellow-500/40",
        bg: "from-yellow-500/15 via-gray-950 to-gray-950",
        badge: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
        glow: "bg-yellow-500/10",
      }
    }

    return {
      label: "Derrota",
      text: "text-red-400",
      border: "border-red-500/40",
      bg: "from-red-500/15 via-gray-950 to-gray-950",
      badge: "border-red-500/30 bg-red-500/10 text-red-300",
      glow: "bg-red-500/10",
    }
  }

  const resultadoStyle = getResultadoStyle(partida.resultado)
  const agentImage = agentImages[partida.agente]

  return (
    <article className="group relative overflow-visible">
      <div
        className={`relative overflow-visible rounded-2xl border ${resultadoStyle.border} bg-gradient-to-br ${resultadoStyle.bg} p-3 transition-all hover:-translate-y-0.5 hover:border-gray-600 hover:shadow-xl hover:shadow-black/30`}
      >
        {/* glow decorativo */}
        <div
          className={`pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full ${resultadoStyle.glow} blur-3xl transition-opacity group-hover:opacity-100`}
        />

        <div className="relative z-10 flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* agente + partida */}
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
              {agentImage ? (
                <img
                  src={agentImage}
                  alt={partida.agente}
                  className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-black text-gray-500">
                  {partida.agente?.[0] || "?"}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold ${resultadoStyle.badge}`}
                >
                  {resultadoStyle.label}
                </span>

                <span className="rounded-full border border-gray-800 bg-black/30 px-3 py-1 text-xs text-gray-400">
                  {partida.modo || "Competitive"}
                </span>
              </div>

              <h3 className="truncate text-xl font-black text-white">
                {partida.mapa || "Mapa desconhecido"}
              </h3>

              <p className="mt-1 truncate text-sm text-gray-400">
                Jogando de{" "}
                <span className="font-semibold text-gray-300">
                  {partida.agente || "Agente"}
                </span>
              </p>
            </div>
          </div>

          {/* estatísticas */}
          <div className="relative z-20 grid grid-cols-2 gap-3 overflow-visible sm:grid-cols-5 lg:min-w-[560px]">
            <MiniStat
              label="KDA"
              value={`${partida.kills}/${partida.deaths}/${partida.assists}`}
              tooltip="Abates, Mortes e Assistências nessa partida."
            />

            <MiniStat
              label="K/D"
              value={partida.kdr ?? "—"}
              tooltip="Média de Abates por Morte nessa partida."
            />

            <MiniStat
              label="ACS"
              value={partida.acs ?? "—"}
              tooltip="Pontuação de Combate nessa partida."
            />

            <MiniStat
              label="HS%"
              value={`${partida.headshot_percent ?? "—"}%`}
              tooltip="Porcentagem de tiros na cabeça nessa partida."
            />

            <MiniStat
              label="FB"
              value={partida.first_bloods ?? "—"}
              tooltip="Quantidade de primeiros abates nessa partida."
            />
          </div>
        </div>
      </div>
    </article>
  )
}

function MiniStat({ label, value, tooltip }) {
  return (
    <div className="relative overflow-visible rounded-xl border border-gray-800 bg-black/25 px-3 py-3 text-center">
      <p className="text-sm font-black text-white">{value}</p>

      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500">
        {tooltip ? (
          <Tooltip text={tooltip}>
            <span className="border-b border-dotted border-gray-600">
              {label}
            </span>
          </Tooltip>
        ) : (
          label
        )}
      </p>
    </div>
  )
}

export default MatchCard