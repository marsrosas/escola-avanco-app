const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
require('dotenv').config();

async function setupDatabase() {
  console.log('🚀 Iniciando configuração do banco de dados...\n');
  
  try {
    // 1. Testar conexão
    console.log('1️⃣ Testando conexão com MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conexão estabelecida com sucesso!\n');

    // 2. Verificar se o banco está vazio
    const userCount = await User.countDocuments();
    const postCount = await Post.countDocuments();
    
    console.log(`📊 Estado atual do banco:`);
    console.log(`   - Usuários: ${userCount}`);
    console.log(`   - Posts: ${postCount}\n`);

    // 3. Criar usuários se não existirem
    if (userCount === 0) {
      console.log('👥 Criando usuários iniciais...');
      
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
        console.log(`   ✅ ${savedUser.username} (${savedUser.role})`);
      }
      console.log('');

      // 4. Criar posts iniciais se não existirem
      if (postCount === 0) {
        console.log('📝 Criando posts iniciais...');
        
        const posts = [
          {
            title: "Introdução à Matemática",
            description: "Conceitos básicos de matemática para iniciantes. Nesta aula, abordaremos números naturais, operações básicas e resolução de problemas simples.",
            subject: "Matemática",
            author: "Livia Moura",
            authorId: createdUsers[0]._id
          },
          {
            title: "História do Brasil Colonial",
            description: "Estudo do período colonial brasileiro, desde a chegada dos portugueses até a independência. Abordaremos aspectos políticos, econômicos e sociais.",
            subject: "História",
            author: "Livia Moura",
            authorId: createdUsers[0]._id
          },
          {
            title: "Fundamentos da Física",
            description: "Introdução aos conceitos fundamentais da física: movimento, força, energia e suas aplicações no cotidiano.",
            subject: "Física",
            author: "Livia Moura",
            authorId: createdUsers[0]._id
          }
        ];

        for (const postData of posts) {
          const post = new Post(postData);
          await post.save();
          console.log(`   ✅ ${post.title} (${post.subject})`);
        }
        console.log('');
      }
    } else {
      console.log('ℹ️ Usuários já existem no banco. Pulando criação...\n');
    }

    // 5. Verificar resultado final
    const finalUserCount = await User.countDocuments();
    const finalPostCount = await Post.countDocuments();
    
    console.log('🎉 Configuração concluída!');
    console.log(`📊 Resultado final:`);
    console.log(`   - Usuários: ${finalUserCount}`);
    console.log(`   - Posts: ${finalPostCount}`);
    console.log('');
    console.log('🔐 Credenciais para teste:');
    console.log('   Professor: "Livia Moura" / "123456"');
    console.log('   Aluno: "aluno1" / "123456"');
    console.log('');
    console.log('💡 Para testar a API, execute: npm run dev');

  } catch (error) {
    console.error('❌ Erro durante a configuração:', error.message);
    console.log('\n🔧 Possíveis soluções:');
    console.log('1. Verifique se o MongoDB está rodando (docker-compose up)');
    console.log('2. Verifique se as variáveis do .env estão corretas');
    console.log('3. Verifique se a porta 27017 está disponível');
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Conexão encerrada');
  }
}

setupDatabase();
