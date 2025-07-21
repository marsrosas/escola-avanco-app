const express = require('express');
const jwt = require('jsonwebtoken');
const users = require('../../users');
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Usuário ou senha inválidos' });
  }
  // Inclua o role no payload do JWT
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    'seuSegredoJWT', // Troque por variável de ambiente em produção
    { expiresIn: '1d' }
  );
  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  });
});

module.exports = router;


