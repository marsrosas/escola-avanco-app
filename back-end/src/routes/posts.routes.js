const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth.middleware');

let posts = [
  {
    id: 1,
    title: 'Matemática Básica',
    description: 'Introdução à matemática.',
    subject: 'Matemática',
    author: 'Livia Moura',
    createdAt: new Date()
  },
  {
    id: 2,
    title: 'História do Brasil',
    description: 'Aula sobre o período colonial.',
    subject: 'História',
    author: 'Guilherme Silva',
    createdAt: new Date()
  }
];

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
    author: req.user.username,
    createdAt: new Date()
  };

  posts.push(newPost);
  res.status(201).json(newPost);
});

router.get('/posts', authenticateToken, (req, res) => {
  const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sortedPosts);
});

router.delete('/posts/:id', authenticateToken, (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const initialLength = posts.length;
  posts = posts.filter(p => p.id !== postId);
  if (posts.length === initialLength) {
    return res.status(404).json({ message: 'Post não encontrado' });
  }
  res.json({ message: 'Post deletado com sucesso' });
});

module.exports = router;




