// Groq Cloud Ultra-Fast AI Integration (Free API)
// Supported models: qwen/qwen3.6-27b, openai/gpt-oss-120b, openai/gpt-oss-20b

export function extractJSONFromText(text: string): string | null {
  if (!text) return null;
  const clean = text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

  // 1. Check for markdown code blocks (e.g. ```json ... ```)
  const codeBlocks = [...clean.matchAll(/```(?:json)?\s*([\s\S]*?)\s*```/gi)];
  for (let i = codeBlocks.length - 1; i >= 0; i--) {
    const candidate = codeBlocks[i][1].trim();
    try {
      JSON.parse(candidate);
      return candidate;
    } catch {
      // Continue
    }
  }

  // 2. Search backwards for valid JSON objects
  for (let i = clean.length - 1; i >= 0; i--) {
    if (clean[i] === "}") {
      for (let j = 0; j < i; j++) {
        if (clean[j] === "{") {
          const candidate = clean.substring(j, i + 1).trim();
          try {
            JSON.parse(candidate);
            return candidate;
          } catch {
            // Continue
          }
        }
      }
    } else if (clean[i] === "]") {
      for (let j = 0; j < i; j++) {
        if (clean[j] === "[") {
          const candidate = clean.substring(j, i + 1).trim();
          try {
            JSON.parse(candidate);
            return candidate;
          } catch {
            // Continue
          }
        }
      }
    }
  }

  return clean;
}

export async function callGroqAPI(prompt: string, apiKey?: string): Promise<string | null> {
  const key = apiKey || process.env.GROQ_API_KEY;
  if (!key) return null;

  const model = process.env.GROQ_MODEL || "qwen/qwen3.6-27b";

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "You are an expert career and technical interview AI. Return strictly valid, parseable JSON only. Do not output conversational text, thinking steps, markdown descriptions, or backticks.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.1,
      }),
      signal: AbortSignal.timeout(35000),
    });

    if (!response.ok) {
      console.warn("Groq API error:", response.status, await response.text());
      return null;
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || null;

    if (!content) return null;

    return extractJSONFromText(content);
  } catch (error) {
    console.warn("Groq fetch error:", error);
    return null;
  }
}
