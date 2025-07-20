const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware');

const posts = [];

router.post('/posts', authenticateToken, (req, res) => {
  const { title, description, subject } = req.body;

  if (!title || !description || !subject) {
    return res.status(400).json({
      message: 'Campos obrigatórios: title, description, subject'
    });
  }

  const newPost = {
    id: posts.length + 1,
    title,
    description,
    subject,
    author: req.user.name, // usuário logado
    createdAt: new Date()
  };

  posts.push(newPost);
  res.status(201).json(newPost);
});

router.get('/posts', authenticateToken, (req, res) => {
  const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sortedPosts);
});

module.exports = router;




