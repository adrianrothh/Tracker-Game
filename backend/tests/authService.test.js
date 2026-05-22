const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../repositories/usuarioRepository', () => ({
  findByEmail: jest.fn(),
  create: jest.fn(),
  findById: jest.fn()
}));

const usuarioRepository = require('../repositories/usuarioRepository');
const authService = require('../services/authService');

describe('authService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test_secret';
  });

  describe('register', () => {

    it('deve cadastrar um novo usuário com sucesso', async () => {
      usuarioRepository.findByEmail.mockResolvedValue(null);
      usuarioRepository.create.mockResolvedValue(1);

      const result = await authService.register('Adrian', 'adrian@email.com', '123456');

      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('nome', 'Adrian');
      expect(result).toHaveProperty('email', 'adrian@email.com');
    });

    it('deve lançar erro se email já estiver cadastrado', async () => {
      usuarioRepository.findByEmail.mockResolvedValue({ id: 1, email: 'adrian@email.com' });

      await expect(
        authService.register('Adrian', 'adrian@email.com', '123456')
      ).rejects.toMatchObject({ message: 'E-mail já cadastrado', status: 409 });
    });

  });

  describe('login', () => {

    it('deve retornar token JWT ao fazer login com sucesso', async () => {
      const senhaHash = await bcrypt.hash('123456', 10);
      usuarioRepository.findByEmail.mockResolvedValue({
        id: 1,
        nome: 'Adrian',
        email: 'adrian@email.com',
        senha: senhaHash
      });

      const result = await authService.login('adrian@email.com', '123456');

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('usuario');
      expect(result.usuario).toHaveProperty('email', 'adrian@email.com');
    });

    it('deve lançar erro se email não existir', async () => {
      usuarioRepository.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login('naoexiste@email.com', '123456')
      ).rejects.toMatchObject({ message: 'Credenciais inválidas', status: 401 });
    });

    it('deve lançar erro se senha estiver errada', async () => {
      const senhaHash = await bcrypt.hash('123456', 10);
      usuarioRepository.findByEmail.mockResolvedValue({
        id: 1,
        email: 'adrian@email.com',
        senha: senhaHash
      });

      await expect(
        authService.login('adrian@email.com', 'senhaerrada')
      ).rejects.toMatchObject({ message: 'Credenciais inválidas', status: 401 });
    });

  });

});