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

// Analyze meals endpoint
app.post("/analyze-meals", async (req, res) => {
  const { meals, lang } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
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
  "suggestionEn": "<short English tip for fitness based on meals and that user is doing workouts>",
  "suggestionHi": "<same tip in Hindi>"
}

Estimate calories based on typical Indian food. Include a practical suggestion about protein intake or meal timing for someone who exercises.`
          },
          {
            role: "user",
            content: "Return ONLY the JSON, no markdown, no explanation."
          }
        ],
        max_tokens: 300
      })
    });

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "{}";

    // Parse JSON from response
    let parsed = {};
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      // Try to extract JSON from response
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      }
    }

    res.json({
      calories: parsed.calories || 0,
      protein: parsed.protein || 0,
      carbs: parsed.carbs || 0,
      fat: parsed.fat || 0,
      suggestionEn: parsed.suggestionEn || "Eat balanced meals.",
      suggestionHi: parsed.suggestionHi || "संतुलित भोजन लें।"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to analyze meals" });
  }
});

app.post("/diet-plan", async (req, res) => {
  const { userDetails } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a nutritionist assistant. Create a personalized diet plan." },
          { role: "user", content: `Create a daily diet plan for this user: ${userDetails}` }
        ],
        max_tokens: 400
      })
    });

    const data = await response.json();

    // Simplified response for client
    const diet = data?.choices?.[0]?.message?.content || "No diet plan returned";
    res.json({ diet });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get diet plan" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});