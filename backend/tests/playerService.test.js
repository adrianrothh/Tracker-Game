jest.mock('../repositories/jogadorRepository', () => ({
  findByRiotId: jest.fn(),
  create: jest.fn(),
  update: jest.fn()
}));

jest.mock('../repositories/partidaRepository', () => ({
  upsert: jest.fn(),
  findByJogadorId: jest.fn()
}));

jest.mock('../repositories/rankSnapshotRepository', () => ({
  save: jest.fn(),
  findByJogadorId: jest.fn()
}));

jest.mock('node-fetch');
const fetch = require('node-fetch');
const jogadorRepository = require('../repositories/jogadorRepository');
const partidaRepository = require('../repositories/partidaRepository');
const playerService = require('../services/playerService');

describe('playerService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.HENRIK_API_KEY = 'test_key';
  });

  describe('getPlayerData', () => {

    it('deve retornar dados do banco se não precisar atualizar', async () => {
      jogadorRepository.findByRiotId.mockResolvedValue({
        id: 1,
        riot_name: 'kenJI',
        riot_tag: 'eeeh',
        atualizado_em: new Date()
      });

      partidaRepository.findByJogadorId.mockResolvedValue([
        { kills: 10, deaths: 8, assists: 3, resultado: 'Vitória', acs: '200', dano_por_round: '150', headshot_percent: '20', first_bloods: 1, aces: 0 }
      ]);

      const result = await playerService.getPlayerData('br', 'kenJI', 'eeeh');

      expect(result.fonte).toBe('banco');
      expect(result).toHaveProperty('jogador');
      expect(result).toHaveProperty('partidas');
      expect(result).toHaveProperty('stats');
      expect(fetch).not.toHaveBeenCalled();
    });

    it('deve lançar erro 404 se jogador não for encontrado na API', async () => {
      jogadorRepository.findByRiotId.mockResolvedValue(null);

      fetch.mockResolvedValue({ status: 404, ok: false });

      await expect(
        playerService.getPlayerData('br', 'jogadorinexistente', 'tag')
      ).rejects.toMatchObject({ message: 'Jogador não encontrado', status: 404 });
    });

  });

});