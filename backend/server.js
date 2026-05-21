import express from 'express';
import cors from 'cors';

import { parseNutritionLocally } from './parser.js';
import { callAI } from './openrouter.js';

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// ─────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────

app.get('/', (req, res) => {

  res.json({
    status: 'FitCoach backend running',
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

    // ─────────────────────────
    // TRY AI FIRST
    // ─────────────────────────

    try {

      const prompt = `
Analyze these meals:

${meals}

Return ONLY valid JSON.

Format:
{
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "suggestionEn": "short english suggestion",
  "suggestionHi": "short hindi suggestion",
  "goalProtein": 120,
  "goalCalories": 2200
}
`;

      const result = await callAI(prompt);

      const cleaned = result
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      const parsed = JSON.parse(cleaned);

      return res.json(parsed);

    } catch (aiError) {

      console.log(
        'AI failed. Using local parser.'
      );

      // ─────────────────────────
      // LOCAL FALLBACK
      // ─────────────────────────

      const localResult =
        parseNutritionLocally(meals);

      return res.json(localResult);
    }

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

// ─────────────────────────────────────────────
// DIET PLAN
// ─────────────────────────────────────────────

app.post('/api/diet-plan', async (req, res) => {

  try {

    const {
      exerciseName,
      difficulty,
      repCount,
      caloriesBurned,
      goal,
    } = req.body;

    try {

      const prompt = `
Create a practical Indian fitness diet plan.

User Goal:
${goal || 'general fitness'}

Workout:
- Exercise: ${exerciseName}
- Difficulty: ${difficulty}
- Reps: ${repCount}
- Calories burned: ${caloriesBurned}

Include:
- pre workout
- post workout
- lunch
- dinner
- hydration
- protein target

Keep it concise and practical.
`;

      const result =
        await callAI(prompt);

      return res.json({
        result,
      });

    } catch {

      // ─────────────────────────
      // FALLBACK MANUAL PLAN
      // ─────────────────────────

      return res.json({

        result: `
POST WORKOUT:
- 3 eggs + banana
- whey protein or milk

LUNCH:
- 2 roti
- dal
- paneer/chicken
- curd

EVENING:
- fruits
- nuts

DINNER:
- rice or roti
- vegetables
- protein source

HYDRATION:
- drink 2-3 litres water
`,
      });
    }

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });
  }
});

// ─────────────────────────────────────────────
// TEST AI
// ─────────────────────────────────────────────

app.get('/test-ai', async (req, res) => {

  try {

    const result = await callAI(
      'Give a short fitness tip'
    );

    res.json({
      success: true,
      result,
    });

  } catch (err) {

    res.json({
      success: false,
      error: err.message,
    });
  }
});

// ─────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );
});