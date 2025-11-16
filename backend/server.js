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

// Initialize Google Generative AI
// Make sure to have GEMINI_API_KEY in your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// API endpoint to handle chat requests
app.post('/chat', async (req, res) => {
  const { message, history, context } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    const system_prompt = `Você é um tutor especialista em Ciência da Computação para uma universidade livre brasileira. Seu nome é AI Tutor.
    Sua missão é ajudar os alunos a entender conceitos complexos, depurar código e encontrar recursos de aprendizado.
    Seja didático, amigável e use exemplos claros. Formate suas respostas com Markdown (use listas, negrito, etc.) e sempre que incluir código, use blocos de código formatados.

    Contexto atual do aluno: ${context || 'Nenhum contexto fornecido.'}

    Responda a pergunta do aluno com base nesse contexto.`;

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
