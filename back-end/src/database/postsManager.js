const fs = require('fs');
const path = require('path');

const postsFilePath = path.join(__dirname, 'posts.json');

// Função para ler posts do arquivo
function readPosts() {
  try {
    if (!fs.existsSync(postsFilePath)) {
      return [];
    }
    const data = fs.readFileSync(postsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler posts:', error);
    return [];
  }
}

// Função para salvar posts no arquivo
function savePosts(posts) {
  try {
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
  } catch (error) {
    console.error('Erro ao salvar posts:', error);
  }
}

// Função para gerar próximo ID
function getNextId() {
  const posts = readPosts();
  return posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
}

module.exports = {
  readPosts,
  savePosts,
  getNextId
};
