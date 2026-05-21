const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;

// ── Helper: call Gemini ──────────────────────────────────────
async function callGemini(prompt) {
  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// ── Helper: call Gemini for JSON only ───────────────────────
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
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  return JSON.parse(raw.replace(/```json|```/g, '').trim());
}

// ── POST /api/diet-plan ──────────────────────────────────────
app.post('/api/diet-plan', async (req, res) => {
  try {
    const { exerciseName, difficulty, repCount, caloriesBurned } = req.body;

    const prompt = `You are a certified sports nutritionist specializing in Indian diet and fitness.
A user just completed the following workout:
- Exercise: ${exerciseName}
- Difficulty: ${difficulty}
- Reps completed: ${repCount}
- Calories burned: ${caloriesBurned} kcal

Generate a short, practical, personalized diet plan for them. Include:
1. Pre-workout snack (if relevant)
2. Post-workout meal (most important)
3. Next main meal suggestion
4. Hydration tip
5. One supplement suggestion if needed

Rules:
- Prefer Indian foods (roti, dal, paneer, rice, curd, fruits, etc.)
- Also include common foods like eggs, oats, banana where appropriate
- Keep it concise and actionable
- Use bullet points
- No long paragraphs`;

    const result = await callGemini(prompt);
    res.json({ result });
  } catch (err) {
    console.error('Diet plan error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/analyze-meals ──────────────────────────────────
app.post('/api/analyze-meals', async (req, res) => {
  try {
    const { meals } = req.body;

    const prompt = `You are a nutrition expert. Analyze the following meals and return accurate nutritional data.
Meals: "${meals}"

You must return ONLY a valid JSON object with these exact fields:
{
  "calories": <total kcal as number>,
  "protein": <grams as number>,
  "carbs": <grams as number>,
  "fat": <grams as number>,
  "suggestionEn": "<one practical improvement tip in English>",
  "suggestionHi": "<same tip in simple Hindi>",
  "goalProtein": 120,
  "goalCalories": 2200
}

Rules:
- Accurately estimate values for Indian foods (roti ~80kcal, dal ~150kcal per bowl, etc.)
- Accurately estimate values for common foods (egg ~70kcal, banana ~90kcal, etc.)
- All values must be numbers, no strings
- suggestionEn and suggestionHi must be helpful, specific, and short (1 sentence each)
- Return only the JSON, no extra text`;

    const result = await callGeminiJSON(prompt);
    res.json(result);
  } catch (err) {
    console.error('Analyze meals error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/verify-premium ─────────────────────────────────
app.post('/api/verify-premium', async (req, res) => {
  try {
    const { uid } = req.body;
    // TODO: connect your real DB here
    // For now returns false so localStorage fallback works
    res.json({ isPremium: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/set-premium ────────────────────────────────────
app.post('/api/set-premium', async (req, res) => {
  try {
    const { uid } = req.body;
    // TODO: save to your real DB here
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Health check ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'FitCoach API running', gemini: !!GEMINI_API_KEY });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));