const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
require('dotenv').config();

async function debugPosts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    // Verificar usuários
    const users = await User.find({}).select('-password');
    console.log('\n👥 Usuários no banco:');
    users.forEach(user => {
      console.log(`- ${user.username} (${user.role}) - ID: ${user._id}`);
    });

    // Verificar posts
    const posts = await Post.find({});
    console.log('\n📝 Posts no banco:');
    console.log(`Total: ${posts.length} posts`);
    posts.forEach(post => {
      console.log(`- ${post.title} por ${post.author} (ID: ${post._id})`);
    });

    await mongoose.disconnect();
    console.log('\n🔐 Desconectado');

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

debugPosts();
