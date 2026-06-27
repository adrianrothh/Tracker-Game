function PlayerHeader({ jogador, rankIcon, isFavorito, handleToggleFavorito }) {
  const avatarUrl =
    jogador.avatar ||
    jogador.card_url ||
    jogador.card?.small ||
    jogador.card?.large ||
    jogador.card?.wide ||
    null;

  console.log("CARD NO HEADER:", jogador.card);
  console.log("AVATAR URL:", avatarUrl);

  return (
    <header className="">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 via-gray-950 to-black p-6 shadow-xl shadow-black/30">
          {/* Glow decorativo */}
          <div className="absolute -top-20 -right-20 h-52 w-52 rounded-full bg-red-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-red-950/30 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              {/* Avatar / Player Card */}
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-gray-700 bg-gray-900">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={jogador.riot_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-800 to-gray-950 text-3xl font-bold text-gray-500">
                    {jogador.riot_name?.[0]?.toUpperCase() || "?"}
                  </div>
                )}

                <div className="absolute inset-0 ring-1 ring-white/5" />
              </div>

              <div>
                <h1 className="text-3xl font-black tracking-tight text-white">
                  {jogador.riot_name}
                  <span className="font-semibold text-gray-500">
                    #{jogador.riot_tag}
                  </span>
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 rounded-xl border border-gray-800 bg-black/40 px-3 py-2">
                    {rankIcon ? (
                      <img
                        src={rankIcon}
                        alt={jogador.rank || "Rank"}
                        className="h-7 w-7 object-contain"
                      />
                    ) : (
                      <div className="h-7 w-7 rounded-md bg-gray-800" />
                    )}

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500">
                        Rank atual
                      </p>
                      <p className="text-sm font-bold text-gray-200">
                        {jogador.rank || "Rank indisponível"}
                      </p>
                    </div>
                  </div>

                  {jogador.atualizado_em && (
                    <div className="rounded-xl border border-gray-800 bg-black/40 px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wider text-gray-500">
                        Atualizado
                      </p>
                      <p className="text-sm font-medium text-gray-300">
                        {new Date(jogador.atualizado_em).toLocaleDateString(
                          "pt-BR",
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleToggleFavorito}
              className={`rounded-xl px-5 py-3 text-sm font-bold transition-all ${
                isFavorito
                  ? "border border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
                  : "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20"
              }`}
            >
              {isFavorito ? "★ Remover favorito" : "☆ Favoritar jogador"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default PlayerHeader;
