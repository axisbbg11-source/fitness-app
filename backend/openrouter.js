const OPENROUTER_API_KEY =
  process.env.OPENROUTER_API_KEY;

export async function callAI(prompt) {

  if (!OPENROUTER_API_KEY) {
    throw new Error(
      'Missing OPENROUTER_API_KEY'
    );
  }

  const response = await fetch(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      method: 'POST',

      headers: {

        'Authorization':
          `Bearer ${OPENROUTER_API_KEY}`,

        'Content-Type': 'application/json',
      },

      body: JSON.stringify({

        model: 'openai/gpt-4o-mini',

        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],

        temperature: 0.3,
        max_tokens: 1024,
      }),
    }
  );

  const data = await response.json();

  if (process.env.NODE_ENV !== 'production') {
    console.log('OPENROUTER RESPONSE:', JSON.stringify(data));
  }

  if (!response.ok) {

    throw new Error(
      data?.error?.message ||
      'OpenRouter request failed'
    );
  }

  if (data.error) {
    throw new Error(data.error.message);
  }

  const text =
    data?.choices?.[0]?.message?.content || '';

  if (!text) {
    throw new Error('Empty AI response');
  }

  return text;
}