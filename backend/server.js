import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

import { parseNutritionLocally } from './parser.js';
import { callAI } from './openrouter.js';

const app = express();

const premiumUsers = new Set();

app.set('trust proxy', 1);

app.use(helmet());

// Restrict CORS to the configured origin in production. Allows no-origin requests (curl/local) too.
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://reelbosster.example';
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === allowedOrigin) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
}));

app.use(express.json());

// Redirect HTTP to HTTPS when running in production behind a proxy
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// ─────────────────────────────────────────────
// RATE LIMITERS
// ─────────────────────────────────────────────

const globalLimiter = rateLimit({

  windowMs: 15 * 60 * 1000,

  max: 200,

  message: {
    error:
      'Too many requests. Please try again later.',
  },
});

app.use(globalLimiter);

const aiLimiter = rateLimit({

  windowMs: 60 * 1000,

  max: 10,

  message: {
    error:
      'Too many AI requests. Please wait 1 minute.',
  },
});

app.use('/api/diet-plan', aiLimiter);

app.use('/api/analyze-meals', aiLimiter);

// ─────────────────────────────────────────────

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
// HEALTH CHECK
// ─────────────────────────────────────────────

app.get('/health', (req, res) => {

  res.status(200).json({
    ok: true,
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

      if (process.env.NODE_ENV !== 'production') {
        console.log('AI failed. Using local parser.');
      }

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
      uid,
    } = req.body;

    const isPremium =
      premiumUsers.has(uid);

    if (!isPremium) {

      return res.json({

        result: `
PREMIUM FEATURE 🔒

Upgrade to premium
to unlock personalized
AI diet plans.
`,
      });
    }

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

    console.error(err);

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
// SET PREMIUM
// ─────────────────────────────────────────────

app.post('/api/set-premium', (req, res) => {

  const { uid } = req.body;

  if (!uid) {

    return res.status(400).json({
      error: 'uid missing',
    });
  }

  premiumUsers.add(uid);

  res.json({
    success: true,
  });
});

// ─────────────────────────────────────────────
// CHECK PREMIUM
// ─────────────────────────────────────────────

app.post('/api/check-premium', (req, res) => {

  const { uid } = req.body;

  res.json({
    isPremium:
      premiumUsers.has(uid),
  });
});

// ─────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Server running on port ${PORT}`);
  }
});