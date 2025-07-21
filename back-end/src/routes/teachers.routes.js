const express = require('express');
const bcrypt = require('bcryptjs');
const verifyToken = require('../middleware/auth.middleware');
const authorizeRoles = require('../middleware/role.middleware');

const router = express.Router();

let teachers = [
  {
    id: 1,
    name: 'Professor João',
    email: 'joao@avanço.com',
    password: bcrypt.hashSync('123456', 8)
  }
];

// GET /api/teachers
router.get('/teachers', verifyToken, (req, res) => {
  const publicData = teachers.map(({ password, ...t }) => t);
  res.json(publicData);
});

// POST /api/teachers
router.post('/teachers', verifyToken, (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Campos obrigatórios: name, email, password' });
  }

  const exists = teachers.find(t => t.email === email);
  if (exists) return res.status(409).json({ message: 'Email já cadastrado' });

  const newTeacher = {
    id: teachers.length + 1,
    name,
    email,
    password: bcrypt.hashSync(password, 8)
  };

  teachers.push(newTeacher);

  const { password: _, ...publicTeacher } = newTeacher;
  res.status(201).json(publicTeacher);
});

// PUT /api/teachers/:id
router.put('/teachers/:id', verifyToken, (req, res) => {
  const teacherId = parseInt(req.params.id);
  const { name, email, password } = req.body;

  const index = teachers.findIndex(t => t.id === teacherId);
  if (index === -1) return res.status(404).json({ message: 'Professor não encontrado' });

  teachers[index] = {
    ...teachers[index],
    name: name || teachers[index].name,
    email: email || teachers[index].email,
    password: password
      ? bcrypt.hashSync(password, 8)
      : teachers[index].password
  };

  const { password: _, ...updated } = teachers[index];
  res.json(updated);
});

// DELETE /api/teachers/:id
router.delete('/teachers/:id', verifyToken, (req, res) => {
  const teacherId = parseInt(req.params.id);
  const index = teachers.findIndex(t => t.id === teacherId);
  if (index === -1) return res.status(404).json({ message: 'Professor não encontrado' });

  const deleted = teachers.splice(index, 1)[0];
  const { password: _, ...publicDeleted } = deleted;

  res.json({ message: 'Professor excluído com sucesso', professor: publicDeleted });
});

router.use(verifyToken);

// Apenas professores podem criar, editar ou excluir aulas
router.post('/criar-aula', authorizeRoles('professor'), (req, res) => {
  // lógica para criar aula
  res.json({ message: 'Aula criada!' });
});

module.exports = router;
