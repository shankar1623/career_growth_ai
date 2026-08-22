// Local Ollama AI Integration (Free, Private, Local)

export async function callOllamaAPI(prompt: string, model: string = "llama3.2", baseUrl: string = "http://localhost:11434"): Promise<string | null> {
  const endpoint = `${baseUrl.replace(/\/$/, "")}/api/generate`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model || process.env.OLLAMA_MODEL || "llama3.2",
        prompt: prompt,
        stream: false,
        format: "json",
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.warn("Ollama returned non-200 status:", response.status);
      return null;
    }

    const data = await response.json();
    return data?.response || null;
  } catch (error) {
    // Local Ollama instance might not be running; log and fall back gracefully
    console.warn("Ollama is not reachable at", endpoint);
    return null;
  }
}
