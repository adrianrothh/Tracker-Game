function PlayerHeader({ jogador, isFavorito, handleToggleFavorito }) {
  return (
    <div className="bg-gray-900 border-b border-gray-800 px-8 py-6">
      <div className="max-w-5xl mx-auto flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gray-700 flex-shrink-0" />

        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {jogador.riot_name}
            <span className="text-gray-400 font-normal">#{jogador.riot_tag}</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">{jogador.rank}</p>
        </div>

        <button
          onClick={handleToggleFavorito}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
            isFavorito
              ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600'
              : 'bg-yellow-500 hover:bg-yellow-400 text-black'
          }`}
        >
          {isFavorito ? '★ Remover' : '☆ Favoritar'}
        </button>
      </div>
    </div>
  )
}

export default PlayerHeader