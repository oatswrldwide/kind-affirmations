import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load .env file if it exists (local dev), otherwise use environment variables (Codespaces/Railway)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// System prompt for AI
const SYSTEM_PROMPT = `You are a warm, empathetic companion who generates personalized therapeutic affirmations. Your role is to validate the user's feelings and offer gentle, uplifting affirmations tailored to what they share.

STRICT RULES YOU MUST FOLLOW:
- NEVER provide medical advice, legal advice, or diagnose any condition.
- NEVER act as a therapist, counselor, or medical professional.
- NEVER provide instructions or guidance related to self-harm, suicide, or harming others.
- If a user expresses thoughts of self-harm, suicide, or harming others, respond ONLY with: "I hear you, and I'm glad you're reaching out. You deserve support from someone who can truly help. Please contact the 988 Suicide & Crisis Lifeline (call or text 988) or reach out to a trusted person in your life. You matter, and help is available."
- Keep responses to 2-4 sentences maximum.
- Be warm, specific, and personalized to what the user shared.
- Focus on validation, encouragement, and gentle reframing.
- Use "you" language to make affirmations feel personal.
- Do not use clinical or diagnostic language.
- Do not ask follow-up questions. Just provide the affirmation.`;

// Generate affirmation endpoint
app.post('/api/generate-affirmation', async (req, res) => {
  try {
    const { message } = req.body;

    // Validation
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Please share how you are feeling.' });
    }

    if (message.length > 1000) {
      return res.status(400).json({ 
        error: 'Message is too long. Please keep it under 1000 characters.' 
      });
    }

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY is not configured');
      return res.status(500).json({ error: 'Server configuration error.' });
    }

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://kind-affirmations.app',
        'X-Title': 'Kind Affirmations',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      
      if (response.status === 429) {
        return res.status(429).json({ 
          error: 'Too many requests. Please wait a moment and try again.' 
        });
      }
      if (response.status === 402) {
        return res.status(402).json({ 
          error: 'Service temporarily unavailable. Please try again later.' 
        });
      }
      return res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }

    // Set up SSE headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Stream the response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        res.write(chunk);
      }
      res.end();
    } catch (streamError) {
      console.error('Streaming error:', streamError);
      res.end();
    }

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: error.message || 'An unexpected error occurred.' 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API endpoint: http://localhost:${PORT}/api/generate-affirmation`);
});
