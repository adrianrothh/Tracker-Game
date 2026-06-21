import Tooltip from "./tooltip"

function StatCard({ titulo, valor, cor = "text-white", subtitulo, tooltip }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-950/80 p-5 text-center shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5 hover:border-gray-700 hover:bg-gray-900/90">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute -top-10 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full bg-red-500/5 blur-2xl transition-opacity group-hover:opacity-100" />

      <div className="relative z-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
          {tooltip ? (
            <Tooltip text={tooltip}>
              <span className="border-b border-dotted border-gray-600">
                {titulo}
              </span>
            </Tooltip>
          ) : (
            titulo
          )}
        </p>

        <p className={`text-2xl font-black tracking-tight ${cor}`}>
          {valor ?? "—"}
        </p>

        {subtitulo && (
          <p className="mt-1 text-sm text-gray-400">
            {subtitulo}
          </p>
        )}
      </div>
    </div>
  )
}

export default StatCard