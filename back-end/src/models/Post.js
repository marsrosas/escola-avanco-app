const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Opcional para compatibilidade com dados existentes
  }
}, {
  timestamps: true // Adiciona createdAt e updatedAt automaticamente
});

// Índices para melhorar performance de busca
postSchema.index({ title: 'text', description: 'text', subject: 'text' });
postSchema.index({ author: 1 });
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
