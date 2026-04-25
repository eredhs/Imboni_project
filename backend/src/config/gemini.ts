import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;
let geminiFlash: any = null;

function initializeGemini() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment");
  }
  
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    geminiFlash = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
      },
    });
  }
  
  return geminiFlash;
}

export async function callGemini(prompt: string): Promise<string> {
  try {
    const model = initializeGemini();
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error("[GEMINI ERROR]", error?.message ?? error);
    throw new Error(`Gemini call failed: ${error?.message ?? "Unknown error"}`);
  }
}
