const express = require('express');
const bcrypt = require('bcryptjs');
const verifyToken = require('../middleware/auth.middleware');
const authorizeRoles = require('../middleware/role.middleware');

const router = express.Router();

let students = [
  {
    id: 1,
    name: 'Estudante Lucas',
    email: 'lucas@avanço.com',
    password: bcrypt.hashSync('123456', 8)
  }
];

router.use(verifyToken);

// GET /api/students
router.get('/students', (req, res) => {
  const publicData = students.map(({ password, ...s }) => s);
  res.json(publicData);
});

// POST /api/students
router.post('/students', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Campos obrigatórios: name, email, password' });
  }

  const exists = students.find(s => s.email === email);
  if (exists) return res.status(409).json({ message: 'Email já cadastrado' });

  const newStudent = {
    id: students.length + 1,
    name,
    email,
    password: bcrypt.hashSync(password, 8)
  };

  students.push(newStudent);

  const { password: _, ...publicStudent } = newStudent;
  res.status(201).json(publicStudent);
});

// PUT /api/students/:id
router.put('/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id);
  const { name, email, password } = req.body;

  const index = students.findIndex(s => s.id === studentId);
  if (index === -1) return res.status(404).json({ message: 'Estudante não encontrado' });

  students[index] = {
    ...students[index],
    name: name || students[index].name,
    email: email || students[index].email,
    password: password
      ? bcrypt.hashSync(password, 8)
      : students[index].password
  };

  const { password: _, ...updated } = students[index];
  res.json(updated);
});

// DELETE /api/students/:id
router.delete('/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id);
  const index = students.findIndex(s => s.id === studentId);
  if (index === -1) return res.status(404).json({ message: 'Estudante não encontrado' });

  const deleted = students.splice(index, 1)[0];
  const { password: _, ...publicDeleted } = deleted;

  res.json({ message: 'Estudante excluído com sucesso', estudante: publicDeleted });
});

// Apenas alunos podem acessar essas rotas
router.get('/minhas-aulas', authorizeRoles('aluno'), (req, res) => {
  // lógica para listar aulas do aluno
  res.json({ message: 'Aulas do aluno!' });
});

// Outras rotas protegidas para aluno...

module.exports = router;
