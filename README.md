# Universidade Virtual Livre

<p align="center">
  <img src="https://raw.githubusercontent.com/Universidade-Livre/imagens/main/outras/ubl_logo.png" alt="Universidade Brasileira Livre Logo" width="200">
</p>

<h3 align="center">Uma plataforma de educação autodidata, gratuita e de código aberto.</h3>

<p align="center">
  <a href="https://github.com/sindresorhus/awesome">
    <img alt="Awesome" src="https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg">
  </a>
  <a href="https://github.com/ossu/computer-science">
    <img alt="Open Source Society University" src="https://img.shields.io/badge/OSSU-computer--science-blue.svg">
  </a>
</p>

Bem-vindo à Universidade Virtual Livre, uma plataforma online projetada para fornecer um caminho estruturado e autodidata para uma educação completa em diversas áreas do conhecimento, começando com Ciência da Computação e Matemática.

Este projeto organiza os melhores cursos e materiais online gratuitos de universidades e institutos de renome em um currículo coeso, permitindo que qualquer pessoa com disciplina e motivação possa adquirir uma educação de alta qualidade.

## ✨ Funcionalidades

- **Currículos Abrangentes:** Cursos completos de Ciência da Computação e Matemática, com mais áreas planejadas para o futuro.
- **Painel do Aluno Unificado:** Um dashboard central que rastreia seu progresso em todos os cursos, mostrando disciplinas concluídas, horas de estudo e badges conquistados.
- **Rastreamento de Progresso:** Marque aulas e leituras como concluídas e faça anotações rápidas para cada disciplina, com todo o progresso salvo localmente no seu navegador.
- **Visualização de Dependências:** Um gráfico interativo de dependências gerado com D3.js para ajudar a visualizar o caminho de aprendizado e os pré-requisitos de cada disciplina.
- **Gamificação:** Conquiste badges ao completar etapas e cursos, comemorando seu progresso com animações.
- **Tutor com IA:** Um chatbot inteligente e sensível ao contexto, que atua como um tutor especialista para o curso que você está estudando.
- **Ferramentas de Produtividade:** Um timer Pomodoro integrado para ajudar a gerenciar sessões de estudo focadas.
- **Backend Robusto:** Um servidor Node.js com Express e PostgreSQL para gerenciar autenticação de usuários e sincronização de progresso (quando implantado).

## 💻 Stack de Tecnologias

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla JS)
- **Visualização de Dados:** D3.js
- **Backend:** Node.js, Express.js
- **Banco de Dados:** PostgreSQL
- **IA:** Google Gemini Pro

## 📂 Estrutura do Projeto

O projeto é organizado em uma arquitetura modular para facilitar a manutenção e a adição de novos cursos.

```
universidade-livre-virtual/
│
├──  G index.html                   # Landing page principal da universidade
├── G cursos/                      # Contém todos os cursos disponíveis
│   ├── G ciencia-computacao/      # Pasta do curso de Ciência da Computação
│   │   ├── index.html
│   │   ├── data.js                # Currículo e dados do curso
│   │   ├── script.js              # Lógica específica do curso
│   │   └── style.css              # Estilos específicos do curso
│   │
│   └── G matematica/              # Pasta do curso de Matemática
│       └── ...
│
├── G dashboard/                   # Painel unificado do aluno
│   └── index.html
│
├── G shared/                      # Código compartilhado entre todas as páginas
│   ├── G scripts/
│   │   ├── auth.js                # Lógica de autenticação
│   │   └── storage.js             # Gerenciamento do progresso no localStorage
│   │
│   └── G styles/
│       └── global.css             # Estilos globais
│
├── G backend/                     # Servidor backend
│   ├── server.js                  # Lógica do servidor Express
│   ├── package.json
│   └── .env.example
│
├── universidade.sql               # Schema do banco de dados PostgreSQL
└── README.md                      # Este arquivo
```

## 🚀 Começando

Para executar este projeto localmente, você precisará ter o [Node.js](https://nodejs.org/) e o [PostgreSQL](https://www.postgresql.org/) instalados.

### 1. Clone o Repositório

```bash
git clone https://github.com/SEU-USUARIO/universidade-livre-virtual.git
cd universidade-livre-virtual
```

### 2. Configure o Banco de Dados

1.  Inicie o serviço do PostgreSQL em sua máquina.
2.  Crie um novo banco de dados. Você pode usar um cliente de banco de dados como DBeaver ou o terminal `psql`.

    ```sql
    CREATE DATABASE universidade;
    ```

3.  Execute o schema `universidade.sql` para criar as tabelas `users` e `progress`.

    ```bash
    psql -U seu_usuario -d universidade -f universidade.sql
    ```

### 3. Configure o Backend

1.  Navegue até a pasta do backend e instale as dependências.

    ```bash
    cd backend
    npm install
    ```

2.  Crie um arquivo `.env` a partir do exemplo e preencha as variáveis de ambiente.

    ```bash
    cp .env.example .env
    ```

3.  Edite o arquivo `.env` com suas credenciais do banco de dados e uma chave secreta para JWT.

    ```
    DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/universidade"
    JWT_SECRET="sua-chave-secreta-super-segura"
    GEMINI_API_KEY="sua-chave-da-api-do-gemini"
    ```

### 4. Execute a Aplicação

1.  Volte para a raiz do projeto.
2.  Inicie o servidor Node.js.

    ```bash
    cd ..
    node backend/server.js
    ```

3.  Abra seu navegador e acesse `http://localhost:3000`.

A aplicação agora está rodando localmente!

## 🤝 Contribuindo

Contribuições são bem-vindas! Se você tem ideias para novos cursos, melhorias de funcionalidades ou correções de bugs, sinta-se à vontade para abrir uma issue ou enviar um pull request.

## 📄 Licença

Este projeto é baseado no trabalho da [Universidade Brasileira Livre](https://github.com/Universidade-Livre) e é distribuído sob a Licença MIT.
