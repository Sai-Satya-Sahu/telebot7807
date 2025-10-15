import React, { useState } from 'react';
import { ICONS } from '../constants';

interface SettingsProps {
    token: string;
    setToken: (token: string) => void;
    seniorAdminId: string;
    setSeniorAdminId: (id: string) => void;
    isRunning: boolean;
    startBot: () => void;
    stopBot: () => void;
    apiKey: string;
    setApiKey: (key: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ token, setToken, seniorAdminId, setSeniorAdminId, isRunning, startBot, stopBot, apiKey, setApiKey }) => {
    const [localToken, setLocalToken] = useState(token);
    const [localAdminId, setLocalAdminId] = useState(seniorAdminId);
    const [localApiKey, setLocalApiKey] = useState(apiKey);

    const handleSave = () => {
        setToken(localToken);
        setSeniorAdminId(localAdminId);
        setApiKey(localApiKey);
        alert('Settings saved!');
    };
    
    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-text-secondary mb-8">Configure your bot's core parameters and control its status.</p>

            <div className="bg-surface p-8 rounded-xl border border-border max-w-2xl">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="token" className="block text-sm font-medium text-text-secondary mb-2">Bot Token</label>
                        <input
                            type="password"
                            id="token"
                            value={localToken}
                            onChange={(e) => setLocalToken(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="Enter your Telegram Bot Token"
                        />
                    </div>
                    <div>
                        <label htmlFor="adminId" className="block text-sm font-medium text-text-secondary mb-2">Senior Admin ID</label>
                        <input
                            type="text"
                            id="adminId"
                            value={localAdminId}
                            onChange={(e) => setLocalAdminId(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="Enter the main admin's Telegram User ID"
                        />
                    </div>
                     <div>
                        <label htmlFor="apiKey" className="block text-sm font-medium text-text-secondary mb-2">Gemini API Key</label>
                        <input
                            type="password"
                            id="apiKey"
                            value={localApiKey}
                            onChange={(e) => setLocalApiKey(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="Enter your Google Gemini API Key"
                        />
                         <p className="text-xs text-text-secondary mt-1">Your key is stored securely in your browser's local storage.</p>
                    </div>
                    <button 
                        onClick={handleSave}
                        className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        Save Settings
                    </button>
                </div>

                <div className="mt-8 pt-8 border-t border-border">
                    <h2 className="text-lg font-semibold text-text-primary mb-4">Bot Control</h2>
                    <div className="flex space-x-4">
                        <button
                            onClick={startBot}
                            disabled={isRunning || !token}
                            className="flex-1 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            <span className="mr-2">{ICONS.power}</span>
                            Start Bot
                        </button>
                        <button
                            onClick={stopBot}
                            disabled={!isRunning}
                            className="flex-1 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                             <span className="mr-2">{ICONS.power}</span>
                            Stop Bot
                        </button>
                    </div>
                    {!token && <p className="text-yellow-400 text-sm mt-4">A bot token is required to start the bot.</p>}
                </div>
            </div>
        </div>
    );
};

export default Settings;