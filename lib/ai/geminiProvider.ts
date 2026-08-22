// Gemini Free Tier API Integration

export async function callGeminiAPI(prompt: string, apiKey?: string): Promise<string | null> {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key) return null;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
        },
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.warn("Gemini API returned error:", response.status, await response.text());
      return null;
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (error) {
    console.warn("Gemini fetch failed:", error);
    return null;
  }
}
