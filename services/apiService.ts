
/**
 * NOTE TO USER:
 * This file is your bridge between this frontend dashboard and your backend bot logic.
 * Each function here represents an API call that this dashboard will make to the 'Backend API URL' you provide in the settings.
 *
 * Your backend server should be set up to receive these POST requests at the specified URL.
 * Each request will include a JSON body containing the `botToken` for authentication and a `payload` with the relevant data for the action.
 *
 * Your backend should handle the logic (e.g., using the `node-telegram-bot-api` or `python-telegram-bot` library)
 * and then return a success or error response.
 */

interface ApiResponse {
    success: boolean;
    message: string;
    data?: any;
}

/**
 * A generic function to make POST requests to your backend.
 * @param apiUrl The base URL for your backend API, provided in the settings.
 * @param botToken The bot token for authentication.
 * @param action The specific action endpoint (e.g., 'start', 'stop', 'kick').
 * @param payload The data required for the action.
 * @returns A promise that resolves to the JSON response from the server.
 */
const postToBackend = async (
    apiUrl: string,
    botToken: string,
    action: string,
    payload: object = {}
): Promise<ApiResponse> => {
    if (!apiUrl || !botToken) {
        return { success: false, message: "API URL or Bot Token is not configured." };
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                botToken, // Send the token for your backend to initialize the bot instance
                action,   // The command for your backend to execute
                payload   // The data associated with the command
            }),
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: "Unknown server error" }));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error(`[ApiService] Error during '${action}' action:`, error);
        const errorMessage = error instanceof Error ? error.message : "A network error occurred.";
        return { success: false, message: errorMessage };
    }
};


// --- Bot Control ---

/**
 * Sends a command to start or stop the bot.
 * Backend should expect: { botToken: "...", action: "control", payload: { command: "start" | "stop" } }
 */
export const controlBot = (apiUrl: string, botToken: string, command: 'start' | 'stop') => {
    return postToBackend(apiUrl, botToken, 'control', { command });
};


// --- Admin Actions ---

/**
 * Sends a moderation command (kick, ban, promote, demote).
 * Backend should expect: { botToken: "...", action: "moderate", payload: { action: "kick" | "ban" | ..., userId: "..." } }
 */
export const moderateUser = (apiUrl: string, botToken: string, action: 'kick' | 'ban' | 'promote' | 'demote', userId: string) => {
    return postToBackend(apiUrl, botToken, 'moderate', { action, userId });
};

/**
 * Sends a message to be broadcast to all users.
 * Backend should expect: { botToken: "...", action: "broadcast", payload: { message: "..." } }
 */
export const broadcastMessage = (apiUrl: string, botToken: string, message: string) => {
    return postToBackend(apiUrl, botToken, 'broadcast', { message });
};
