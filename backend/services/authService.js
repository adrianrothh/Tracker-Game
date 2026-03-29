const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuarioRepository = require('../repositories/usuarioRepository');

async function register(nome, email, senha) {
  const existe = await usuarioRepository.findByEmail(email);
  if (existe) {
    const err = new Error('E-mail já cadastrado');
    err.status = 409;
    throw err;
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  const id = await usuarioRepository.create(nome, email, senhaHash);
  return { id, nome, email };
}

async function login(email, senha) {
  const usuario = await usuarioRepository.findByEmail(email);
  if (!usuario) {
    const err = new Error('Credenciais inválidas');
    err.status = 401;
    throw err;
  }

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
  if (!senhaCorreta) {
    const err = new Error('Credenciais inválidas');
    err.status = 401;
    throw err;
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  return { token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } };
}

module.exports = { register, login };