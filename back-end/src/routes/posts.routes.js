const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth.middleware');
const Post = require('../models/Post');

// Criar novo post
router.post('/posts', authenticateToken, async (req, res) => {
  try {
    const { title, description, subject } = req.body;

    console.log(`📝 Criação de post solicitada por: ${req.user.username}`);
    console.log(`Dados: ${title} - ${subject}`);

    if (!title || !description || !subject) {
      return res.status(400).json({
        message: 'Campos obrigatórios: title, description, subject'
      });
    }

    const newPost = new Post({
      title,
      description,
      subject,
      author: req.user.username,
      authorId: req.user.id
    });

    const savedPost = await newPost.save();
    console.log(`✅ Post criado com ID: ${savedPost._id}`);
    
    // Retornar no formato compatível
    const formattedPost = {
      id: savedPost._id,
      _id: savedPost._id,
      title: savedPost.title,
      description: savedPost.description,
      subject: savedPost.subject,
      author: savedPost.author,
      authorId: savedPost.authorId,
      createdAt: savedPost.createdAt,
      updatedAt: savedPost.updatedAt
    };
    
    res.status(201).json(formattedPost);
  } catch (error) {
    console.error('❌ Erro ao criar post:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Listar todos os posts
router.get('/posts', authenticateToken, async (req, res) => {
  try {
    console.log(`📋 Busca de posts solicitada por: ${req.user.username} (${req.user.role})`);
    
    const posts = await Post.find()
      .sort({ createdAt: -1 }) // Ordenar por data de criação (mais recente primeiro)
      .populate('authorId', 'username role'); // Popular dados do autor se necessário
    
    console.log(`✅ ${posts.length} posts encontrados`);
    
    // Converter para formato compatível com front-end (se necessário)
    const formattedPosts = posts.map(post => ({
      id: post._id, // Mongoose usa _id, mas front-end pode esperar id
      _id: post._id,
      title: post.title,
      description: post.description,
      subject: post.subject,
      author: post.author,
      authorId: post.authorId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    }));
    
    res.json(formattedPosts);
  } catch (error) {
    console.error('❌ Erro ao buscar posts:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Buscar post por ID
router.get('/posts/:id', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('authorId', 'username role');
    
    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }
    
    res.json(post);
  } catch (error) {
    console.error('Erro ao buscar post:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Atualizar post
router.put('/posts/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, subject } = req.body;
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }

    // Verificar se o usuário é o autor do post ou é um professor
    if (post.authorId?.toString() !== req.user.id && req.user.role !== 'professor') {
      return res.status(403).json({ message: 'Não autorizado a editar este post' });
    }

    // Atualizar campos
    if (title) post.title = title;
    if (description) post.description = description;
    if (subject) post.subject = subject;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    console.error('Erro ao atualizar post:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Deletar post
router.delete('/posts/:id', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }

    // Verificar se o usuário é o autor do post ou é um professor
    if (post.authorId?.toString() !== req.user.id && req.user.role !== 'professor') {
      return res.status(403).json({ message: 'Não autorizado a deletar este post' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar post:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;




