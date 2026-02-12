// Test script to verify OpenRouter connection
import dotenv from 'dotenv';
dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

console.log('🧪 Testing OpenRouter Connection...\n');
console.log('API Key configured:', OPENROUTER_API_KEY ? `Yes (${OPENROUTER_API_KEY.substring(0, 10)}...)` : 'NO - Missing!');

if (!OPENROUTER_API_KEY) {
  console.error('❌ OPENROUTER_API_KEY not found in environment variables');
  console.log('\nPlease set your API key:');
  console.log('  1. Edit backend/.env');
  console.log('  2. Add: OPENROUTER_API_KEY=your-key-here');
  process.exit(1);
}

async function testConnection() {
  try {
    console.log('\n📡 Calling OpenRouter API...');
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://kind-affirmations.app',
        'X-Title': 'Kind Affirmations Test',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          { role: 'user', content: 'Say "Connection successful!" in 3 words' },
        ],
        stream: false,
      }),
    });

    console.log('Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('\n❌ API Error:', errorText);
      process.exit(1);
    }

    const data = await response.json();
    console.log('\n✅ Connection successful!');
    console.log('Response:', data.choices[0].message.content);
    console.log('\n✨ OpenRouter is working correctly!');
  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
