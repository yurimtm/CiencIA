
import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import { GEMINI_TEXT_MODEL } from '../constants.tsx'; // Adjusted import path

const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable not set for GeminiService.");
}

const ai = new GoogleGenAI({ apiKey: "AIzaSyBoXD1If9qEEWg2GtqVica2uLzsXO0bqag" });

export const generateText = async (prompt: string, systemInstruction?: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        ...(systemInstruction && { systemInstruction }),
        // Omit thinkingConfig for higher quality by default
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API error (generateText):", error);
    throw error;
  }
};

export const generateTextWithJsonOutput = async <T,>(prompt: string, systemInstruction?: string): Promise<T> => {
  let response: GenerateContentResponse | undefined;
  try {
    response = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        ...(systemInstruction && { systemInstruction }),
        responseMimeType: "application/json",
      },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    return JSON.parse(jsonStr) as T;
  } catch (error) {
    console.error("Gemini API error (generateTextWithJsonOutput):", error);
    if (error instanceof SyntaxError) {
        console.error("Failed to parse JSON response. Raw text:", (error as any)?.responseText || response?.text);
    }
    throw error;
  }
};


export const generateTextWithImage = async (prompt: string, base64ImageData: string, mimeType: string): Promise<string> => {
  try {
    const imagePart: Part = {
      inlineData: {
        mimeType: mimeType,
        data: base64ImageData,
      },
    };
    const textPart: Part = { text: prompt };

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL, // Ensure this model supports multimodal input
      contents: { parts: [textPart, imagePart] },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API error (generateTextWithImage):", error);
    throw error;
  }
};

export const streamText = async (
  prompt: string,
  onChunk: (chunk: string) => void,
  systemInstruction?: string
): Promise<void> => {
  try {
    const responseStream = await ai.models.generateContentStream({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        ...(systemInstruction && { systemInstruction }),
      },
    });

    for await (const chunk of responseStream) {
      onChunk(chunk.text);
    }
  } catch (error) {
    console.error("Gemini API error (streamText):", error);
    throw error;
  }
};
