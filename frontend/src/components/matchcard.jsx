import Tooltip from "./tooltip";

function MatchCard({ partida, agentImages, onClick }) {
  const getResultadoStyle = (resultado) => {
    if (resultado === "Vitória") {
      return {
        label: "Vitória",
        indicator: "bg-green-500",
        badge: "border-green-500/30 bg-green-500/10 text-green-300",
      };
    }

    if (resultado === "Empate") {
      return {
        label: "Empate",
        indicator: "bg-yellow-500",
        badge: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
      };
    }

    return {
      label: "Derrota",
      indicator: "bg-red-500",
      badge: "border-red-500/30 bg-red-500/10 text-red-300",
    };
  };

  const getKdColor = (kdr) => {
    const kd = Number(kdr);

    if (!Number.isFinite(kd)) return "text-white";
    if (kd >= 1) return "text-green-400";

    return "text-red-400";
  };

  const getDeltaColor = (valor) => {
    const delta = Number(valor);

    if (!Number.isFinite(delta)) return "text-white";
    if (delta >= 0) return "text-green-400";

    return "text-red-400";
  };

  const getScoreColor = (score) => {
    const valor = Number(score);

    if (!Number.isFinite(valor)) return "text-white";

    if (valor >= 80) return "text-blue-400";
    if (valor >= 60) return "text-green-400";
    if (valor >= 40) return "text-yellow-400";
    if (valor >= 20) return "text-orange-400";

    return "text-red-500";
  };

  const formatarNumero = (valor, casas = 2) => {
    const numero = Number(valor);

    if (!Number.isFinite(numero)) return "—";

    return numero.toFixed(casas);
  };

  const formatarDelta = (valor) => {
    const numero = Number(valor);

    if (!Number.isFinite(numero)) return "—";

    const arredondado = Math.round(numero);

    return arredondado > 0 ? `+${arredondado}` : `${arredondado}`;
  };

  const resultadoStyle = getResultadoStyle(partida.resultado);
  const agentImage = agentImages[partida.agente];
  const dataPartida = formatarDataPartida(partida.data_partida);

  const kills = Number(partida.kills || 0);
  const deaths = Number(partida.deaths || 0);
  const assists = Number(partida.assists || 0);

  const kda = `${kills}/${deaths}/${assists}`;

  const kdr = partida.kdr ?? "—";
  const kdColor = getKdColor(kdr);

  const acs = formatarNumero(partida.acs, 2);

  const ddelta =
    partida.ddelta_por_round ?? partida.ddelta ?? partida.delta_dano ?? null;

  const ddeltaFormatado = formatarDelta(ddelta);
  const ddeltaColor = getDeltaColor(ddelta);

  const performanceScore =
    partida.performance_score ??
    partida.desempenho_score ??
    partida.score_desempenho ??
    partida.performanceScore ??
    null;

  const performanceScoreFormatado =
    performanceScore !== null ? Math.round(Number(performanceScore)) : "—";

  const scoreColor =
    performanceScore !== null ? getScoreColor(performanceScore) : "text-white";

  return (
    <article
      onClick={onClick}
      className="group relative cursor-pointer overflow-visible"
    >
      <div className="relative overflow-visible rounded-2xl border border-gray-800 bg-gray-950/80 p-3 transition-all hover:-translate-y-0.5 hover:border-gray-700 hover:bg-gray-900/90 hover:shadow-xl hover:shadow-black/30">
        {/* indicador lateral */}
        <div
          className={`absolute bottom-4 left-0 top-4 w-1 rounded-r-full ${resultadoStyle.indicator}`}
        />

        <div className="relative z-10 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-4 pl-2">
            {/* agente */}
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-gray-700 bg-gray-900">
              {agentImage ? (
                <img
                  src={agentImage}
                  alt={partida.agente}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-gray-500">
                  {partida.agente?.[0] || "?"}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${resultadoStyle.badge}`}
                >
                  {resultadoStyle.label}
                </span>

                <span className="rounded-full border border-gray-800 bg-black/30 px-3 py-1 text-xs text-gray-400">
                  {partida.modo || "Competitive"}
                </span>
              </div>

              <h3 className="truncate text-xl font-semibold tracking-tight text-white">
                {partida.mapa || "Mapa desconhecido"}
              </h3>

              <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                <span className="truncate">{partida.agente || "Agente"}</span>

                {dataPartida && (
                  <>
                    <span className="text-gray-700">•</span>
                    <span>{dataPartida}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* estatísticas */}
          <div className="relative z-20 grid grid-cols-2 gap-3 overflow-visible sm:grid-cols-5 lg:min-w-[560px]">
            <MiniStat
              label="KDA"
              value={kda}
              tooltip="Abates, mortes e assistências nessa partida."
            />

            <MiniStat
              label="K/D"
              value={kdr}
              valueClassName={kdColor}
              tooltip="Abates dividido por mortes nessa partida."
            />

            <MiniStat
              label="ACS"
              value={acs}
              tooltip="Pontuação média de combate nessa partida."
            />

            <MiniStat
              label="DDΔ/R"
              value={ddeltaFormatado}
              valueClassName={ddeltaColor}
              tooltip="Delta de dano por round: dano causado menos dano recebido, dividido pelos rounds jogados."
            />

            <MiniStat
              label="Score"
              value={performanceScoreFormatado}
              valueClassName={scoreColor}
              tooltip="Nota de desempenho da partida de 0 a 100."
            />
          </div>
        </div>
      </div>
    </article>
  );
}

function MiniStat({ label, value, tooltip, valueClassName = "text-white" }) {
  return (
    <div className="relative overflow-visible rounded-xl border border-gray-800 bg-black/25 px-3 py-3 text-center">
      <p className={`text-sm font-semibold ${valueClassName}`}>{value}</p>

      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
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
  );
}

function formatarDataPartida(data) {
  if (!data) return null;

  return new Date(data).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default MatchCard;
