const mongoose = require('mongoose');
require('dotenv').config();

async function checkDatabaseConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conexão com MongoDB estabelecida com sucesso!');
    
    // Verificar coleções existentes
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Coleções no banco:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('🔐 Conexão encerrada');
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
  }
}

checkDatabaseConnection();
