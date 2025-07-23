# 🗃️ Configuração do Banco de Dados - Escola Avanço

## 📋 Guia de Recuperação Rápida

Se você perdeu alguns arquivos ou está tendo problemas com o banco de dados, siga este guia passo a passo:

### ✅ **1. Verificar Arquivos Essenciais**

Todos esses arquivos já estão presentes e funcionando:
- ✅ `.env` - Variáveis de ambiente
- ✅ `src/config/database.js` - Configuração MongoDB
- ✅ `src/models/User.js` - Modelo de usuário
- ✅ `src/models/Post.js` - Modelo de posts
- ✅ `src/config/seedDatabase.js` - Dados iniciais
- ✅ Scripts de manutenção em `src/scripts/`

### 🚀 **2. Executar Configuração Completa**

#### **Passo 1: Iniciar MongoDB**
```bash
# No diretório raiz do projeto
docker-compose -f docker-compose.dev.yml up -d
```

#### **Passo 2: Configurar Banco de Dados**
```bash
# No diretório back-end
cd back-end
npm run setup-db
```

Este comando vai:
- ✅ Testar conexão com MongoDB
- ✅ Criar usuários iniciais se não existirem
- ✅ Criar posts de exemplo
- ✅ Verificar se tudo está funcionando

#### **Passo 3: Iniciar API**
```bash
npm run dev
```

### 🔧 **3. Scripts Disponíveis**

Agora você tem estes scripts úteis:

```bash
npm run setup-db      # Configuração completa do banco
npm run test-db       # Testar conexão
npm run debug-posts   # Ver dados no banco
npm run reset-users   # Recriar usuários
npm run dev          # Iniciar API em modo desenvolvimento
```

### 🔐 **4. Credenciais para Teste**

| Username | Senha | Papel | Descrição |
|----------|-------|-------|-----------|
| `Livia Moura` | `123456` | Professor | Pode criar/editar/excluir aulas |
| `Guilherme Santana` | `123456` | Professor | Pode criar/editar/excluir aulas |
| `Marselle Rosas` | `123456` | Professor | Pode criar/editar/excluir aulas |
| `aluno1` | `123456` | Aluno | Pode apenas visualizar aulas |

> ⚠️ **Importante:** Não inclua espaços após o username!

### 🏥 **5. Solução de Problemas**

#### **Erro: "MongooseServerSelectionError"**
```bash
# Verificar se MongoDB está rodando
docker ps

# Se não estiver, iniciar:
docker-compose -f docker-compose.dev.yml up -d
```

#### **Erro: "Usuário não encontrado"**
```bash
# Recriar usuários
npm run reset-users
```

#### **Banco aparenta estar vazio**
```bash
# Verificar dados
npm run debug-posts

# Se vazio, reconfigurar
npm run setup-db
```

#### **Erro de JWT/Token**
- Verifique se o arquivo `.env` existe e tem `JWT_SECRET`
- Reinicie a API com `npm run dev`

### 📊 **6. Verificar Status**

Para verificar se tudo está funcionando:

```bash
# 1. MongoDB rodando
docker ps | grep mongo

# 2. Dados no banco
npm run debug-posts

# 3. API respondendo
curl http://localhost:3000/

# 4. Login funcionando
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"aluno1","password":"123456"}'
```

### 🎯 **7. Estrutura do Banco**

**Coleção Users:**
```javascript
{
  _id: ObjectId,
  username: String (único),
  password: String (hasheado),
  role: "professor" | "aluno",
  createdAt: Date,
  updatedAt: Date
}
```

**Coleção Posts:**
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  subject: String,
  author: String,
  authorId: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### 📞 **8. Em Caso de Problemas**

Se ainda estiver com problemas, execute na sequência:

```bash
# 1. Parar tudo
docker-compose -f docker-compose.dev.yml down

# 2. Limpar volumes (ATENÇÃO: apaga dados)
docker-compose -f docker-compose.dev.yml down -v

# 3. Iniciar MongoDB limpo
docker-compose -f docker-compose.dev.yml up -d

# 4. Aguardar MongoDB inicializar (30 segundos)
sleep 30

# 5. Configurar banco
npm run setup-db

# 6. Iniciar API
npm run dev
```

---

**Nota:** Este projeto está 100% integrado com MongoDB. Todos os dados são armazenados no banco, não em arquivos JSON.
