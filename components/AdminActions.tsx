
import React, { useState } from 'react';
import { ICONS } from '../constants';
import { enhanceBroadcastMessage } from '../services/geminiService';

const ActionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-surface p-6 rounded-xl border border-border">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
    </div>
);

const AdminActions: React.FC = () => {
    const [userId, setUserId] = useState('');
    const [broadcastMessage, setBroadcastMessage] = useState('');
    const [isEnhancing, setIsEnhancing] = useState(false);

    const handleAction = (action: string) => {
        if (!userId) {
            alert(`Please enter a User ID to ${action}.`);
            return;
        }
        // In a real app, this would trigger a backend call
        alert(`Simulating ${action} for user ID: ${userId}`);
        setUserId('');
    };

    const handleBroadcast = () => {
        if (!broadcastMessage) {
            alert('Please enter a message to broadcast.');
            return;
        }
        alert(`Simulating broadcast with message:\n${broadcastMessage}`);
        setBroadcastMessage('');
    };
    
    const handleEnhanceMessage = async () => {
        if (!broadcastMessage) return;
        setIsEnhancing(true);
        const enhanced = await enhanceBroadcastMessage(broadcastMessage);
        setBroadcastMessage(enhanced);
        setIsEnhancing(false);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Admin Actions</h1>
            <p className="text-text-secondary mb-8">Perform moderation and administrative tasks.</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActionCard title="User Moderation">
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="Enter User ID"
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => handleAction('kick')} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Kick User</button>
                            <button onClick={() => handleAction('ban')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Ban User</button>
                            <button onClick={() => handleAction('promote')} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Promote to Admin</button>
                            <button onClick={() => handleAction('demote')} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Demote Admin</button>
                        </div>
                    </div>
                </ActionCard>

                <ActionCard title="Broadcast Message">
                    <div className="space-y-4">
                        <textarea
                            value={broadcastMessage}
                            onChange={(e) => setBroadcastMessage(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none h-32"
                            placeholder="Type your message to all users..."
                        />
                        <div className="flex space-x-2">
                             <button 
                                onClick={handleEnhanceMessage}
                                disabled={isEnhancing || !process.env.API_KEY}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-colors disabled:bg-gray-500"
                            >
                                <span className="mr-2">{ICONS.wand}</span>
                                {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
                            </button>
                            <button 
                                onClick={handleBroadcast}
                                className="flex-1 bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                            >
                                <span className="mr-2">{ICONS.send}</span>
                                Send Broadcast
                            </button>
                        </div>
                        {!process.env.API_KEY && <p className="text-xs text-yellow-400 mt-1">API_KEY environment variable not set. AI features are disabled.</p>}
                    </div>
                </ActionCard>
            </div>
        </div>
    );
};

export default AdminActions;
