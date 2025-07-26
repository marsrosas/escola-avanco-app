const User = require('../models/User');
const Post = require('../models/Post');

const seedDatabase = async () => {
  try {
    // Verificar se já existem usuários
    const existingUsers = await User.countDocuments();
    
    if (existingUsers === 0) {
      console.log('🌱 Criando usuários iniciais...');
      
      // Criar usuários iniciais
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
        console.log('📝 Criando aulas iniciais...');
        
        // Aulas iniciais para demonstração
        const postsData = [
          {
            title: "Matrizes",
            description: "Matrizes são tabelas organizadas em linhas e colunas que agrupam números ou elementos matemáticos, sendo amplamente utilizadas na álgebra linear. Cada posição em uma matriz é chamada de elemento e é identificada por um índice de linha e outro de coluna. Elas podem representar sistemas de equações lineares, transformações geométricas, dados em computadores, entre outras aplicações em áreas como física, engenharia e economia.",
            subject: "Matemática",
            author: "Guilherme Santana",
            authorId: createdUsers[1]._id
          },
          {
            title: "Romantismo",
            description: "O Romantismo foi um movimento literário que surgiu no final do século XVIII na Europa, como reação ao racionalismo do Iluminismo e ao rigor das regras clássicas. Valorizava a emoção, a subjetividade, a liberdade de criação artística e o idealismo. No Brasil, destacou-se a partir de 1836 com a publicação de Suspiros Poéticos e Saudades, de Gonçalves de Magalhães.",
            subject: "Literatura",
            author: "Livia Moura",
            authorId: createdUsers[0]._id
          },
          {
            title: "Primeira Guerra Mundial",
            description: "A Primeira Guerra Mundial, ocorrida entre 1914 e 1918, foi um conflito de escala global que envolveu as principais potências do mundo, divididas em dois grandes blocos: a Tríplice Entente e a Tríplice Aliança. As causas incluem rivalidades imperialistas, nacionalismos exacerbados e alianças militares.",
            subject: "História",
            author: "Marselle Rosas",
            authorId: createdUsers[2]._id
          },
          {
            title: "Funções",
            description: "Funções são relações matemáticas que associam cada elemento de um conjunto a exatamente um elemento de outro conjunto. Em termos simples, uma função recebe uma entrada e produz uma saída, de acordo com uma regra específica. São amplamente utilizadas para modelar situações do cotidiano.",
            subject: "Matemática",
            author: "Guilherme Santana",
            authorId: createdUsers[1]._id
          },
          {
            title: "Realismo",
            description: "O Realismo foi um movimento literário e artístico que surgiu na Europa no século XIX como reação ao idealismo e à subjetividade do Romantismo. Ele buscava retratar a realidade de forma objetiva, racional e crítica, focando em temas sociais e políticos.",
            subject: "Literatura",
            author: "Livia Moura",
            authorId: createdUsers[0]._id
          }
        ];

        await Post.insertMany(postsData);
        console.log('✅ Aulas iniciais criadas com sucesso!');
      }
      
      console.log('\n📋 Credenciais para login:');
      console.log('Professor: Livia Moura / 123456');
      console.log('Professor: Guilherme Santana / 123456');
      console.log('Professor: Marselle Rosas / 123456');
      console.log('Aluno: aluno1 / 123456');
    } else {
      console.log('📋 Usuários já existem no banco de dados');
    }
  } catch (error) {
    console.error('❌ Erro ao popular banco de dados:', error);
  }
};

module.exports = seedDatabase;
