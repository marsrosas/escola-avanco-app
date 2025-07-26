const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');
const router = express.Router();

// Middleware para todas as rotas administrativas (apenas professores)
router.use(authMiddleware);
router.use(authorizeRoles('professor'));

// ==================== ROTAS PARA PROFESSORES ====================

// Listar todos os professores
router.get('/professores', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const professores = await User.find({ role: 'professor' })
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({ role: 'professor' });
    const totalPages = Math.ceil(total / limit);

    res.json({
      professores,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Erro ao listar professores:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Buscar professor específico
router.get('/professores/:id', async (req, res) => {
  try {
    const professor = await User.findOne({ 
      _id: req.params.id, 
      role: 'professor' 
    }).select('-password');

    if (!professor) {
      return res.status(404).json({ message: 'Professor não encontrado' });
    }

    res.json(professor);
  } catch (error) {
    console.error('Erro ao buscar professor:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Criar novo professor
router.post('/professores', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validações
    if (!username || !password) {
      return res.status(400).json({ message: 'Username e senha são obrigatórios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Senha deve ter pelo menos 6 caracteres' });
    }

    // Verificar se já existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Já existe um usuário com este nome' });
    }

    // Criar professor
    const novoProfessor = new User({
      username,
      password,
      role: 'professor'
    });

    await novoProfessor.save();

    const professorResponse = {
      _id: novoProfessor._id,
      username: novoProfessor.username,
      role: novoProfessor.role,
      createdAt: novoProfessor.createdAt,
      updatedAt: novoProfessor.updatedAt
    };

    console.log(`✅ Professor criado: ${novoProfessor.username} por ${req.user.username}`);
    res.status(201).json({ 
      message: 'Professor criado com sucesso',
      professor: professorResponse
    });
  } catch (error) {
    console.error('Erro ao criar professor:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Editar professor
router.put('/professores/:id', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validações
    if (!username) {
      return res.status(400).json({ message: 'Username é obrigatório' });
    }

    const professor = await User.findOne({ _id: req.params.id, role: 'professor' });
    if (!professor) {
      return res.status(404).json({ message: 'Professor não encontrado' });
    }

    // Verificar se o username já existe (exceto para o professor que está sendo editado)
    if (username !== professor.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Já existe um usuário com este nome' });
      }
    }

    // Atualizar dados
    professor.username = username;
    
    // Só atualizar senha se foi fornecida
    if (password && password.trim() !== '') {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Senha deve ter pelo menos 6 caracteres' });
      }
      professor.password = password;
    }

    await professor.save();

    const professorResponse = {
      _id: professor._id,
      username: professor.username,
      role: professor.role,
      createdAt: professor.createdAt,
      updatedAt: professor.updatedAt
    };

    console.log(`✅ Professor editado: ${professor.username} por ${req.user.username}`);
    res.json({ 
      message: 'Professor atualizado com sucesso',
      professor: professorResponse
    });
  } catch (error) {
    console.error('Erro ao editar professor:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Excluir professor
router.delete('/professores/:id', async (req, res) => {
  try {
    // Não permitir que o professor exclua a si mesmo
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'Você não pode excluir sua própria conta' });
    }

    const professor = await User.findOne({ _id: req.params.id, role: 'professor' });
    if (!professor) {
      return res.status(404).json({ message: 'Professor não encontrado' });
    }

    await User.findByIdAndDelete(req.params.id);

    console.log(`🗑️ Professor excluído: ${professor.username} por ${req.user.username}`);
    res.json({ message: 'Professor excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir professor:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// ==================== ROTAS PARA ALUNOS ====================

// Listar todos os alunos
router.get('/alunos', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const alunos = await User.find({ role: 'aluno' })
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({ role: 'aluno' });
    const totalPages = Math.ceil(total / limit);

    res.json({
      alunos,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Erro ao listar alunos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Buscar aluno específico
router.get('/alunos/:id', async (req, res) => {
  try {
    const aluno = await User.findOne({ 
      _id: req.params.id, 
      role: 'aluno' 
    }).select('-password');

    if (!aluno) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }

    res.json(aluno);
  } catch (error) {
    console.error('Erro ao buscar aluno:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Criar novo aluno
router.post('/alunos', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validações
    if (!username || !password) {
      return res.status(400).json({ message: 'Username e senha são obrigatórios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Senha deve ter pelo menos 6 caracteres' });
    }

    // Verificar se já existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Já existe um usuário com este nome' });
    }

    // Criar aluno
    const novoAluno = new User({
      username,
      password,
      role: 'aluno'
    });

    await novoAluno.save();

    const alunoResponse = {
      _id: novoAluno._id,
      username: novoAluno.username,
      role: novoAluno.role,
      createdAt: novoAluno.createdAt,
      updatedAt: novoAluno.updatedAt
    };

    console.log(`✅ Aluno criado: ${novoAluno.username} por ${req.user.username}`);
    res.status(201).json({ 
      message: 'Aluno criado com sucesso',
      aluno: alunoResponse
    });
  } catch (error) {
    console.error('Erro ao criar aluno:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Editar aluno
router.put('/alunos/:id', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validações
    if (!username) {
      return res.status(400).json({ message: 'Username é obrigatório' });
    }

    const aluno = await User.findOne({ _id: req.params.id, role: 'aluno' });
    if (!aluno) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }

    // Verificar se o username já existe (exceto para o aluno que está sendo editado)
    if (username !== aluno.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Já existe um usuário com este nome' });
      }
    }

    // Atualizar dados
    aluno.username = username;
    
    // Só atualizar senha se foi fornecida
    if (password && password.trim() !== '') {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Senha deve ter pelo menos 6 caracteres' });
      }
      aluno.password = password;
    }

    await aluno.save();

    const alunoResponse = {
      _id: aluno._id,
      username: aluno.username,
      role: aluno.role,
      createdAt: aluno.createdAt,
      updatedAt: aluno.updatedAt
    };

    console.log(`✅ Aluno editado: ${aluno.username} por ${req.user.username}`);
    res.json({ 
      message: 'Aluno atualizado com sucesso',
      aluno: alunoResponse
    });
  } catch (error) {
    console.error('Erro ao editar aluno:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Excluir aluno
router.delete('/alunos/:id', async (req, res) => {
  try {
    const aluno = await User.findOne({ _id: req.params.id, role: 'aluno' });
    if (!aluno) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }

    await User.findByIdAndDelete(req.params.id);

    console.log(`🗑️ Aluno excluído: ${aluno.username} por ${req.user.username}`);
    res.json({ message: 'Aluno excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir aluno:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
