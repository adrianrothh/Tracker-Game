jest.mock('../repositories/favoritosRepository', () => ({
  findDuplicate: jest.fn(),
  add: jest.fn(),
  remove: jest.fn(),
  listByUser: jest.fn()
}));

jest.mock('../repositories/jogadorRepository', () => ({
  findByRiotId: jest.fn(),
  create: jest.fn()
}));

const favoritosRepository = require('../repositories/favoritosRepository');
const jogadorRepository = require('../repositories/jogadorRepository');
const favoritosService = require('../services/favoritosService');

describe('favoritosService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addFavorito', () => {

    it('deve adicionar favorito com sucesso', async () => {
      jogadorRepository.findByRiotId.mockResolvedValue({ id: 1 });
      favoritosRepository.findDuplicate.mockResolvedValue(null);
      favoritosRepository.add.mockResolvedValue(1);

      const result = await favoritosService.addFavorito(1, 'kenJI', 'eeeh', 'puuid123');

      expect(result).toHaveProperty('message', 'Jogador adicionado aos favoritos');
    });

    it('deve criar jogador se não existir no banco', async () => {
      jogadorRepository.findByRiotId.mockResolvedValue(null);
      jogadorRepository.create.mockResolvedValue(2);
      favoritosRepository.findDuplicate.mockResolvedValue(null);
      favoritosRepository.add.mockResolvedValue(1);

      const result = await favoritosService.addFavorito(1, 'novoJogador', 'tag1', 'puuid456');

      expect(jogadorRepository.create).toHaveBeenCalledWith('novoJogador', 'tag1', 'puuid456');
      expect(result).toHaveProperty('message', 'Jogador adicionado aos favoritos');
    });

    it('deve lançar erro se jogador já estiver nos favoritos', async () => {
      jogadorRepository.findByRiotId.mockResolvedValue({ id: 1 });
      favoritosRepository.findDuplicate.mockResolvedValue({ id: 1 });

      await expect(
        favoritosService.addFavorito(1, 'kenJI', 'eeeh', 'puuid123')
      ).rejects.toMatchObject({ message: 'Jogador já está nos favoritos', status: 409 });
    });

  });

  describe('removeFavorito', () => {

    it('deve remover favorito com sucesso', async () => {
      favoritosRepository.remove.mockResolvedValue();

      const result = await favoritosService.removeFavorito(1, 1);

      expect(result).toHaveProperty('message', 'Jogador removido dos favoritos');
    });

  });

  describe('listFavoritos', () => {

    it('deve listar favoritos do usuário', async () => {
      favoritosRepository.listByUser.mockResolvedValue([
        { id: 1, riot_name: 'kenJI', riot_tag: 'eeeh' }
      ]);

      const result = await favoritosService.listFavoritos(1);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('riot_name', 'kenJI');
    });

  });

});