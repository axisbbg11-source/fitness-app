import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_URL =
`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// ─────────────────────────────────────────────
// GEMINI JSON CALL
// ─────────────────────────────────────────────
async function callGeminiJSON(prompt) {

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
    }),
  });

  const data = await response.json();

  console.log('RAW GEMINI:', JSON.stringify(data));

  if (data.error) {
    throw new Error(data.error.message);
  }

  const text =
    data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

  const cleaned = text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

  return JSON.parse(cleaned);
}

// ─────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status: 'Backend running',
    gemini: !!GEMINI_API_KEY,
  });
});

// ─────────────────────────────────────────────
// ANALYZE MEALS
// ─────────────────────────────────────────────
app.post('/api/analyze-meals', async (req, res) => {

  try {

    const { meals } = req.body;

    if (!meals) {
      return res.status(400).json({
        error: 'Meals missing',
      });
    }

    const prompt = `
Analyze these meals:

${meals}

Return ONLY valid JSON:

{
  "calories": 500,
  "protein": 20,
  "carbs": 50,
  "fat": 10,
  "suggestionEn": "Eat more protein",
  "suggestionHi": "अधिक प्रोटीन खाएं",
  "goalProtein": 120,
  "goalCalories": 2200
}
`;

    const result = await callGeminiJSON(prompt);

    res.json(result);

  } catch (err) {

    console.error('ERROR:', err);

    res.status(500).json({
      error: err.message,
    });
  }
});

// ─────────────────────────────────────────────
// VERIFY PREMIUM
// ─────────────────────────────────────────────
app.post('/api/verify-premium', (req, res) => {

  res.json({
    isPremium: false,
  });

});

// ─────────────────────────────────────────────
// SERVER
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 3001;

app.get('/test-gemini', async (req, res) => {

  try {

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
                text: 'hello',
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    console.log('TEST GEMINI:', data);

    res.json(data);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message,
    });

  }

});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});