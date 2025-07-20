const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Simulação de validação
  if (email === 'professor@avanço.com' && password === '123456') {
    const user = { id: 1, name: 'Marselle Rosas', email };

    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({ token });
  }

  return res.status(401).json({ message: 'Credenciais inválidas' });
});

module.exports = router;


