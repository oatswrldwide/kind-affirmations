import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function testStream() {
  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: 'Generate a 2-3 sentence affirmation for someone feeling lonely' }]
        }],
        generationConfig: {
          maxOutputTokens: 150,
          temperature: 0.7,
        }
      }),
    });

    console.log('Status:', response.status);
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      console.log('RAW CHUNK:', JSON.stringify(buffer));
      console.log('---');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testStream();
