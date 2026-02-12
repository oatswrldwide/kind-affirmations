import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your-gemini-api-key-here') {
  console.error('❌ GEMINI_API_KEY is not set in .env file');
  console.log('\n📝 To get your Gemini API key:');
  console.log('1. Go to https://aistudio.google.com/app/apikey');
  console.log('2. Click "Create API Key"');
  console.log('3. Copy the key and add it to backend/.env file:');
  console.log('   GEMINI_API_KEY=your-key-here\n');
  process.exit(1);
}

console.log('🔑 API Key found, testing Gemini API...\n');

const testPrompt = 'I am feeling a bit anxious today.';

async function testGemini() {
  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    console.log('📡 Calling Gemini API...');
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ 
            text: `You are a warm, empathetic companion. Generate a brief affirmation (2-3 sentences) for someone feeling: ${testPrompt}` 
          }]
        }],
        generationConfig: {
          maxOutputTokens: 150,
          temperature: 0.7,
        }
      }),
    });

    console.log('📊 Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      return;
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts) {
      const text = data.candidates[0].content.parts[0].text;
      console.log('\n✅ Success! Generated affirmation:\n');
      console.log(text);
      console.log('\n🎉 Gemini API is working correctly!');
    } else {
      console.log('⚠️ Unexpected response format:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testGemini();
