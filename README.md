# Escola Avanço - Sistema de Blogging Educacional
![Logo Escola Avanço](https://github.com/user-attachments/assets/e81aa3e9-732c-4143-b495-47710bbbe543)

## Introdução
No cenário educacional atual, a falta de ferramentas adequadas dificulta a publicação e o compartilhamento de conteúdos educacionais de forma centralizada e acessível. A aplicação **Escola Avanço** foi desenvolvida para enfrentar esse desafio, permitindo que professores da rede pública publiquem aulas de maneira intuitiva e tecnológica, enquanto os alunos têm acesso fácil e organizado a esses materiais.

A aplicação consiste em um **projeto Full Stack** com aplicativo mobile (React Native) + API RESTful (Node.js) + banco de dados MongoDB, desenvolvido para simular o ambiente de uma escola, permitindo que professores criem, editem e excluam aulas, e que alunos possam visualizar e filtrar os conteúdos postados.

---

## Estrutura do Projeto
O repositório está organizado da seguinte forma:

```
escola-avanco-app/
├── back-end/                    # API RESTful (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── config/              # Configurações (database, seedDatabase)
│   │   │   ├── database.js      # Configuração do MongoDB
│   │   │   └── seedDatabase.js  # Script de população inicial
│   │   ├── models/              # Modelos do Mongoose (User, Post)
│   │   │   ├── User.js          # Modelo de usuários
│   │   │   └── Post.js          # Modelo de posts/aulas
│   │   ├── routes/              # Rotas da API
│   │   │   ├── auth.routes.js   # Autenticação e registro
│   │   │   ├── posts.routes.js  # CRUD de aulas/posts
│   │   │   └── admin.routes.js  # Rotas administrativas (CRUD usuários)
│   │   ├── middlewares/         # Middlewares (auth, role)
│   │   │   ├── auth.middleware.js # Middleware de autenticação
│   │   │   └── role.middleware.js # Middleware de autorização
│   │   └── index.js             # Entrada da aplicação
│   ├── package.json             # Dependências do back-end
│   ├── package-lock.json        # Lock das versões das dependências
│   └── .env                     # Variáveis de ambiente
├── front-end/                   # Aplicação Mobile (React Native + Expo)
│   ├── src/
│   │   ├── screens/             # Telas da aplicação
│   │   │   ├── LoginScreen.tsx  # Tela de login
│   │   │   ├── HomeScreen.tsx   # Lista de aulas
│   │   │   ├── CreatePostScreen.tsx # Criar nova aula
│   │   │   ├── TeacherHomeScreen.tsx # Dashboard do professor
│   │   │   ├── StudentHomeScreen.tsx # Dashboard do aluno
│   │   │   ├── ProfessoresListScreen.tsx # Lista de professores
│   │   │   ├── CreateProfessorScreen.tsx # Criar professor
│   │   │   ├── EditProfessorScreen.tsx # Editar professor
│   │   │   ├── AlunosListScreen.tsx # Lista de alunos
│   │   │   ├── CreateAlunoScreen.tsx # Criar aluno
│   │   │   └── EditAlunoScreen.tsx # Editar aluno
│   │   ├── services/            # Serviços de API
│   │   │   ├── authService.ts   # Autenticação
│   │   │   ├── postService.ts   # Gerenciamento de posts
│   │   │   └── adminService.ts  # Funcionalidades administrativas
│   │   ├── navigation/          # Navegação entre telas
│   │   │   └── AppNavigator.tsx # Configuração de rotas
│   │   └── config/              # Configurações
│   │       └── api.ts           # Configuração da API
│   ├── assets/                  # Imagens e recursos
│   │   ├── logo-avanco.png      # Logo da aplicação
│   │   ├── icon.png             # Ícone do app
│   │   ├── splash-icon.png      # Ícone de splash screen
│   │   ├── adaptive-icon.png    # Ícone adaptativo
│   │   └── favicon.png          # Favicon
│   ├── app.json                 # Configurações do Expo
│   ├── package.json             # Dependências do front-end
│   ├── package-lock.json        # Lock das versões das dependências
│   ├── tsconfig.json            # Configurações TypeScript
│   ├── metro.config.js          # Configurações do Metro bundler
│   ├── App.tsx                  # Componente principal
│   ├── index.ts                 # Ponto de entrada
│   └── .env                     # Variáveis de ambiente do front-end
├── docker-compose.yml           # Orquestração completa (MongoDB + API)
├── docker-compose.dev.yml       # Apenas MongoDB para desenvolvimento
├── Dockerfile                   # Build da API
├── .dockerignore               # Arquivos ignorados no build
├── .gitignore                  # Arquivos ignorados no Git
└── README.md                   # Este arquivo
```

## Banco de Dados e Armazenamento

### **MongoDB com Mongoose**
A aplicação utiliza **MongoDB** como banco de dados NoSQL, com **Mongoose** como ODM (Object Document Mapper) para facilitar a interação com o banco.

#### **Modelos de Dados:**

**Modelo User (Usuários):**
```javascript
{
  _id: ObjectId,
  username: String (único, obrigatório),
  password: String (hasheado com bcrypt, mín. 6 caracteres),
  role: String (enum: ['professor', 'aluno'], default: 'aluno'),
  createdAt: Date (automático),
  updatedAt: Date (automático)
}
```

**Modelo Post (Aulas):**
```javascript
{
  _id: ObjectId,
  title: String (obrigatório, máx. 200 caracteres),
  description: String (obrigatório),
  subject: String (obrigatório),
  author: String (nome do autor),
  authorId: ObjectId (referência ao User),
  createdAt: Date (automático),
  updatedAt: Date (automático)
}
```

#### **Funcionalidades do Banco:**
- **Índices otimizados** para busca por texto nos posts
- **Validações de schema** com Mongoose
- **Timestamps automáticos** (createdAt/updatedAt)
- **Relacionamentos** entre usuários e posts
- **Seed automático** com dados iniciais na primeira execução

#### **Usuários Pré-cadastrados - Credenciais para Teste:**
| Username | Senha | Papel | Descrição |
|----------|-------|-------|-----------|
| `Livia Moura` | `123456` | Professor | Pode criar, editar e excluir aulas, alunos e outros professores, além de buscar aulas por palavras-chave |
| `Guilherme Santana` | `123456` | Professor | Pode criar, editar e excluir aulas, alunos e outros professores, além de buscar aulas por palavras-chave |
| `Marselle Rosas` | `123456` | Professor | Pode criar, editar e excluir aulas, alunos e outros professores, além de buscar aulas por palavras-chave |
| `aluno1` | `123456` | Aluno | Pode apenas visualizar aulas e buscá-las por palavras-chave|

> **Nota:** O sistema cria automaticamente todos os usuários listados acima na primeira execução. 
---

## Arquitetura do Projeto

### **Aplicação Mobile (Front-end)**
Construída com **React Native** e **Expo**, seguindo os padrões de desenvolvimento mobile moderno:

**Funcionalidades por Tipo de Usuário:**

**Professores:**
- Login com autenticação JWT
- Visualizar lista de todas as aulas
- Criar novas aulas com título, descrição e matéria
- Editar suas próprias aulas
- Excluir suas próprias aulas
- Filtrar aulas por palavras-chave
- **Funcionalidades Administrativas:**
  - Gerenciar professores (listar, criar, editar, excluir)
  - Gerenciar alunos (listar, criar, editar, excluir)

**Alunos:**
- Login com autenticação JWT
- Visualizar lista de todas as aulas (somente leitura)
- Filtrar aulas por palavras-chave

### **API RESTful (Back-end)**
Construída com **Node.js** e **Express**, seguindo arquitetura MVC e boas práticas de segurança:

**Rotas Implementadas:**

**Autenticação:**
- `POST /api/login` - Autenticação de usuários
- `POST /api/register` - Registro de novos usuários

**Gerenciamento de Aulas/Posts:**
- `GET /api/posts` - Listar todas as aulas (protegida)
- `POST /api/posts` - Criar nova aula (protegida - apenas professores)
- `GET /api/posts/:id` - Buscar aula específica (protegida)
- `PUT /api/posts/:id` - Editar aula (protegida - apenas autor ou professor)
- `DELETE /api/posts/:id` - Excluir aula (protegida - apenas autor ou professor)

**Rotas Administrativas:**
- `GET /api/admin/professores` - Listar professores (protegida - apenas professores)
- `POST /api/admin/professores` - Criar novo professor (protegida - apenas professores)
- `GET /api/admin/professores/:id` - Buscar professor específico (protegida)
- `PUT /api/admin/professores/:id` - Editar professor (protegida - apenas professores)
- `DELETE /api/admin/professores/:id` - Excluir professor (protegida - apenas professores)
- `GET /api/admin/alunos` - Listar alunos (protegida - apenas professores)
- `POST /api/admin/alunos` - Criar novo aluno (protegida - apenas professores)
- `GET /api/admin/alunos/:id` - Buscar aluno específico (protegida)
- `PUT /api/admin/alunos/:id` - Editar aluno (protegida - apenas professores)
- `DELETE /api/admin/alunos/:id` - Excluir aluno (protegida - apenas professores)

**Segurança Implementada:**
- **Autenticação JWT** com expiração de 24h
- **Middleware de autenticação** para rotas protegidas
- **Middleware de autorização** baseado em roles
- **Validação de dados** de entrada
- **Variáveis de ambiente** para configurações sensíveis

---

## Tecnologias Utilizadas

### **Front-end (Mobile com React Native + Expo)**
- **React Native** – Framework multiplataforma para desenvolvimento mobile
- **Expo** – Plataforma para simplificar desenvolvimento e deploy
- **TypeScript** – Tipagem estática para maior segurança de código
- **Axios** – Cliente HTTP para comunicação com API
- **AsyncStorage** – Armazenamento local persistente para autenticação

### **Back-end (API com Node.js + Express + MongoDB)**
- **Node.js** – Runtime JavaScript no servidor
- **Express** – Framework web minimalista e flexível
- **MongoDB** – Banco de dados NoSQL orientado a documentos
- **Mongoose** – ODM para MongoDB com schemas e validações
- **JWT** – Autenticação com tokens

### **DevOps e Containerização**
- **Docker** e **Docker Compose** – Containerização e orquestração
- **MongoDB Docker Image** – Instância do banco em container

> **⚠️ Por que Front-end e Back-end no Mesmo Repositório?** Em projetos corporativos, é comum separar front-end e back-end em repositórios distintos para permitir deploy independente, equipes especializadas e versionamento separado. Como este projeto tem caráter educacional, o monorepo oferece vantagens pedagógicas significativas, como:
> - **Facilitar o entendimento** da estrutura do projeto completo
> - **Simplificar a execução** para que professores e alunos possam testar a aplicação sem necessidade de múltiplos repositórios
> - **Demonstrar claramente a integração** entre as duas partes da aplicação para fins de aprendizado
> - **Agilizar a avaliação** tornando o processo de entrega e correção mais simples para os docentes
> - **Acesso completo** para que qualquer pessoa que clone o projeto tenha acesso a todo o ecossistema da aplicação em um único lugar

---

## Arquivos de Configuração

### **.gitignore**
Configurado para ignorar arquivos desnecessários:
- `node_modules/` (dependências)
- `.expo/`, `.vscode/` (arquivos de IDE)
- `*.log` (logs temporários)
- Arquivos de sistema (`.DS_Store`, `Thumbs.db`)

> **⚠️ Nota:** O arquivo `.env` foi **intencionalmente incluído** no repositório para facilitar a execução pelos professores e colegas. Em projetos reais, este arquivo deve ser mantido em `.gitignore` por segurança.

### **.dockerignore**
Otimiza o build Docker ignorando:
- `node_modules`, logs, arquivos de desenvolvimento
- Documentação e arquivos de configuração desnecessários

> **⚠️ Nota:** O arquivo `.env` também é **incluído nas imagens Docker** (removido do `.dockerignore`) para garantir que os containers funcionem corretamente quando executados via `docker-compose up`. Isso permite que qualquer pessoa execute o projeto completo com um único comando, sem necessidade de configuração manual de variáveis de ambiente. Em ambiente corporativo, essas variáveis seriam injetadas durante o deploy através de sistemas de CI/CD ou orquestradores como Kubernetes.

---

## Como Executar o Projeto

### **Pré-requisitos**
- **Node.js** (v18 ou superior)
- **Docker** e **Docker Compose**
- **Expo CLI** (`npm install -g expo-cli`)
- **Git**
- **Dispositivo móvel** com Expo Go ou **emulador**

### **Execução (Passo a Passo)**

#### **1. Clone e acesse o projeto**
```bash
git clone https://github.com/marsrosas/escola-avanco-app
cd escola-avanco-app
```

#### **2. Subir o MongoDB com Docker**
```bash
docker-compose -f docker-compose.dev.yml up -d
```

#### **3. Executar o Back-end**
```bash
# Terminal 1 - Back-end
cd back-end
npm install
npm run dev
```
> ✅ Mensagens de sucesso aparecerão no terminal!

#### **4. Executar o Front-end**
```bash
# Terminal 2 - Front-end (novo terminal)
cd front-end
npm install
npm start
```

#### **5. Abrir no navegador (recomendado):**
- **Pressione `w`** no terminal do Expo
- **Configure visualização mobile:** 
   - Pressione `F12` (ou clique com botão direito → "Inspecionar")
   - Clique no ícone de dispositivo mobile ou pressione `Ctrl+Shift+M`
   - Selecione um dispositivo (iPhone, Samsung, etc.) ou configure dimensões customizadas

> **⚠️ Nota:** O QR Code frequentemente apresenta problemas de conectividade. O teste via navegador oferece melhor experiência para avaliação.

#### **6. Testar a aplicação**
- **Login Professor:** `Livia Moura` / `123456` (ou qualquer professor listado na documentação)
- **Login Aluno:** `aluno1` / `123456`

### **7. Para parar**
```bash
# Parar MongoDB
docker-compose -f docker-compose.dev.yml down
```

```bash
# Parar servidores em cada terminal (front e back end)
Ctrl+C 
```

---

## Solução de Problemas

### **🔧 Problemas Comuns e Soluções**

#### **MongoDB não conecta**
```bash
# Verificar se MongoDB está rodando
docker ps | grep mongo

# Se não estiver, iniciar:
docker-compose -f docker-compose.dev.yml up -d

# Aguardar 30 segundos para inicialização
```

#### **"Usuário não encontrado" no login**
- Verifique se digitou o username **corretamente** 
- Senha sempre: `123456`

#### **Botões de navegação não funcionam**
```bash
# Limpar cache do Expo (no front-end)
cd front-end
rm -rf .expo .metro node_modules/.cache
npm install
npm start --clear
```

#### **Erro de JWT/Token**
- Verifique se arquivo `.env` existe no `back-end/`
- Reinicie a API: `Ctrl+C` + `npm run dev`

#### **API não responde**
```bash
# Testar se API está funcionando
curl http://localhost:3000/
# Deve retornar uma mensagem indicando que a API está funcionando
```

#### **Front-end não carrega**
```bash
# No diretório front-end
npm install
npm start
# Pressione 'w' para abrir no navegador
```

### **🚨 Reset Completo (último recurso)**
```bash
# 1. Parar tudo
docker-compose -f docker-compose.dev.yml down

# 2. Limpar dados (ATENÇÃO: apaga banco)
docker-compose -f docker-compose.dev.yml down -v

# 3. Reiniciar MongoDB
docker-compose -f docker-compose.dev.yml up -d

# 4. Aguardar inicialização
sleep 30

# 5. Reiniciar back-end
cd back-end
npm run dev

# 6. Reiniciar front-end (novo terminal)
cd front-end
npm start
```

---

## Principais Desafios

**1. Desenvolvimento Mobile com React Native + Expo**
- **Limitações do Expo Go via QR Code:** O código QR raramente funcionava de forma consistente no dispositivo móvel, gerando frustrações durante o desenvolvimento e testes
- **Complexidade do Android Studio:** Dificuldades na configuração e uso do Android Studio levaram à decisão de utilizar o Expo Go via navegador como alternativa
- **Teste em navegador:** Adaptação para testar a aplicação mobile no navegador com formato de tela de celular, que embora funcional, não replica completamente a experiência mobile real

**2. Versionamento de dependências:** Manter compatibilidade entre diferentes versões do Node.js, React Native e Expo

**3. Decisões Arquiteturais para Contexto Acadêmico**
- **Monorepo vs. Repositórios separados:** Balancear boas práticas corporativas com necessidades pedagógicas
- **Exposição de variáveis sensíveis:** Incluir arquivo `.env` no repositório para facilitar avaliação, contrariando práticas de segurança em produção

4. **Flexibilidade de ferramentas:** Quando uma ferramenta não funciona adequadamente (Expo Go via QR), buscar alternativas viáveis

5. **Testes contínuos:** Testar integração frequentemente evita problemas de última hora

---

**Projeto Acadêmico - Tech Challenge FIAP - fase 4**  
**Estudantes:** Guilherme Santana | Lívia Moura | Marselle Rosas
