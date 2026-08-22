import mammoth from "mammoth";

export async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  } catch (error) {
    console.error("DOCX Parsing Error:", error);
    throw new Error("Failed to parse DOCX document. Please make sure it is a valid Word document.");
  }
}
