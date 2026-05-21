import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Try models in order until one works
const GEMINI_MODELS = [
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.0-pro',
  'gemini-pro',
];

// In-memory premium store
const premiumUsers = new Set();

// ─────────────────────────────────────────────
// GEMINI CALL — tries each model until one works
// ─────────────────────────────────────────────
async function callGemini(prompt, jsonMode = false) {
  let lastError = null;

  for (const model of GEMINI_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3 },
        }),
      });

      const data = await response.json();
      console.log(`Model ${model} response status:`, response.status);

      if (data.error) {
        console.warn(`Model ${model} error:`, data.error.message);
        lastError = new Error(data.error.message);
        continue; // try next model
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (!text) { lastError = new Error('Empty response'); continue; }

      if (jsonMode) {
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
      }
      return text;

    } catch (err) {
      console.warn(`Model ${model} threw:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini models failed');
}

// ─────────────────────────────────────────────
// NUTRITION FALLBACK DATABASE (works offline)
// ─────────────────────────────────────────────
const nutritionDB = {
  egg:         { cal: 78,  pro: 6,   carb: 0.6, fat: 5   },
  roti:        { cal: 71,  pro: 2.7, carb: 15,  fat: 0.4 },
  rice:        { cal: 130, pro: 2.7, carb: 28,  fat: 0.3 },
  dal:         { cal: 116, pro: 8,   carb: 20,  fat: 0.4 },
  chicken:     { cal: 165, pro: 31,  carb: 0,   fat: 3.6 },
  paneer:      { cal: 265, pro: 18,  carb: 3.4, fat: 20  },
  banana:      { cal: 89,  pro: 1.1, carb: 23,  fat: 0.3 },
  milk:        { cal: 42,  pro: 3.4, carb: 5,   fat: 1   },
  curd:        { cal: 61,  pro: 3.5, carb: 4.7, fat: 3.3 },
  oats:        { cal: 68,  pro: 2.4, carb: 12,  fat: 1.4 },
  bread:       { cal: 79,  pro: 2.7, carb: 15,  fat: 1   },
  apple:       { cal: 52,  pro: 0.3, carb: 14,  fat: 0.2 },
  potato:      { cal: 77,  pro: 2,   carb: 17,  fat: 0.1 },
  sabzi:       { cal: 60,  pro: 2,   carb: 10,  fat: 1.5 },
  idli:        { cal: 39,  pro: 2,   carb: 8,   fat: 0.2 },
  dosa:        { cal: 133, pro: 3.5, carb: 23,  fat: 3   },
  sambar:      { cal: 57,  pro: 3,   carb: 9,   fat: 1   },
  chapati:     { cal: 71,  pro: 2.7, carb: 15,  fat: 0.4 },
  paratha:     { cal: 200, pro: 4,   carb: 30,  fat: 7   },
  moong:       { cal: 105, pro: 7,   carb: 19,  fat: 0.4 },
  rajma:       { cal: 127, pro: 8.7, carb: 23,  fat: 0.5 },
  fish:        { cal: 136, pro: 20,  carb: 0,   fat: 6   },
  nuts:        { cal: 170, pro: 5,   carb: 6,   fat: 15  },
  peanuts:     { cal: 160, pro: 7,   carb: 6,   fat: 14  },
  whey:        { cal: 120, pro: 25,  carb: 3,   fat: 1.5 },
  sandwich:    { cal: 250, pro: 10,  carb: 35,  fat: 8   },
  coffee:      { cal: 5,   pro: 0.3, carb: 0,   fat: 0   },
  tea:         { cal: 10,  pro: 0.3, carb: 1.5, fat: 0.1 },
};

function parseNutritionLocally(mealsText) {
  const text = mealsText.toLowerCase();
  let cal = 0, pro = 0, carb = 0, fat = 0;
  let matched = false;

  for (const [food, vals] of Object.entries(nutritionDB)) {
    if (text.includes(food)) {
      // Try to detect quantity (e.g. "2 eggs", "3 roti")
      const qtyMatch = text.match(new RegExp(`(\\d+)\\s*${food}`));
      const qty = qtyMatch ? parseInt(qtyMatch[1]) : 1;
      cal  += vals.cal  * qty;
      pro  += vals.pro  * qty;
      carb += vals.carb * qty;
      fat  += vals.fat  * qty;
      matched = true;
    }
  }

  if (!matched) {
    // Generic fallback estimate for unrecognized meals
    cal = 400; pro = 15; carb = 50; fat = 12;
  }

  cal  = Math.round(cal);
  pro  = Math.round(pro);
  carb = Math.round(carb);
  fat  = Math.round(fat);

  const suggestions = pro < 30
    ? { en: 'Add more protein sources like eggs, dal, or paneer to meet your daily goal.', hi: 'अपने लक्ष्य को पूरा करने के लिए अंडे, दाल या पनीर जैसे प्रोटीन स्रोत जोड़ें।' }
    : { en: 'Good protein intake! Make sure to stay hydrated and include vegetables.', hi: 'अच्छा प्रोटीन सेवन! हाइड्रेटेड रहें और सब्जियां शामिल करें।' };

  return {
    calories: cal,
    protein: pro,
    carbs: carb,
    fat: fat,
    suggestionEn: suggestions.en,
    suggestionHi: suggestions.hi,
    goalProtein: 120,
    goalCalories: 2200,
  };
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

    // Try Gemini first
    if (GEMINI_API_KEY) {
      try {
        const prompt = `Analyze these meals: ${meals}

Return ONLY valid JSON, no markdown, no extra text:
{"calories":500,"protein":20,"carbs":50,"fat":10,"suggestionEn":"Add more protein","suggestionHi":"अधिक प्रोटीन खाएं","goalProtein":120,"goalCalories":2200}`;

        const result = await callGemini(prompt, true);
        return res.json(result);
      } catch (geminiErr) {
        console.warn('Gemini failed, using local fallback:', geminiErr.message);
      }
    }

    // Fallback: local nutrition database
    const result = parseNutritionLocally(meals);
    res.json(result);

  } catch (err) {
    console.error('analyze-meals ERROR:', err);
    // Last resort fallback
    res.json(parseNutritionLocally(req.body.meals || ''));
  }
});

// ─────────────────────────────────────────────
// DIET PLAN
// ─────────────────────────────────────────────
app.post('/api/diet-plan', async (req, res) => {
  try {
    const { exerciseName, difficulty, repCount, caloriesBurned } = req.body;

    if (GEMINI_API_KEY) {
      try {
        const prompt = `Create a concise personalized diet plan for someone who just did:
- Exercise: ${exerciseName || 'general workout'}
- Difficulty: ${difficulty || 'medium'}
- Reps: ${repCount || 10}
- Calories burned: ${caloriesBurned || 100} kcal

Give practical Indian meal suggestions for the rest of the day. Under 200 words.`;

        const result = await callGemini(prompt, false);
        return res.json({ result });
      } catch (geminiErr) {
        console.warn('Gemini failed for diet-plan:', geminiErr.message);
      }
    }

    // Fallback diet plan
    res.json({
      result: `Post-workout meal (within 30 min): 3 egg whites + 1 banana or 1 cup moong dal + rice.\n\nLunch: 2 roti + sabzi + 1 bowl dal + curd. Good protein and carb balance.\n\nEvening snack: Handful of peanuts or 1 glass milk with oats.\n\nDinner: Paneer/chicken + 1-2 roti + salad. Keep it light.\n\nDrink 2-3 litres of water today. You burned ${caloriesBurned || 100} kcal — replenish with a balanced meal within the hour.`,
    });

  } catch (err) {
    console.error('diet-plan ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// CHECK PREMIUM
// ─────────────────────────────────────────────
app.post('/api/check-premium', (req, res) => {
  const { uid } = req.body;
  if (!uid) return res.status(400).json({ error: 'uid missing' });
  res.json({ isPremium: premiumUsers.has(uid) });
});

// ─────────────────────────────────────────────
// SET PREMIUM
// ─────────────────────────────────────────────
app.post('/api/set-premium', (req, res) => {
  const { uid } = req.body;
  if (!uid) return res.status(400).json({ error: 'uid missing' });
  premiumUsers.add(uid);
  console.log(`Premium granted to: ${uid}`);
  res.json({ success: true });
});

// ─────────────────────────────────────────────
// VERIFY PREMIUM (legacy)
// ─────────────────────────────────────────────
app.post('/api/verify-premium', (req, res) => {
  const { uid } = req.body;
  res.json({ isPremium: uid ? premiumUsers.has(uid) : false });
});

// ─────────────────────────────────────────────
// TEST GEMINI — visit /test-gemini in browser
// ─────────────────────────────────────────────
app.get('/test-gemini', async (req, res) => {
  const results = {};
  for (const model of GEMINI_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'say hi' }] }] }),
      });
      const d = await r.json();
      results[model] = d.error ? `ERROR: ${d.error.message}` : 'OK';
    } catch (e) {
      results[model] = `THREW: ${e.message}`;
    }
  }
  res.json(results);
});

// ─────────────────────────────────────────────
// SERVER
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});