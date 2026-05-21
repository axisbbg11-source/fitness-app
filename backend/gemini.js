const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function callGemini(prompt, jsonMode = false) {

  if (!GEMINI_API_KEY) {
    throw new Error('Missing GEMINI_API_KEY');
  }

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],

      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1024,
      },
    }),
  });

  const data = await response.json();

  console.log('GEMINI RESPONSE:', JSON.stringify(data));

  if (!response.ok) {
    throw new Error(
      data?.error?.message || 'Gemini request failed'
    );
  }

  if (data.error) {
    throw new Error(data.error.message);
  }

  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  if (!text) {
    throw new Error('Empty Gemini response');
  }

  // JSON MODE
  if (jsonMode) {

    try {

      const cleaned = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      return JSON.parse(cleaned);

    } catch (err) {

      console.error('JSON PARSE FAILED:', text);

      throw new Error('Gemini returned invalid JSON');
    }
  }

  return text;
}