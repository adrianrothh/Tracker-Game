function StatCard({ titulo, valor, cor = "text-white", subtitulo }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{titulo}</p>
      <p className={`font-bold text-lg ${cor}`}>{valor ?? '—'}</p>
      {subtitulo && <p className="text-gray-400 text-sm">{subtitulo}</p>}
    </div>
  )
}

export default StatCard