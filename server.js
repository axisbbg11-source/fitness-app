import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const OPENROUTER_KEY = process.env.OPENROUTER_KEY;

// ── In-memory premium store (replace with DB later) ──────────
const premiumUsers = new Set();

// ==================== VERIFY PREMIUM ====================
app.post("/api/verify-premium", (req, res) => {
  const { uid } = req.body;
  if (!uid) return res.json({ isPremium: false });
  res.json({ isPremium: premiumUsers.has(uid) });
});

// ==================== SET PREMIUM ====================
app.post("/api/set-premium", (req, res) => {
  const { uid } = req.body;
  if (!uid) return res.status(400).json({ error: "UID required" });
  premiumUsers.add(uid);
  res.json({ success: true });
});

// ==================== DIET PLAN ====================
app.post("/api/diet-plan", async (req, res) => {
  const { exerciseName, difficulty, repCount, caloriesBurned } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemma-3-27b-it:free",
        messages: [
          {
            role: "system",
            content: "You are a sports nutritionist. Give practical, specific diet advice with real Indian food names."
          },
          {
            role: "user",
            content: `Create a practical 1-day diet plan for someone who did ${Math.max(1, Math.floor(repCount / 10))} sets of ${exerciseName} (${difficulty}). Total reps: ${repCount}. Burned: ~${caloriesBurned} kcal.\nFormat:\nBreakfast: ...\nPre-workout: ...\nLunch: ...\nPost-workout: ...\nDinner: ...\nUnder 100 words. Specific Indian foods. End with one Hindi tip sentence.`
          }
        ],
        max_tokens: 400
      })
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    const result = data?.choices?.[0]?.message?.content || "Could not generate diet plan.";
    res.json({ result });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate diet plan" });
  }
});

// ==================== ANALYZE MEALS ====================
app.post("/api/analyze-meals", async (req, res) => {
  const { meals } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemma-3-27b-it:free",
        messages: [
          {
            role: "system",
            content: "You are a sports nutritionist. Analyze meals and provide nutrition info."
          },
          {
            role: "user",
            content: `Analyze this day's meals: ${meals}

Respond ONLY with valid JSON in this exact format (no other text):
{
  "calories": <number>,
  "protein": <number>,
  "carbs": <number>,
  "fat": <number>,
  "suggestionEn": "<short English tip>",
  "suggestionHi": "<same tip in Hindi>"
}

Estimate calories based on typical Indian food.`
          }
        ],
        max_tokens: 300
      })
    });

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "{}";

    let parsed = {};
    try {
      parsed = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
    }

    res.json({
      calories: parsed.calories || 0,
      protein: parsed.protein || 0,
      carbs: parsed.carbs || 0,
      fat: parsed.fat || 0,
      goalProtein: 120,
      goalCalories: 2200,
      suggestionEn: parsed.suggestionEn || "Eat balanced meals.",
      suggestionHi: parsed.suggestionHi || "संतुलित भोजन लें।"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to analyze meals" });
  }
});

// ==================== OLD ROUTES (kept for compatibility) ====================
app.post("/analyze-meals", async (req, res) => {
  req.url = "/api/analyze-meals";
  res.redirect(307, "/api/analyze-meals");
});

app.post("/diet-plan", async (req, res) => {
  res.redirect(307, "/api/diet-plan");
});

// ==================== HEALTH CHECK ====================
app.get("/", (req, res) => {
  res.json({ status: "FitCoach API running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});