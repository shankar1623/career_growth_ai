import { extractText } from "unpdf";

// Validates whether extracted text is real human-readable content and not un-decoded binary/PDF bytecode
export function isHumanReadableText(text: string): boolean {
  if (!text || typeof text !== "string") return false;
  const trimmed = text.trim();
  if (trimmed.length < 15) return false;

  // Reject PDF structural markers or bytecode
  if (
    trimmed.startsWith("%PDF") ||
    trimmed.startsWith("PDF-") ||
    trimmed.includes("FlateDecode") ||
    trimmed.includes("endobj") ||
    trimmed.includes("/Font") ||
    trimmed.includes("/MediaBox")
  ) {
    return false;
  }

  // Strip whitespace to calculate letter density accurately
  const cleanChars = trimmed.replace(/\s+/g, "");
  if (cleanChars.length < 10) return false;

  const letterMatches = cleanChars.match(/[a-zA-Z0-9]/g) || [];
  const letterRatio = letterMatches.length / cleanChars.length;
  if (letterRatio < 0.4) {
    return false; // Binary junk with mostly symbols
  }

  // Check for common English / Resume words
  const commonWords = [
    "the", "and", "in", "to", "of", "for", "with", "experience", "skills", "developer",
    "engineer", "education", "project", "projects", "university", "college", "school",
    "work", "react", "javascript", "typescript", "python", "software", "management",
    "data", "team", "built", "managed", "created", "bachelor", "master", "btech",
    "degree", "technologies", "email", "phone", "summary", "profile", "contact"
  ];
  const textLower = trimmed.toLowerCase();
  const matchedCount = commonWords.filter((w) => textLower.includes(w)).length;

  return matchedCount >= 1;
}

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // Strategy 1: Mozilla PDF.js engine via unpdf
  try {
    const uint8 = new Uint8Array(buffer);
    const result = await extractText(uint8, { mergePages: true });
    const text = typeof result === "string" ? result : (result as { text?: string | string[] })?.text;

    if (Array.isArray(text)) {
      const joined = text.join("\n").trim();
      if (isHumanReadableText(joined)) return joined;
    } else if (typeof text === "string" && isHumanReadableText(text)) {
      return text.trim();
    }
  } catch (err) {
    console.warn("unpdf extraction notice:", err);
  }

  // Strategy 2: pdf-parse lib
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdf = require("pdf-parse/lib/pdf-parse.js");
    const data = await pdf(buffer);
    if (data?.text && isHumanReadableText(data.text)) {
      return data.text.trim();
    }
  } catch (err2) {
    console.warn("pdf-parse fallback notice:", err2);
  }

  return "";
}
