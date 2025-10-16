import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

/**
 * Initializes the GoogleGenAI client.
 * This function should be called once when the application starts.
 * It checks for an API key in the environment variables.
 * In a Vercel/Netlify deployment, you should set the API_KEY in the project's environment variable settings.
 */
export const initializeAiClient = () => {
  // This will be undefined in a simple static setup, but can be populated by
  // build tools or hosting platforms like Vercel.
  const apiKey = process.env.API_KEY;

  if (apiKey) {
    try {
      ai = new GoogleGenAI({ apiKey });
      console.log("Gemini AI Client Initialized.");
    } catch (error) {
      console.error("Failed to initialize GoogleGenAI:", error);
      ai = null;
    }
  } else {
    console.warn("API_KEY environment variable not found. AI features will be disabled.");
    ai = null;
  }
};


export const isAiAvailable = (): boolean => !!ai;

export const generateCommandResponse = async (prompt: string): Promise<string> => {
  if (!ai) return "AI features are disabled. API key not configured.";
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