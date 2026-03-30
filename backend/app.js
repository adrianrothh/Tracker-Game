const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/api/player', require('./routes/playerRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});

module.exports = app;