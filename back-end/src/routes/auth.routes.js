const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log(`🔐 Tentativa de login: ${username}`);
    
    // Buscar usuário no banco de dados
    const user = await User.findOne({ username });
    
    if (!user) {
      console.log(`❌ Usuário não encontrado: ${username}`);
      return res.status(401).json({ message: 'Usuário ou senha inválidos' });
    }

    console.log(`✅ Usuário encontrado: ${user.username} (${user.role})`);

    // Verificar senha usando o método do modelo
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      console.log(`❌ Senha incorreta para: ${username}`);
      return res.status(401).json({ message: 'Usuário ou senha inválidos' });
    }

    console.log(`✅ Login bem-sucedido: ${user.username}`);

    // Criar token JWT
    const token = jwt.sign(
      { 
        id: user._id, 
        username: user.username, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'seuSegredoJWT',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota para registrar novo usuário
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    // Criar novo usuário
    const user = new User({
      username,
      password,
      role: role || 'aluno'
    });

    await user.save();

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;


