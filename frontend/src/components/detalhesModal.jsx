function DetalhesModal({
  partida,
  detalhes,
  loading,
  onClose,
  agentImages = {},
  rankIcons = {},
  mapImages = {},
  jogador = null,
}) {
  if (!partida) return null;

  const dados = detalhes?.detalhes;
  const players = dados?.players || [];

  const redTeam = dados?.teams?.red;
  const blueTeam = dados?.teams?.blue;

  const roundsPlayed = dados?.metadata?.rounds_played || 1;
  const mapName = partida.mapa || dados?.metadata?.map;

  const mapImage =
    mapImages[mapName] ||
    mapImages[mapName?.trim()] ||
    Object.entries(mapImages).find(
      ([nome]) => nome.toLowerCase() === mapName?.toLowerCase(),
    )?.[1];

  const dataPartida = partida.data_partida
    ? new Date(partida.data_partida).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const redPlayers = ordenarPorAcs(
    players.filter((player) => player.team === "Red"),
    roundsPlayed,
  );

  const bluePlayers = ordenarPorAcs(
    players.filter((player) => player.team === "Blue"),
    roundsPlayed,
  );

  const timeA = {
    label: "Time A",
    players: redPlayers,
    rounds: redTeam?.rounds_won ?? "—",
    won: redTeam?.has_won === true,
  };

  const timeB = {
    label: "Time B",
    players: bluePlayers,
    rounds: blueTeam?.rounds_won ?? "—",
    won: blueTeam?.has_won === true,
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 backdrop-blur-[2px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-7xl overflow-y-auto rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl shadow-black/40"
      >
        {/* Fundo sutil do mapa */}
        {mapImage && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
            <img
              src={mapImage}
              alt={mapName}
              className="h-full w-full object-cover opacity-[0.28]"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 via-gray-900/70 to-gray-900" />
          </div>
        )}

        <div className="relative z-10">
          {/* Header */}
          <div className="sticky top-0 z-20 border-b border-gray-700 bg-gray-900/90 px-6 py-5 backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-gray-700 bg-black/30 px-3 py-1 text-xs text-gray-300">
                    {partida.modo || "Competitive"}
                  </span>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                      partida.resultado === "Vitória"
                        ? "border-green-500/30 bg-green-500/10 text-green-300"
                        : partida.resultado === "Empate"
                          ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
                          : "border-red-500/30 bg-red-500/10 text-red-300"
                    }`}
                  >
                    {partida.resultado}
                  </span>
                </div>

                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  {mapName || "Mapa desconhecido"}
                </h2>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-400">
                  <span>{partida.agente || "Agente"}</span>

                  {dataPartida && (
                    <>
                      <span className="text-gray-600">•</span>
                      <span>{dataPartida}</span>
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={onClose}
                className="rounded-xl border border-gray-700 bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-80 items-center justify-center">
              <p className="text-gray-300">Carregando detalhes da partida...</p>
            </div>
          ) : !dados ? (
            <div className="flex min-h-80 items-center justify-center px-6 text-center">
              <div>
                <p className="font-semibold text-gray-200">
                  Detalhes da partida não encontrados.
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Atualize o jogador para salvar os detalhes dessa partida.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 p-6">
              {/* Placar */}
              <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_1fr]">
                <ScoreCard time={timeA} />

                <div className="flex min-w-40 items-center justify-center rounded-xl border border-gray-700 bg-black/25 px-5 py-3">
                  <div className="text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                      Placar
                    </p>

                    <p className="mt-0.5 text-2xl font-semibold tracking-tight text-white">
                      {timeA.rounds} - {timeB.rounds}
                    </p>

                    <p className="mt-0.5 text-xs text-gray-400">
                      {roundsPlayed} rounds
                    </p>
                  </div>
                </div>

                <ScoreCard time={timeB} />
              </div>

              {/* Times */}
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <TeamTable
                  time={timeA}
                  roundsPlayed={roundsPlayed}
                  agentImages={agentImages}
                  rankIcons={rankIcons}
                  jogador={jogador}
                  resultado={partida.resultado}
                />

                <TeamTable
                  time={timeB}
                  roundsPlayed={roundsPlayed}
                  agentImages={agentImages}
                  rankIcons={rankIcons}
                  jogador={jogador}
                  resultado={partida.resultado}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ScoreCard({ time }) {
  const classes = time.won
    ? "border-green-500/30 bg-green-500/10 text-green-300"
    : "border-red-500/30 bg-red-500/10 text-red-300";

  return (
    <div className={`rounded-xl border px-4 py-3 ${classes}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-80">
            {time.label}
          </p>

          <p className="mt-0.5 text-2xl font-semibold tracking-tight">
            {time.rounds}
          </p>
        </div>

        <span className="rounded-full border border-current px-2.5 py-1 text-[10px] font-semibold">
          {time.won ? "Venceu" : "Perdeu"}
        </span>
      </div>
    </div>
  );
}

function TeamTable({
  time,
  roundsPlayed,
  agentImages,
  rankIcons,
  jogador,
  resultado,
}) {
  const titleColor = time.won ? "text-green-300" : "text-red-300";
  const borderColor = time.won ? "border-green-500/30" : "border-red-500/30";

  const destaqueJogador =
    resultado === "Empate"
      ? {
          linha:
            "bg-yellow-500/10 ring-1 ring-inset ring-yellow-500/40 hover:bg-yellow-500/15",
          badge: "border-yellow-500/40 bg-yellow-500/10 text-yellow-300",
        }
      : time.won
        ? {
            linha:
              "bg-green-500/10 ring-1 ring-inset ring-green-500/40 hover:bg-green-500/15",
            badge: "border-green-500/40 bg-green-500/10 text-green-300",
          }
        : {
            linha:
              "bg-red-500/10 ring-1 ring-inset ring-red-500/40 hover:bg-red-500/15",
            badge: "border-red-500/40 bg-red-500/10 text-red-300",
          };

  return (
    <div
      className={`overflow-hidden rounded-2xl border ${borderColor} bg-black/20`}
    >
      <div className="border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className={`font-semibold tracking-tight ${titleColor}`}>
            {time.label}
          </h3>

          <span className={`text-xs font-semibold ${titleColor}`}>
            {time.won ? "Vencedor" : "Perdedor"}
          </span>
        </div>
      </div>

      <div className="divide-y divide-gray-800">
        {time.players.map((player) => {
          const kills = player.stats?.kills || 0;
          const deaths = player.stats?.deaths || 0;
          const assists = player.stats?.assists || 0;

          const acs = calcAcs(player, roundsPlayed);
          const ddeltaPorRound = calcDdeltaPorRound(player, roundsPlayed);
          const hs = calcHeadshotPercent(player);

          const agentIcon = agentImages[player.character];

          const rankIcon = player.currenttier_patched
            ? rankIcons[player.currenttier_patched.toLowerCase()]
            : null;

          const isJogadorPesquisado =
            jogador?.puuid && player.puuid
              ? player.puuid === jogador.puuid
              : player.name?.toLowerCase() ===
                  jogador?.riot_name?.toLowerCase() &&
                player.tag?.toLowerCase() === jogador?.riot_tag?.toLowerCase();

          return (
            <div
              key={player.puuid}
              className={`grid grid-cols-[1fr_auto] gap-4 px-4 py-3 transition-colors ${
                isJogadorPesquisado
                  ? destaqueJogador.linha
                  : "hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-700 bg-gray-800">
                  {agentIcon ? (
                    <img
                      src={agentIcon}
                      alt={player.character}
                      className="h-full w-full object-contain scale-100"
                    />
                  ) : (
                    <span className="text-xs font-semibold text-gray-500">
                      {player.character?.[0] || "?"}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-white">
                    {player.name}
                    <span className="font-normal text-gray-500">
                      #{player.tag}
                    </span>

                    {isJogadorPesquisado && (
                      <span
                        className={`ml-2 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${destaqueJogador.badge}`}
                      >
                        Você
                      </span>
                    )}
                  </p>

                  <div className="mt-0.5 flex min-w-0 items-center gap-2 text-xs text-gray-500">
                    <span className="truncate">
                      {player.character || "Agente"}
                    </span>

                    <span>·</span>

                    <span className="flex min-w-0 items-center gap-1 truncate">
                      {rankIcon && (
                        <img
                          src={rankIcon}
                          alt={player.currenttier_patched}
                          className="h-4 w-4 flex-shrink-0 object-contain"
                        />
                      )}

                      <span className="truncate">
                        {player.currenttier_patched || "Rank indisponível"}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 text-right text-sm">
                <MiniValue
                  label="K/D/A"
                  value={`${kills}/${deaths}/${assists}`}
                />
                <MiniValue label="ACS" value={acs} />
                <MiniValue label="DDΔ/R" value={ddeltaPorRound} />
                <MiniValue label="HS%" value={`${hs}%`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MiniValue({ label, value }) {
  return (
    <div>
      <p className="font-semibold text-white">{value}</p>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-600">
        {label}
      </p>
    </div>
  );
}

function calcAcs(player, roundsPlayed) {
  const score = player.stats?.score || 0;

  return score > 0 && roundsPlayed > 0 ? Math.round(score / roundsPlayed) : 0;
}

function calcDdeltaPorRound(player, roundsPlayed) {
  const damageMade = player.damage_made || 0;
  const damageReceived = player.damage_received || 0;

  if (roundsPlayed <= 0) return "0.00";

  const delta = (damageMade - damageReceived) / roundsPlayed;
  const formatado = delta.toFixed(2);

  return delta > 0 ? `+${formatado}` : formatado;
}

function calcHeadshotPercent(player) {
  const headshots = player.stats?.headshots || 0;
  const bodyshots = player.stats?.bodyshots || 0;
  const legshots = player.stats?.legshots || 0;

  const totalShots = headshots + bodyshots + legshots;

  return totalShots > 0 ? ((headshots / totalShots) * 100).toFixed(1) : "0.0";
}

function ordenarPorAcs(players, roundsPlayed) {
  return [...players].sort((a, b) => {
    return calcAcs(b, roundsPlayed) - calcAcs(a, roundsPlayed);
  });
}

export default DetalhesModal;
