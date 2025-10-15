import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

// FIX: Conditionally initialize GoogleGenAI client only when API_KEY is present to avoid runtime errors.
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const generateCommandResponse = async (prompt: string): Promise<string> => {
  // FIX: Check for the initialized 'ai' client instead of the raw API_KEY.
  if (!ai) return "AI features disabled. Please set API_KEY.";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a fun and engaging response for a Telegram bot command. The user wants the command to do this: "${prompt}". Keep the response concise and suitable for a chat message.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating command response:", error);
    return "Error generating AI response.";
  }
};

export const enhanceBroadcastMessage = async (message: string): Promise<string> => {
  // FIX: Check for the initialized 'ai' client instead of the raw API_KEY.
  if (!ai) return message;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Enhance the following broadcast message for a Telegram group to make it more engaging, friendly, and clear. Add suitable emojis. Original message: "${message}"`,
    });
    return response.text;
  } catch (error) {
    console.error("Error enhancing broadcast message:", error);
    return message;
  }
};
