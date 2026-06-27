import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import StatCard from "../components/statcard";
import MatchCard from "../components/matchcard";
import PlayerHeader from "../components/playerheader";
import DetalhesModal from "../components/detalhesModal";

function Player() {
  const { nome, tag } = useParams();

  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const [isFavorito, setIsFavorito] = useState(false);
  const [favId, setFavId] = useState(null);

  const [agentImages, setAgentImages] = useState({});
  const [rankIcons, setRankIcons] = useState({});

  const [partidaSelecionada, setPartidaSelecionada] = useState(null);
  const [detalhesPartida, setDetalhesPartida] = useState(null);
  const [carregandoDetalhes, setCarregandoDetalhes] = useState(false);

  const [mapImages, setMapImages] = useState({});

  useEffect(() => {
    async function buscarMapas() {
      try {
        const res = await axios.get("https://valorant-api.com/v1/maps");

        const mapa = {};

        res.data.data.forEach((map) => {
          if (map.displayName) {
            mapa[map.displayName] =
              map.splash || map.listViewIcon || map.displayIcon || null;
          }
        });

        setMapImages(mapa);
      } catch (err) {
        console.error("Erro ao buscar imagens dos mapas:", err);
      }
    }

    buscarMapas();
  }, []);

  useEffect(() => {
    async function buscar() {
      try {
        setLoading(true);
        setErro(null);
        setPlayerData(null);

        const res = await axios.get(
          `http://localhost:3000/api/player/na/${nome}/${tag}`,
        );
        setPlayerData(res.data.data);
      } catch (err) {
        console.error("Erro ao buscar jogador:", err);

        if (err.response?.status === 404) {
          setErro("Jogador não encontrado");
        } else if (err.response?.status === 502) {
          setErro(
            "Erro ao consultar a API do Valorant. Tente novamente mais tarde.",
          );
        } else {
          setErro("Erro ao carregar os dados do jogador.");
        }
      } finally {
        setLoading(false);
      }
    }

    buscar();
  }, [nome, tag]);

  useEffect(() => {
    async function checarFavorito() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:3000/api/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const listaFavoritos = res.data.data || [];

        const favoritoEncontrado = listaFavoritos.find(
          (fav) =>
            fav.riot_name.toLowerCase() === nome.toLowerCase() &&
            fav.riot_tag.toLowerCase() === tag.toLowerCase(),
        );

        if (favoritoEncontrado) {
          setIsFavorito(true);
          setFavId(favoritoEncontrado.id);
        } else {
          setIsFavorito(false);
          setFavId(null);
        }
      } catch (err) {
        console.error("Erro ao checar favoritos", err);
      }
    }

    checarFavorito();
  }, [nome, tag]);

  useEffect(() => {
    async function buscarAgentes() {
      try {
        const res = await axios.get(
          "https://valorant-api.com/v1/agents?isPlayableCharacter=true",
        );

        const mapa = {};

        res.data.data.forEach((agente) => {
          mapa[agente.displayName] = agente.displayIcon;
        });

        setAgentImages(mapa);
      } catch (err) {
        console.error("Erro ao buscar imagens dos agentes", err);
      }
    }

    buscarAgentes();
  }, []);

  useEffect(() => {
    async function buscarRanks() {
      try {
        const res = await axios.get(
          "https://valorant-api.com/v1/competitivetiers",
        );

        const seasons = res.data.data || [];
        const ultimaSeason = seasons[seasons.length - 1];

        const mapa = {};

        ultimaSeason?.tiers?.forEach((tier) => {
          if (tier.tierName) {
            mapa[tier.tierName.toLowerCase()] =
              tier.largeIcon || tier.smallIcon;
          }
        });

        setRankIcons(mapa);
      } catch (err) {
        console.error("Erro ao buscar ícones de rank", err);
      }
    }

    buscarRanks();
  }, []);

  async function handleToggleFavorito() {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Você precisa fazer login para favoritar jogadores!");
      return;
    }

    try {
      if (isFavorito) {
        await axios.delete(`http://localhost:3000/api/favorites/${favId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIsFavorito(false);
        setFavId(null);
      } else {
        const res = await axios.post(
          "http://localhost:3000/api/favorites",
          { riot_name: nome, riot_tag: tag },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setIsFavorito(true);

        if (res.data?.data?.id) {
          setFavId(res.data.data.id);
        }
      }
    } catch (err) {
      console.error("Erro ao favoritar", err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Carregando...
      </div>
    );
  }

  if (erro) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-400">
        {erro}
      </div>
    );
  }

  if (!playerData || !playerData.jogador) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-400">
        Dados do jogador não encontrados.
      </div>
    );
  }

  const jogador = playerData.jogador;
  const stats = playerData.stats;
  const partidas = playerData.partidas || [];

  async function abrirDetalhesPartida(partida) {
    setPartidaSelecionada(partida);
    setDetalhesPartida(null);
    setCarregandoDetalhes(true);

    try {
      const res = await axios.get(
        `http://localhost:3000/api/player/match/${jogador.id}/${partida.match_id}`,
      );

      setDetalhesPartida(res.data.data);
    } catch (err) {
      console.error("Erro ao buscar detalhes da partida:", err);
      setDetalhesPartida(null);
    } finally {
      setCarregandoDetalhes(false);
    }
  }

  function fecharDetalhesPartida() {
    setPartidaSelecionada(null);
    setDetalhesPartida(null);
    setCarregandoDetalhes(false);
  }

  const rankIcon = jogador.rank ? rankIcons[jogador.rank.toLowerCase()] : null;

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Red glow / gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/25 via-black to-black pointer-events-none" />
      <div className="absolute top-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <PlayerHeader
          jogador={jogador}
          rankIcon={rankIcon}
          isFavorito={isFavorito}
          handleToggleFavorito={handleToggleFavorito}
        />

        <main className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-8">
          {/* Stats section */}
          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Desempenho recente</h2>
                <p className="text-sm text-gray-400">
                  Estatísticas calculadas com base nas partidas competitivas
                  recentes.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard
                titulo="Vitórias / Derrotas"
                valor={`${stats.vitorias}W — ${stats.derrotas}L`}
                subtitulo={`${stats.winrate} winrate`}
                tooltip="Quantidade de vitórias e derrotas nas partidas analisadas."
              />

              <StatCard
                titulo="K/D Ratio"
                valor={stats.kdr_geral}
                cor="text-green-400"
                tooltip="Abates dividido por Mortes, mostrando quantas eliminações você faz em média para cada morte."
              />

              <StatCard
                titulo="KDA"
                valor={`${stats.kills_totais} / ${stats.deaths_totais} / ${stats.assists_totais}`}
                tooltip="Média de Abates, Mortes e Assistências nas partidas analisadas."
              />

              <StatCard
                titulo="ACS Médio"
                valor={stats.acs_medio}
                cor="text-yellow-400"
                tooltip="Média da Pontuação de Combate nas partidas analisadas."
              />

              <StatCard
                titulo="Dano/Round"
                valor={stats.dano_por_round_medio}
                cor="text-orange-400"
                tooltip="Média de dano causado por round nas partidas analisadas."
              />

              <StatCard
                titulo="Headshot%"
                valor={stats.headshot_percent_medio}
                cor="text-blue-400"
                tooltip="Média de tiros na cabeça nas partidas analisadas."
              />

              <StatCard
                titulo="First Bloods"
                valor={stats.first_bloods_totais}
                cor="text-red-400"
                tooltip="Quantidade de primeiros abates nos rounds das partidas analisadas."
              />

              <StatCard
                titulo="Aces"
                valor={stats.aces_totais}
                cor="text-purple-400"
                tooltip="Quantidade de rounds em que o jogador eliminou todos os inimigos."
              />

              <StatCard
                titulo="Total Partidas"
                valor={stats.total_partidas}
                tooltip="Quantidade total de partidas usadas para calcular as estatísticas."
              />
            </div>
          </section>

          {/* Match history */}
          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Histórico de Partidas</h2>
                <p className="text-sm text-gray-400">
                  Partidas competitivas recentes
                </p>
              </div>

              <span className="rounded-full border border-gray-800 bg-gray-950/80 px-3 py-1 text-xs text-gray-400">
                {partidas.length} partidas
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {partidas.length > 0 ? (
                partidas.map((partida, index) => (
                  <MatchCard
                    key={partida.match_id || index}
                    partida={partida}
                    agentImages={agentImages}
                    onClick={() => abrirDetalhesPartida(partida)}
                  />
                ))
              ) : (
                <div className="rounded-2xl border border-gray-800 bg-gray-950/80 px-6 py-12 text-center">
                  <p className="font-semibold text-gray-300">
                    Nenhuma partida competitiva recente encontrada.
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Assim que houver partidas salvas, elas aparecerão aqui.
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>

        <DetalhesModal
          partida={partidaSelecionada}
          detalhes={detalhesPartida}
          loading={carregandoDetalhes}
          onClose={fecharDetalhesPartida}
          agentImages={agentImages}
          rankIcons={rankIcons}
          mapImages={mapImages}
        />
      </div>
    </div>
  );
}

export default Player;
