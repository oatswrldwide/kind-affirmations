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

// System prompt for AI - Kept concise for free tier efficiency
const SYSTEM_PROMPT = `You are a warm, empathetic companion. Generate a brief, personalized affirmation (2-3 sentences max) based on the user's feelings. Be warm and validating. Never provide medical/legal advice or act as a therapist. If user mentions self-harm, respond: "Please contact 988 Suicide & Crisis Lifeline for support."`;

// Generate affirmation endpoint
app.post('/api/generate-affirmation', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { message } = req.body;

    // Enhanced validation - more restrictive for free tier
    if (!message) {
      console.warn('[Validation] Missing message field');
      return res.status(400).json({ 
        error: 'Please share how you are feeling.',
        code: 'MISSING_MESSAGE'
      });
    }

    if (typeof message !== 'string') {
      console.warn('[Validation] Invalid message type:', typeof message);
      return res.status(400).json({ 
        error: 'Invalid message format.',
        code: 'INVALID_TYPE'
      });
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      console.warn('[Validation] Empty message after trim');
      return res.status(400).json({ 
        error: 'Please share how you are feeling.',
        code: 'EMPTY_MESSAGE'
      });
    }

    if (trimmedMessage.length < 5) {
      console.warn('[Validation] Message too short:', trimmedMessage.length);
      return res.status(400).json({ 
        error: 'Please share a bit more (at least 5 characters).',
        code: 'MESSAGE_TOO_SHORT'
      });
    }

    // Stricter limit for free tier - reduces token usage
    if (trimmedMessage.length > 500) {
      console.warn('[Validation] Message too long:', trimmedMessage.length);
      return res.status(400).json({ 
        error: 'Please keep your message under 500 characters for best results.',
        code: 'MESSAGE_TOO_LONG'
      });
    }

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      console.error('[Config] OPENROUTER_API_KEY is not configured');
      return res.status(500).json({ 
        error: 'Service configuration error. Please contact support.',
        code: 'CONFIG_ERROR'
      });
    }

    console.log('[Request] Starting affirmation generation, message length:', trimmedMessage.length);

    // Call OpenRouter API with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    let response;
    try {
      console.log('[OpenRouter] Calling API...');
      response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://kind-affirmations.app',
          'X-Title': 'Kind Affirmations',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.2-3b-instruct:free', // Free tier model
          // Other free options:
          // - 'nousresearch/hermes-3-llama-3.1-405b:free'
          // - 'qwen/qwen-2-7b-instruct:free'
          // Paid alternatives:
          // - 'anthropic/claude-3.5-sonnet'
          // - 'openai/gpt-4o'
          // - 'google/gemini-pro-1.5'
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: trimmedMessage },
          ],
          stream: true,
        })messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: trimmedMessage },
          ],
          stream: true,
          // Optimize for free tier - minimal token usage
          max_tokens: 150, // Limit response length
          temperature: 0.7, // Balanced creativity
          top_p: 0.9UT'
        });
      }
      console.error('[OpenRouter] Network error:', fetchError.message);
      return res.status(502).json({ 
        error: 'Unable to connect to AI service. Please try again.',
        code: 'NETWORK_ERROR'
      });
    }

    if (!response.ok) {
      let errorText;
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = 'Unable to read error response';
      }
      
      console.error('[OpenRouter] API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      // Handle specific error codes
      if (response.status === 401) {
        console.error('[OpenRouter] Invalid API key');
        return res.status(502).json({ 
          error: 'Service authentication failed. Please contact support.',
          code: 'AUTH_ERROR'
        });
      }
      
      if (response.status === 429) {
        console.warn('[OpenRouter] Rate limited');
        return res.status(429).json({ 
          error: 'Too many requests. Please wait a moment and try again.',
          code: 'RATE_LIMITED'
        });
      }
      
      if (response.status === 402) {
        console.error('[OpenRouter] Payment required');
        return res.status(502).json({ 
          error: 'Service temporarily unavailable. Please try again later.',
          code: 'SERVICE_UNAVAILABLE'
        });
      }
      
      if (response.status >= 500) {
        console.error('[OpenRouter] Server error');
        return res.status(502).json({ 
          error: 'AI service is experiencing issues. Please try again in a moment.',
          code: 'UPSTREAM_ERROR'
        });
      }
      
      return res.status(502).json({ 
        error: 'Unable to generate affirmation. Please try again.',
        code: 'API_ERROR'
      });
    }

    // Set up SSE headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    console.log('[Stream] Starting to stream response');
    let chunkCount = 0;

    // Stream the response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log(`[Stream] Completed successfully, chunks: ${chunkCount}, duration: ${Date.now() - startTime}ms`);
          break;
        }
        
        const chunk = decoder.decode(value, { stream: true });
        res.write(chunk);
        chunkCount++;
      }
      res.end();
    } catch (streamError) {
      console.error('[Stream] Error during streaming:', streamError.message);
      // Try to send error to client if headers not already sent
      if (!res.headersSent) {
        res.status(500).json({ 
          error: 'Stream interrupted. Please try again.',
          code: 'STREAM_ERROR'
        });
      }
      res.end();
    }

  } catch (error) {
    console.error('[Server] Unexpected error:', {
      message: error.message,
      stack: error.stack,
      duration: Date.now() - startTime
    });
    
    // Only send error response if headers haven't been sent yet
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'An unexpected error occurred. Please try again.',
        code: 'INTERNAL_ERROR'
      });
    }
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
