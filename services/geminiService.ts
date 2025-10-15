import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

export const initializeAiClient = (apiKey: string) => {
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  } else {
    ai = null;
  }
};

export const isAiAvailable = (): boolean => !!ai;

export const generateCommandResponse = async (prompt: string): Promise<string> => {
  if (!ai) return "AI features disabled. Please set your API Key in Settings.";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a fun and engaging response for a Telegram bot command. The user wants the command to do this: "${prompt}". Keep the response concise and suitable for a chat message.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating command response:", error);
    return "Error generating AI response. Check your API key and network connection.";
  }
};

export const enhanceBroadcastMessage = async (message: string): Promise<string> => {
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
