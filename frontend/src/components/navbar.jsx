import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [favoritos, setFavoritos] = useState([]);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [carregandoFavoritos, setCarregandoFavoritos] = useState(false);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const tokenAtual = localStorage.getItem("token");
    setToken(tokenAtual);

    if (tokenAtual) {
      buscarFavoritos(tokenAtual);
    } else {
      setFavoritos([]);
    }
  }, [location.pathname]);

  async function buscarFavoritos(tokenAtual = token) {
    if (!tokenAtual) return;

    try {
      setCarregandoFavoritos(true);

      const res = await api.get("/api/favorites", {
        headers: {
          Authorization: `Bearer ${tokenAtual}`,
        },
      });

      const data = res.data;

      setFavoritos(data.data || []);
    } catch (err) {
      console.error("Erro ao buscar favoritos:", err);
      setFavoritos([]);
    } finally {
      setCarregandoFavoritos(false);
    }
  }

  function abrirFavorito(favorito) {
    setDropdownAberto(false);

    navigate(
      `/player/${encodeURIComponent(favorito.riot_name)}/${encodeURIComponent(
        favorito.riot_tag,
      )}`,
    );
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    setFavoritos([]);
    setDropdownAberto(false);
    navigate("/login");
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/95 text-white backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight">
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

          {token && (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setDropdownAberto((valor) => !valor);
                  buscarFavoritos();
                }}
                className="text-base font-medium text-gray-400 transition-colors hover:text-red-400"
              >
                Favoritos ▾
              </button>

              {dropdownAberto && (
                <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-xl border border-gray-800 bg-gray-950 shadow-xl shadow-black/40">
                  <div className="border-b border-gray-800 px-4 py-3">
                    <p className="text-sm font-semibold text-white">
                      Jogadores favoritos
                    </p>
                    <p className="text-xs text-gray-500">
                      Acesse rapidamente seus jogadores salvos
                    </p>
                  </div>

                  <div className="max-h-72 overflow-y-auto">
                    {carregandoFavoritos ? (
                      <p className="px-4 py-4 text-sm text-gray-400">
                        Carregando...
                      </p>
                    ) : favoritos.length > 0 ? (
                      favoritos.map((favorito) => (
                        <button
                          key={favorito.id}
                          type="button"
                          onClick={() => abrirFavorito(favorito)}
                          className="flex w-full flex-col px-4 py-3 text-left transition-colors hover:bg-gray-900"
                        >
                          <span className="truncate text-sm font-semibold text-white">
                            {favorito.riot_name}
                            <span className="font-normal text-gray-500">
                              #{favorito.riot_tag}
                            </span>
                          </span>

                          <span className="mt-0.5 text-xs text-gray-500">
                            Ver perfil
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="px-4 py-4 text-sm text-gray-400">
                        Nenhum favorito salvo ainda.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {token ? (
            <button
              type="button"
              onClick={handleLogout}
              className="text-base font-medium text-gray-400 transition-colors hover:text-red-400"
            >
              Sair
            </button>
          ) : (
            <Link
              to="/login"
              className={`text-base font-medium transition-colors hover:text-red-400 ${
                isActive("/login") ? "text-red-500" : "text-gray-400"
              }`}
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
