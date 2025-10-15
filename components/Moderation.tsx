
import React, { useState } from 'react';
import { BotState } from '../types';

interface ModerationProps {
    botState: BotState;
    addBannedWord: (word: string) => void;
    removeBannedWord: (word: string) => void;
    addWarning: (userId: string) => void;
    pardonUser: (userId: string) => void;
    toggleScammerStatus: (userId: string) => void;
    manualBan: (userId: string) => void;
}

const Moderation: React.FC<ModerationProps> = ({ botState, addBannedWord, removeBannedWord, addWarning, pardonUser, toggleScammerStatus, manualBan }) => {
    const [activeTab, setActiveTab] = useState('users');
    const [newBannedWord, setNewBannedWord] = useState('');

    const handleAddBannedWord = () => {
        if (newBannedWord.trim()) {
            addBannedWord(newBannedWord.trim());
            setNewBannedWord('');
        }
    };

    const activeUsers = botState.managedUsers.filter(u => !u.isBanned);
    const bannedUsers = botState.managedUsers.filter(u => u.isBanned);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Moderation</h1>
            <p className="text-text-secondary mb-8">Manage users, banned words, and automated moderation rules.</p>

            <div className="flex border-b border-border mb-6">
                <button onClick={() => setActiveTab('users')} className={`px-6 py-3 font-semibold ${activeTab === 'users' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`}>User Moderation</button>
                <button onClick={() => setActiveTab('banned_users')} className={`px-6 py-3 font-semibold ${activeTab === 'banned_users' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`}>Banned Users ({bannedUsers.length})</button>
                <button onClick={() => setActiveTab('words')} className={`px-6 py-3 font-semibold ${activeTab === 'words' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`}>Banned Words ({botState.bannedWords.length})</button>
            </div>

            {activeTab === 'users' && (
                <div className="bg-surface p-6 rounded-xl border border-border">
                    <h2 className="text-xl font-bold mb-4">Manage Active Users</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="p-3">Username</th>
                                    <th className="p-3">Unique ID</th>
                                    <th className="p-3">Warnings</th>
                                    <th className="p-3">Scammer</th>
                                    <th className="p-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeUsers.map(user => (
                                    <tr key={user.id} className="border-b border-border/50 hover:bg-background">
                                        <td className="p-3 font-semibold">{user.username}</td>
                                        <td className="p-3 font-mono text-text-secondary">{user.uniqueId}</td>
                                        <td className="p-3">{user.warnings} / 3</td>
                                        <td className="p-3">{user.isScammer ? 'Yes' : 'No'}</td>
                                        <td className="p-3">
                                            <div className="flex justify-end space-x-2">
                                                <button onClick={() => addWarning(user.id)} className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded hover:bg-yellow-500/40">Warn</button>
                                                <button onClick={() => toggleScammerStatus(user.id)} className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded hover:bg-purple-500/40">{user.isScammer ? 'Unmark' : 'Mark Scammer'}</button>
                                                <button onClick={() => manualBan(user.id)} className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded hover:bg-red-500/40">Ban</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {activeUsers.length === 0 && <p className="text-center py-8 text-text-secondary">No active users registered.</p>}
                    </div>
                </div>
            )}

            {activeTab === 'banned_users' && (
                 <div className="bg-surface p-6 rounded-xl border border-border">
                    <h2 className="text-xl font-bold mb-4">Banned Users</h2>
                    <div className="space-y-3">
                        {bannedUsers.map(user => (
                            <div key={user.id} className="bg-background p-3 rounded-lg flex justify-between items-center border border-border">
                                <div>
                                    <p>{user.username} <span className="text-sm font-mono text-text-secondary">({user.uniqueId})</span></p>
                                    <p className="text-xs text-red-400">Banned with {user.warnings} warnings. {user.isScammer && 'Marked as scammer.'}</p>
                                </div>
                                <button onClick={() => pardonUser(user.id)} className="bg-green-500/20 text-green-400 px-3 py-1 rounded-md text-sm font-semibold hover:bg-green-500/40">Pardon & Unban</button>
                            </div>
                        ))}
                         {bannedUsers.length === 0 && <p className="text-center py-8 text-text-secondary">No users are currently banned.</p>}
                    </div>
                </div>
            )}

            {activeTab === 'words' && (
                 <div className="bg-surface p-6 rounded-xl border border-border max-w-lg mx-auto">
                    <h2 className="text-xl font-bold mb-4">Manage Banned Words</h2>
                    <p className="text-text-secondary text-sm mb-4">Users who send messages containing these words will receive an automatic warning.</p>
                    <form onSubmit={e => {e.preventDefault(); handleAddBannedWord();}} className="flex space-x-2 mb-4">
                        <input
                            type="text"
                            value={newBannedWord}
                            onChange={(e) => setNewBannedWord(e.target.value)}
                            className="flex-grow bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="Add a new word or phrase"
                        />
                        <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg">Add</button>
                    </form>
                    <div className="space-y-2">
                        {botState.bannedWords.map(word => (
                            <div key={word} className="bg-background p-3 rounded-lg flex justify-between items-center border border-border">
                                <span className="font-mono">{word}</span>
                                <button onClick={() => removeBannedWord(word)} className="text-red-400 hover:text-red-300">&times;</button>
                            </div>
                        ))}
                        {botState.bannedWords.length === 0 && <p className="text-center py-8 text-text-secondary">No words have been banned yet.</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Moderation;
