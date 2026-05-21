import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;

// ── Helper: call Gemini ──────────────────────────────────────
async function callGemini(prompt) {
  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    }),
  });

  const data = await res.json();

  if (data.error) throw new Error(data.error.message);

  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// ── Helper: call Gemini JSON ─────────────────────────────────
async function callGeminiJSON(prompt) {
  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 512,
        responseMimeType: 'application/json',
      },
    }),
  });

  const data = await res.json();

  if (data.error) throw new Error(data.error.message);

  const raw =
    data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

  return JSON.parse(
    raw.replace(/```json|```/g, '').trim()
  );
}

// ── Routes ───────────────────────────────────────────────────

app.get('/', (req, res) => {
  res.json({
    status: 'FitCoach API running',
    gemini: !!GEMINI_API_KEY,
  });
});

const PORT = process.env.PORT || 3001;

// ── POST /api/analyze-meals ─────────────────────────────
app.post('/api/analyze-meals', async (req, res) => {
  try {
    const { meals } = req.body;

    const prompt = `
Analyze these meals and return nutrition data.

Meals: ${meals}

Return ONLY valid JSON:
{
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "suggestionEn": "short suggestion",
  "suggestionHi": "short hindi suggestion",
  "goalProtein": 120,
  "goalCalories": 2200
}
`;

    const result = await callGeminiJSON(prompt);

    res.json(result);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});
app.post('/api/analyze-meals', async (req, res) => {
  try {
    console.log('BODY:', req.body);

    const { meals } = req.body;

    if (!meals) {
      return res.status(400).json({
        error: 'Meals missing',
      });
    }

    const prompt = `
Analyze these meals and return nutrition data.

Meals: ${meals}

Return ONLY valid JSON:
{
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "suggestionEn": "short suggestion",
  "suggestionHi": "short hindi suggestion",
  "goalProtein": 120,
  "goalCalories": 2200
}
`;

    const result = await callGeminiJSON(prompt);

    console.log('RESULT:', result);

    res.json(result);

  } catch (err) {
    console.error('ANALYZE ERROR:', err);

    res.status(500).json({
      error: err.message,
    });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});