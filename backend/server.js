// Import necessary libraries
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
require('dotenv').config();

// Initialize Express app
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Google Generative AI & other dependencies
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Setup lowdb
const adapter = new FileSync('db.json');
const db = low(adapter);
db.defaults({ users: [] }).write();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'a-very-secret-key-that-should-be-in-env';


// --- User Authentication API ---

// Register a new user
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    const existingUser = db.get('users').find({ email }).value();
    if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { id: Date.now().toString(), email, password: hashedPassword, progress: {} };

    db.get('users').push(user).write();
    res.status(201).json({ message: 'User registered successfully.' });
});

// Login a user
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = db.get('users').find({ email }).value();

    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
});


// --- Middleware for token verification ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- Progress Sync API ---

// Get user progress
app.get('/api/progress', authenticateToken, (req, res) => {
    const user = db.get('users').find({ id: req.user.userId }).value();
    res.json(user.progress || {});
});

// Save user progress
app.post('/api/progress', authenticateToken, (req, res) => {
    const { progress } = req.body;
    db.get('users').find({ id: req.user.userId }).assign({ progress }).write();
    res.json({ message: 'Progress saved successfully.' });
});


// --- AI Tutor Chat API ---
app.post('/chat', async (req, res) => {
  const { message, history, context } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    // Detecta qual curso está sendo usado
const getCourseSpecificPrompt = (context) => {
    if (context.includes('Matemática')) {
        return `Você é um tutor especialista em MATEMÁTICA para uma universidade livre brasileira.
        Seu nome é Math Tutor AI.
        Sua missão é ajudar os alunos a entender conceitos de:
        - Cálculo Diferencial e Integral
        - Álgebra Linear
        - Análise Real
        - Topologia
        - Equações Diferenciais
        - Teoria dos Números

        Seja didático, use exemplos visuais quando possível (ASCII art),
        e explique passo a passo. Quando apropriado, mostre demonstrações matemáticas.
        Use LaTeX para fórmulas complexas entre $.

        Contexto atual do aluno: ${context}`;
    } else {
        return `Você é um tutor especialista em CIÊNCIA DA COMPUTAÇÃO para uma universidade livre brasileira.
        Seu nome é CS Tutor AI.
        Sua missão é ajudar os alunos a entender conceitos de:
        - Programação
        - Algoritmos e Estruturas de Dados
        - Redes de Computadores
        - Banco de Dados
        - Inteligência Artificial
        - Sistemas Operacionais

        Seja didático, amigável e use exemplos de código quando apropriado.
        Formate suas respostas com Markdown.

        Contexto atual do aluno: ${context}`;
    }
};

const system_prompt = getCourseSpecificPrompt(context || 'Nenhum contexto fornecido.');

    const chat = model.startChat({
        history: history || [],
        generationConfig: {
            maxOutputTokens: 1000, // Increased for more detailed answers
        },
    });

    const full_prompt = `${system_prompt}\n\nPERGUNTA: ${message}`;

    const result = await chat.sendMessage(full_prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error('Error communicating with Gemini API:', error);
    res.status(500).json({ error: 'Failed to get a response from the AI.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
