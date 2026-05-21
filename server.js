import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// In-memory premium store (resets on server restart)
// For persistence, replace with a database
const premiumUsers = new Set();

// ─────────────────────────────────────────────
// GEMINI JSON CALL
// ─────────────────────────────────────────────
async function callGeminiJSON(prompt) {
  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  const data = await response.json();
  console.log('RAW GEMINI:', JSON.stringify(data));

  if (data.error) throw new Error(data.error.message);

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
}

async function callGeminiText(prompt) {
  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  const data = await response.json();
  console.log('RAW GEMINI:', JSON.stringify(data));

  if (data.error) throw new Error(data.error.message);

  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// ─────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'Backend running', gemini: !!GEMINI_API_KEY });
});

// ─────────────────────────────────────────────
// ANALYZE MEALS
// ─────────────────────────────────────────────
app.post('/api/analyze-meals', async (req, res) => {
  try {
    const { meals } = req.body;
    if (!meals) return res.status(400).json({ error: 'Meals missing' });

    const prompt = `
Analyze these meals: ${meals}

Return ONLY valid JSON with no extra text:
{
  "calories": 500,
  "protein": 20,
  "carbs": 50,
  "fat": 10,
  "suggestionEn": "Eat more protein",
  "suggestionHi": "अधिक प्रोटीन खाएं",
  "goalProtein": 120,
  "goalCalories": 2200
}`;

    const result = await callGeminiJSON(prompt);
    res.json(result);
  } catch (err) {
    console.error('analyze-meals ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// DIET PLAN
// ─────────────────────────────────────────────
app.post('/api/diet-plan', async (req, res) => {
  try {
    const { exerciseName, difficulty, repCount, caloriesBurned } = req.body;

    const prompt = `
Create a concise personalized diet plan for someone who just did:
- Exercise: ${exerciseName || 'general workout'}
- Difficulty: ${difficulty || 'medium'}
- Reps completed: ${repCount || 10}
- Calories burned: ${caloriesBurned || 100} kcal

Give practical meal suggestions for the rest of the day including pre/post workout nutrition.
Keep it under 200 words. Use simple language suitable for Indian users.`;

    const result = await callGeminiText(prompt);
    res.json({ result });
  } catch (err) {
    console.error('diet-plan ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// CHECK PREMIUM  (dashboard calls this on load)
// ─────────────────────────────────────────────
app.post('/api/check-premium', (req, res) => {
  const { uid } = req.body;
  if (!uid) return res.status(400).json({ error: 'uid missing' });
  res.json({ isPremium: premiumUsers.has(uid) });
});

// ─────────────────────────────────────────────
// SET PREMIUM  (called after successful payment)
// ─────────────────────────────────────────────
app.post('/api/set-premium', (req, res) => {
  const { uid } = req.body;
  if (!uid) return res.status(400).json({ error: 'uid missing' });
  premiumUsers.add(uid);
  console.log(`Premium granted to: ${uid}`);
  res.json({ success: true });
});

// ─────────────────────────────────────────────
// VERIFY PREMIUM  (legacy route — kept for safety)
// ─────────────────────────────────────────────
app.post('/api/verify-premium', (req, res) => {
  const { uid } = req.body;
  res.json({ isPremium: uid ? premiumUsers.has(uid) : false });
});

// ─────────────────────────────────────────────
// TEST GEMINI
// ─────────────────────────────────────────────
app.get('/test-gemini', async (req, res) => {
  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: 'hello' }] }] }),
    });
    const data = await response.json();
    console.log('TEST GEMINI:', data);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// SERVER
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});