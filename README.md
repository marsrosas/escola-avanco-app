# Escola Avanço Blogging - Projeto Full Stack
![Logo Escola Avanço)](https://github.com/user-attachments/assets/e81aa3e9-732c-4143-b495-47710bbbe543)

 ## Introdução
No cenário educacional atual, a falta de ferramentas adequadas dificulta a publicação e o compartilhamento de conteúdos educacionais de forma centralizada e acessível. A aplicação Escola Avanço foi desenvolvida para enfrentar esse desafio, permitindo que professores da rede pública publiquem aulas de maneira intuitiva e tecnológica, enquanto os alunos têm acesso fácil e organizado a esses materiais.

A aplicação consiste em um projeto de aplicativo mobile + API RESTful desenvolvido para simular o ambiente de uma escola, permitindo que professores criem, editem e excluam aulas, e que alunos possam visualizar e filtrar os conteúdos postados.

---

## Estrutura do Projeto
O repositório está organizado da seguinte forma:

escola-avanco/
├── back-end/ # Código-fonte da API (Express + Node.js)
├── front-end/ # Aplicação mobile (React Native com Expo)
├── .gitignore # Arquivo que define o que não deve ser enviado ao Git
├── README.md # Este arquivo de instrução do projeto

### 📄 .gitignore
O arquivo `.gitignore` está localizado na raiz do projeto e é responsável por impedir o versionamento de arquivos e pastas desnecessários, como:

- `node_modules/` (pastas de dependências),
- `.expo/`, `.vscode/`, `*.log` (arquivos temporários ou locais),
- arquivos específicos de sistema como `.DS_Store` e `Thumbs.db`.

> **Nota importante:** Embora normalmente arquivos `.env` (com variáveis de ambiente) sejam ignorados por segurança, **neste projeto educacional o arquivo `.env` foi intencionalmente incluído no repositório**, para facilitar a execução pelos professores e colegas que forem baixar o projeto.  Por isso, a linha que ignorava o `.env` foi **comentanda** no `.gitignore`.

---

## Arquitetura do projeto

### Aplicação Mobile (Front-end)
Construída com **React Native** e **Expo**, a interface mobile permite que:
- Professores façam login, cadastrem novas aulas, editem ou excluam suas aulas;
- Alunos façam login e tenham acesso apenas à listagem e ao filtro das aulas.

### API RESTful (Back-end)
Construída com **Node.js** e **Express**, utilizando autenticação JWT e estrutura de rotas para:
- Autenticação de professores e alunos
- Criação, listagem, edição e exclusão de aulas
- Proteção de rotas com base no perfil do usuário

A autenticação JWT é usada para proteger rotas e garantir que apenas professores possam criar, editar ou excluir aulas.

---

## Tecnologias Utilizadas

### **Front-end (Mobile com React Native + Expo)** 
- **React Native** – para desenvolvimento da interface mobile.
- **Expo** – para simplificar o ambiente de execução e build.
- **Axios** – para requisições HTTP à API.
- **React Navigation** – para navegação entre telas.
- **AsyncStorage** – para armazenar o token JWT localmente.
- **jwt-decode** – para decodificar o token e obter informações do usuário.

### **Back-end (API com Node.js + Express)**
- **Node.js** – ambiente de execução JavaScript no servidor.
- **Express** – framework para estruturar as rotas e middlewares.
- **jsonwebtoken (JWT)** – para autenticação e proteção de rotas.
- **dotenv** – para uso de variáveis de ambiente.
- **cors** – para permitir a comunicação entre front-end e back-end durante o desenvolvimento.

> **Por que front-end e back-end estão no mesmo repositório?**
> Como este projeto tem caráter educacional, a decisão de manter front-end e back-end no mesmo repositório foi tomada para:
> - Facilitar o entendimento da estrutura do projeto completo;
> - Ajudar professores e alunos a executarem e testarem a aplicação sem necessidade de múltiplos repositórios;
> - Garantir que a comunicação entre as duas partes da aplicação esteja visível e bem integrada para fins de aprendizado;
> - Tornar mais simples o processo de entrega, correção e revisão por parte dos docentes.
> Essa escolha permite que qualquer pessoa que clone o projeto tenha acesso a todo o ecossistema da aplicação em um único lugar.

---

## Como executar o projeto localmente

### Pré-requisitos
- Node.js
- Expo CLI (`npm install -g expo-cli`)
- Git
- Dispositivo físico ou emulador com Expo Go
- WSL (se estiver em Windows)

### Passo 1 – Clone o repositório

```bash
git clone https://github.com/marsrosas/escola-avanco-app
cd escola-avanco
```

### Passo 2 – Instale as dependências

**No back-end:**

```bash
cd back-end
npm install
```

**No front-end:**

```bash
cd front-end
npm install
```

### Passo 3 – Execute o projeto
Em dois terminais separados:

**Terminal 1 – Back-end:**

```bash
cd back-end
npm run dev
```

**Terminal 2 – Front-end:**
 
```bash
cd front-end
npm start
```
---

## Teste:
1) Instale o app Expo Go no seu celular
2) Após `npm start`, escaneie o QR Code exibido no terminal ou tecle `w` para abri-lo no navegador 