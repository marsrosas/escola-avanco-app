const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function resetUsers() {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    // Remover todos os usuários existentes
    await User.deleteMany({});
    console.log('🗑️ Usuários antigos removidos');

    // Criar novos usuários com senhas corretas
    const users = [
      {
        username: 'Livia Moura',
        password: '123456',
        role: 'professor'
      },
      {
        username: 'Guilherme Santana',
        password: '123456',
        role: 'professor'
      },
      {
        username: 'Marselle Rosas',
        password: '123456',
        role: 'professor'
      },
      {
        username: 'aluno1',
        password: '123456',
        role: 'aluno'
      }
    ];

    // Criar usuários (o middleware irá fazer o hash das senhas automaticamente)
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ Usuário criado: ${user.username} (${user.role})`);
    }

    console.log('🎉 Usuários resetados com sucesso!');
    console.log('\n📋 Credenciais para teste:');
    console.log('Professor: Livia Moura / 123456');
    console.log('Aluno: aluno1 / 123456');

    await mongoose.disconnect();
    console.log('🔐 Desconectado do MongoDB');

  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

resetUsers();
