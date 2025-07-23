const User = require('../models/User');
const Post = require('../models/Post');

const seedDatabase = async () => {
  try {
    // Verificar se já existem usuários
    const existingUsers = await User.countDocuments();
    
    if (existingUsers === 0) {
      console.log('🌱 Criando usuários iniciais...');
      
      // Criar usuários iniciais (senhas serão hasheadas automaticamente)
      const users = [
        {
          username: 'Livia Moura',
          password: '123456',
          role: 'professor'
        },
        {
          username: 'aluno1',
          password: '123456',
          role: 'aluno'
        }
      ];

      const createdUsers = [];
      for (const userData of users) {
        const user = new User(userData);
        const savedUser = await user.save();
        createdUsers.push(savedUser);
        console.log(`✅ Usuário criado: ${savedUser.username} (${savedUser.role})`);
      }

      // Verificar se já existem posts
      const existingPosts = await Post.countDocuments();
      
      if (existingPosts === 0) {
        console.log('📝 Criando posts iniciais...');
        
        // Migrar posts existentes do JSON para MongoDB
        const postsData = [
          {
            title: "edição 02",
            description: "teste",
            subject: "teste",
            author: "Livia Moura",
            authorId: createdUsers[0]._id
          },
          {
            title: "teste edição",
            description: "teste",
            subject: "teste",
            author: "Livia Moura",
            authorId: createdUsers[0]._id
          },
          {
            title: "teste criação edição",
            description: "teste criação",
            subject: "teste",
            author: "Livia Moura",
            authorId: createdUsers[0]._id
          },
          {
            title: "dfgfbgb",
            description: "dfrggt",
            subject: "fgbgfbg",
            author: "Livia Moura",
            authorId: createdUsers[0]._id
          }
        ];

        await Post.insertMany(postsData);
        console.log('✅ Posts migrados com sucesso!');
      }
      
      console.log('\n📋 Credenciais para login:');
      console.log('Professor: Livia Moura / 123456');
      console.log('Aluno: aluno1 / 123456');
    } else {
      console.log('📋 Usuários já existem no banco de dados');
    }
  } catch (error) {
    console.error('❌ Erro ao popular banco de dados:', error);
  }
};

module.exports = seedDatabase;
