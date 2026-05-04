import { Link, useLocation } from "react-router-dom"

export function Navbar() {
  const location = useLocation()

  // Função para verificar se o link atual é a página ativa
  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/95 backdrop-blur-sm text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center  gap-2">
          <span className="text-2xl font-bold tracking-tight ">
            <span className="text-red-500">Valorant</span>
            <span> Tracker</span>
          </span>
        </Link>

        {/* LINKS DE NAVEGAÇÃO */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className={`text-base font-medium transition-colors hover:text-red-400 ${
              isActive("/") ? "text-red-500" : "text-gray-400"
            }`}
          >
            Início
          </Link>
          <Link
            to="/login"
            className={`text-base font-medium transition-colors hover:text-red-400 ${
              isActive("/login") ? "text-red-500" : "text-gray-400"
            }`}
          >
            Entrar
          </Link>
        </div>
        
      </div>
    </nav>
  )
}