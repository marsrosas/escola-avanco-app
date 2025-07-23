// src/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');
const seedDatabase = require('./config/seedDatabase');

const app = express();

// Conectar ao MongoDB
connectDB();

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Importação das rotas (uma vez só)
const authRoutes = require('./routes/auth.routes');
const postsRoutes = require('./routes/posts.routes');
const teacherRoutes = require('./routes/teachers.routes');
const studentRoutes = require('./routes/students.routes');

// Registro das rotas
app.use('/api', authRoutes);
app.use('/api', postsRoutes);
app.use('/api', teacherRoutes);
app.use('/api', studentRoutes);

// Rota simples de health check
app.get('/', (req, res) => {
  res.send('API Escola Avanço está funcionando 🚀');
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  // Popular banco de dados com dados iniciais
  await seedDatabase();
});
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

