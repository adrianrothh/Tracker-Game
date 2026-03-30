const authService = require('../services/authService');

async function register(req, res) {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ success: false, message: 'Preencha todos os campos' });
  }

  try {
    const usuario = await authService.register(nome, email, senha);
    res.status(201).json({ success: true, data: usuario });
  } catch (err) {
    console.error('Erro no register:', err);
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
}   

async function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ success: false, message: 'Preencha todos os campos' });
  }

  try {
    const resultado = await authService.login(email, senha);
    res.status(200).json({ success: true, data: resultado });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
}

module.exports = { register, login };