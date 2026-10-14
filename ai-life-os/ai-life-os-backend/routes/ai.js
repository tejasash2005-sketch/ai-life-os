const express = require('express');
const axios = require('axios');
const router = express.Router();

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const MODEL = process.env.OLLAMA_MODEL || 'llama3.1:8b';

// Helper — call Ollama
async function callOllama(prompt, system = '') {
  const messages = [];
  if (system) messages.push({ role: 'system', content: system });
  messages.push({ role: 'user', content: prompt });

  const response = await axios.post(
    `${OLLAMA_URL}/api/chat`,
    {
      model: MODEL,
      messages,
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        num_predict: 1000,
      }
    },
    { timeout: 120000 } // 2 min timeout — Llama can be slow
  );

  return response.data.message?.content || 'No response from model.';
}

// POST /api/ai/chat — main endpoint
router.post('/chat', async (req, res) => {
  const { prompt, system } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    console.log(`🦙 Llama query: "${prompt.slice(0, 60)}..."`);
    const response = await callOllama(prompt, system);
    console.log(`✅ Llama responded (${response.length} chars)`);
    res.json({ response });
  } catch (err) {
    console.error('❌ Ollama error:', err.message);

    if (err.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: 'Ollama is not running. Start it with: ollama serve',
      });
    }
    if (err.code === 'ECONNABORTED') {
      return res.status(504).json({
        error: 'Llama took too long to respond. Try a shorter prompt.',
      });
    }
    res.status(500).json({ error: 'AI request failed: ' + err.message });
  }
});

// GET /api/ai/status — check if Ollama is running
router.get('/status', async (req, res) => {
  try {
    const { data } = await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 3000 });
    const models = data.models?.map(m => m.name) || [];
    const hasLlama = models.some(m => m.includes('llama'));
    res.json({
      status: 'online',
      models,
      hasLlama,
      activeModel: MODEL,
      message: hasLlama ? '✅ Llama ready' : '⚠️ Llama model not found — run: ollama pull llama3.1:8b'
    });
  } catch {
    res.json({
      status: 'offline',
      message: '❌ Ollama not running — run: ollama serve'
    });
  }
});

// POST /api/ai/stream — streaming response (optional)
router.post('/stream', async (req, res) => {
  const { prompt, system } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt required' });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const messages = [];
  if (system) messages.push({ role: 'system', content: system });
  messages.push({ role: 'user', content: prompt });

  try {
    const response = await axios.post(
      `${OLLAMA_URL}/api/chat`,
      { model: MODEL, messages, stream: true },
      { responseType: 'stream', timeout: 120000 }
    );

    response.data.on('data', chunk => {
      try {
        const lines = chunk.toString().split('\n').filter(Boolean);
        for (const line of lines) {
          const json = JSON.parse(line);
          if (json.message?.content) {
            res.write(`data: ${JSON.stringify({ token: json.message.content })}\n\n`);
          }
          if (json.done) {
            res.write('data: [DONE]\n\n');
            res.end();
          }
        }
      } catch {}
    });

    response.data.on('error', () => res.end());
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});

module.exports = router;