function MatchCard({ partida, agentImages }) {
  const venceu = partida.resultado === 'Vitória'

  return (
    <div className={`flex items-center gap-4 px-6 py-4 border-l-4 ${venceu ? 'border-green-500' : 'border-red-500'}`}>
      {agentImages[partida.agente] ? (
        <img
          src={agentImages[partida.agente]}
          alt={partida.agente}
          className="w-12 h-12 rounded-lg bg-gray-700 flex-shrink-0"
        />
      ) : (
        <div className="w-12 h-12 rounded-lg bg-gray-700 flex-shrink-0 flex items-center justify-center text-gray-500 text-xs">
          {partida.agente?.[0]}
        </div>
      )}

      <div className="flex-1">
        <p className="font-bold">{partida.mapa}</p>
        <p className="text-gray-400 text-sm">{partida.agente} · {partida.modo}</p>
      </div>

      <div className="text-center">
        <p className="font-bold">{partida.kills}/{partida.deaths}/{partida.assists}</p>
        <p className="text-gray-400 text-xs">KDA</p>
      </div>

      <div className="text-center">
        <p className="font-bold">{partida.kdr}</p>
        <p className="text-gray-400 text-xs">K/D</p>
      </div>

      <div className="text-center">
        <p className="font-bold">{partida.acs ?? '—'}</p>
        <p className="text-gray-400 text-xs">ACS</p>
      </div>

      <div className="text-center">
        <p className="font-bold">{partida.headshot_percent ?? '—'}%</p>
        <p className="text-gray-400 text-xs">HS%</p>
      </div>

      <div className="text-center">
        <p className="font-bold">{partida.first_bloods ?? '—'}</p>
        <p className="text-gray-400 text-xs">FB</p>
      </div>

      <div className="text-right min-w-16">
        <span className={`font-bold text-sm ${venceu ? 'text-green-400' : 'text-red-400'}`}>
          {partida.resultado}
        </span>
      </div>
    </div>
  )
}

export default MatchCard