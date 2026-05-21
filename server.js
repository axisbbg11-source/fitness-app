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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});