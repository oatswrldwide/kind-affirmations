# Kind Affirmations

A compassionate web app that generates personalized, AI-powered affirmations to help users feel supported and validated.

## Tech Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express
- **AI**: OpenRouter (Claude 3.5 Sonnet)
- **Package Manager**: npm (use `npm install`, not `bun install`)

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## Backend: Node.js + Express

This app uses a simple Node.js/Express backend with [OpenRouter](https://openrouter.ai/) to generate personalized affirmations using Claude 3.5 Sonnet.

### Local Development Setup

1. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install && cd ..
   ```

2. **Get an OpenRouter API key**
   - Sign up at [openrouter.ai](https://openrouter.ai/)
   - Create an API key from your dashboard

3. **Configure backend** (choose one option):

   **Option A - GitHub Codespaces Secret (Recommended for security):**
   - Go to your repo **Settings** → **Secrets and variables** → **Codespaces**
   - Add secret: `OPENROUTER_API_KEY` with your key
   - Rebuild/restart your Codespace
   
   **Option B - Local .env file:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env and add your OpenRouter API key
   ```

4. **Start both servers**
   
   Option 1 - Run both together:
   ```bash
   npm run dev:all
   ```
   
   Option 2 - Run separately in different terminals:
   ```bash
   # Terminal 1 - Backend
   npm run dev:backend
   
   # Terminal 2 - Frontend
   npm run dev
   ```

The backend runs on `http://localhost:3001` and frontend on `http://localhost:5173`.

### Deploying to Railway

Railway provides automatic deployments from your GitHub repository with zero configuration needed.

#### Step 1: Create Railway Project

1. Go to [railway.app](https://railway.app/) and sign in with GitHub
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `kind-affirmations` repository
5. Railway will automatically detect the Node.js backend

#### Step 2: Set Environment Variables

In your Railway project dashboard:

1. Go to **Variables** tab
2. Add the following variable:
   ```
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```
3. Railway will automatically restart your app

#### Step 3: Get Your Backend URL

1. Railway will provide a public URL like `https://your-app.up.railway.app`
2. Copy this URL

#### Step 4: Configure Frontend

Update your frontend's `.env` file:

```env
VITE_API_URL=https://your-app.up.railway.app/api/generate-affirmation
```

#### Step 5: Deploy Frontend

Deploy your frontend to:
- **Vercel**: `npx vercel --prod`
- **Netlify**: `npx netlify deploy --prod`
- **Railway**: Create a separate service for the frontend

### Auto-Deploy Setup

Railway automatically deploys when you push to your GitHub repository:

```bash
git add .
git commit -m "Update backend"
git push origin main
```

Railway will detect changes and redeploy automatically! 🚀

### Changing the AI Model

Edit [`backend/server.js`](backend/server.js) and change the model:

```javascript
model: 'anthropic/claude-3.5-sonnet',  // Current model
// Alternatives:
// - "openai/gpt-4o"
// - "openai/gpt-4-turbo"  
// - "anthropic/claude-3-opus"
// - "google/gemini-pro-1.5"
```

See all available models at [openrouter.ai/models](https://openrouter.ai/models).

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
