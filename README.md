# Kind Affirmations

A compassionate web app that generates personalized, AI-powered affirmations to help users feel supported and validated.

## 🌐 Live URLs

- **Frontend**: https://oatswrldwide.github.io/kind-affirmations/
- **Backend API**: https://kind-affirmations-production.up.railway.app

## 🚀 Tech Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express
- **AI**: Google Gemini API (`gemini-2.0-flash`)
- **Hosting**: GitHub Pages (frontend) + Railway (backend)
- **Package Manager**: npm

## 📋 Required Environment Variables

### Backend (.env)
```env
PORT=3001
GEMINI_API_KEY=your-gemini-api-key-here
```

### Frontend (GitHub Actions Secret)
```env
VITE_API_URL=https://kind-affirmations-production.up.railway.app/api/generate-affirmation
```

## 🏃 How to Run Locally

### Prerequisites
- Node.js 18+ installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- A Google Gemini API key (free tier available)

### Step 1: Clone and Install
```bash
# Clone the repository
git clone https://github.com/oatswrldwide/kind-affirmations.git
cd kind-affirmations

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 2: Get a Gemini API Key (Free)
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (starts with `AIza...`)

### Step 3: Configure Backend
```bash
# Navigate to backend folder
cd backend

# Create .env file
cat > .env << EOF
PORT=3001
GEMINI_API_KEY=your-actual-gemini-api-key-here
EOF
```

**Important**: Replace `your-actual-gemini-api-key-here` with your actual API key!

### Step 4: Start the Servers

**Option 1 - Run both together:**
```bash
npm run dev:all
```

**Option 2 - Run separately in different terminals:**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
npm run dev
```

### Step 5: Open the App
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Test the Backend
```bash
curl -X POST http://localhost:3001/api/generate-affirmation \
  -H "Content-Type: application/json" \
  -d '{"message":"I am feeling happy today"}'
```

## 🚢 How to Deploy

### Frontend: GitHub Pages

#### Initial Setup (One-Time)

1. **Enable GitHub Pages**:
   - Go to repository **Settings** → **Pages**
   - Source: Select **"GitHub Actions"**

2. **Add Backend URL as Secret**:
   - Go to **Settings** → **Secrets and variables** → **Actions**
   - Click **"New repository secret"**
   - Name: `VITE_API_URL`
   - Value: `https://kind-affirmations-production.up.railway.app/api/generate-affirmation`
   - Click **"Add secret"**

3. **Deploy**:
   ```bash
   git push origin main
   ```

#### Automatic Deployments
Every push to `main` automatically builds and deploys to GitHub Pages (takes ~2 minutes).

**Workflow file**: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

### Backend: Railway

#### Initial Setup

1. **Create Railway Account**:
   - Go to [railway.app](https://railway.app/)
   - Sign in with GitHub

2. **Create New Project**:
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Choose `kind-affirmations` repository
   - Railway auto-detects the Node.js backend

3. **Add Environment Variable**:
   - In Railway project dashboard, go to **Variables** tab
   - Click **"+ New Variable"**
   - Name: `GEMINI_API_KEY`
   - Value: Your Gemini API key
   - Click **"Add"**

4. **Get Your Backend URL**:
   - Railway provides a URL like: `https://your-app.up.railway.app`
   - Use this in your frontend's `VITE_API_URL` secret

#### Automatic Deployments
Every push to `main` automatically deploys to Railway (takes ~2 minutes).

**Configuration files**: 
- [`railway.toml`](railway.toml)
- [`nixpacks.toml`](nixpacks.toml)

## 🛠️ Development

### Project Structure
```
kind-affirmations/
├── backend/              # Express API server
│   ├── server.js        # Main server file with Gemini integration
│   ├── .env             # Environment variables (local only)
│   └── package.json     # Backend dependencies
├── src/                 # React frontend
│   ├── pages/           # Page components
│   ├── components/      # Reusable UI components
│   ├── lib/             # Utilities and services
│   └── hooks/           # Custom React hooks
├── public/              # Static assets
└── package.json         # Frontend dependencies
```

### Key Features
- ✅ AI-powered personalized affirmations
- ✅ Streaming responses for real-time feedback
- ✅ Input validation (5-500 characters)
- ✅ Comprehensive error handling
- ✅ Rate limiting protection (15 requests/min)
- ✅ Responsive design with Tailwind CSS
- ✅ No raw errors or stack traces shown to users

### Available Scripts

**Frontend**:
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

**Backend**:
```bash
npm run dev:backend  # Start backend with nodemon (auto-reload)
npm start            # Start backend (production)
```

**Both**:
```bash
npm run dev:all      # Run frontend + backend concurrently
```

## 🔧 Changing the AI Model

Edit [`backend/server.js`](backend/server.js) line 88:

```javascript
const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`;

// Other available Gemini models:
// - gemini-2.5-flash (has extended thinking, uses more tokens)
// - gemini-2.0-flash (current - fast and efficient)
// - gemini-2.5-flash-lite (lighter weight)
```

See all models: https://ai.google.dev/gemini-api/docs/models

## 📊 API Quotas (Free Tier)

- **Requests**: 15 per minute, 1,500 per day
- **Tokens**: 1 million per day
- **Cost**: Free

Monitor usage: https://aistudio.google.com/app/usage

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if API key is set
cd backend
node test-gemini.js

# Expected output: "🎉 Gemini API is working correctly!"
```

### Frontend can't connect to backend
1. Check backend is running: `curl http://localhost:3001/health`
2. Check `VITE_API_URL` in GitHub Actions secrets
3. Redeploy frontend: `git commit --allow-empty -m "Redeploy" && git push`

### Rate limit errors
Wait 60 seconds between requests. Free tier allows 15 requests/minute.

## 📝 Project Info

**Created with**: [Lovable](https://lovable.dev)

## 📄 License

This project is open source and available under the MIT License.
```
