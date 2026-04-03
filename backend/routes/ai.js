const express = require('express');
const axios   = require('axios');
const authMW  = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/ai/chat
router.post('/chat', authMW, async (req, res) => {
  try {
    const { messages, system } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' });
    }

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model:      'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system:     system || 'You are a helpful financial assistant for Cashline app.',
        messages,
      },
      {
        headers: {
          'x-api-key':         process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type':      'application/json',
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error('[AI proxy error]', err.response?.data || err.message);
    res.status(500).json({ error: 'AI request failed' });
  }
});

module.exports = router;