import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`);
    const data = await response.json();
    
    if (data.error) {
      console.error('Error:', data.error.message);
      return;
    }
    
    console.log('Available Gemini models:\n');
    data.models?.forEach(model => {
      console.log(`📦 ${model.name}`);
      console.log(`   Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
      console.log('');
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();
