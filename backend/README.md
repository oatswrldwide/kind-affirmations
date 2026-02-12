# Kind Affirmations Backend

Express.js backend for generating AI-powered affirmations using OpenRouter.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure OpenRouter API key (choose one):

   **Option A - Environment Secret (Recommended):**
   - **GitHub Codespaces**: Add `OPENROUTER_API_KEY` in repo Settings → Codespaces → Secrets
   - **Railway**: Add `OPENROUTER_API_KEY` in project Variables tab
   - **Local**: `export OPENROUTER_API_KEY=sk-or-v1-your-key-here`

   **Option B - .env file:**
   ```bash
   cp .env.example .env
   # Edit .env and add: OPENROUTER_API_KEY=sk-or-v1-your-key-here
   ```

## Development

```bash
npm run dev   # Start with auto-reload
# or
npm start     # Start without auto-reload
```

Server will run on `http://localhost:3001`

## API Endpoints

### POST `/api/generate-affirmation`

Generate a personalized affirmation.

**Request:**
```json
{
  "message": "I'm feeling overwhelmed at work"
}
```

**Response:**
Server-Sent Events stream with AI-generated affirmation

### GET `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-12T10:30:00.000Z"
}
```

## Deployment

### Railway

1. Connect your GitHub repository to Railway
2. Set environment variable: `OPENROUTER_API_KEY`
3. Railway auto-deploys on push to main

### Other Platforms

- **Render**: Connect repo, add env vars
- **Fly.io**: Use `fly launch` and `fly secrets set`
- **Heroku**: Add Procfile: `web: npm start`

## Model Configuration

Change the AI model in `server.js`:

```javascript
model: 'anthropic/claude-3.5-sonnet',
```

Available models:
- `anthropic/claude-3.5-sonnet` (current)
- `openai/gpt-4o`
- `openai/gpt-4-turbo`
- `anthropic/claude-3-opus`
- `google/gemini-pro-1.5`

See all models: https://openrouter.ai/models
