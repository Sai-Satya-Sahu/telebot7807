
import React, { useState } from 'react';
import { CustomCommand } from '../types';
import { ICONS } from '../constants';
import Modal from './common/Modal';
import { generateCommandResponse } from '../services/geminiService';

interface CommandsProps {
    commands: CustomCommand[];
    addCommand: (command: Omit<CustomCommand, 'id'>) => void;
    removeCommand: (commandId: string) => void;
}

const SystemCommand: React.FC<{ command: string; description: string }> = ({ command, description }) => (
    <div className="bg-background p-4 rounded-lg border border-border/50">
        <p className="font-semibold text-primary font-mono">{command}</p>
        <p className="text-text-secondary mt-1 text-sm">{description}</p>
    </div>
);

const Commands: React.FC<CommandsProps> = ({ commands, addCommand, removeCommand }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCommand, setNewCommand] = useState('');
    const [newResponse, setNewResponse] = useState('');
    const [isAdminOnly, setIsAdminOnly] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleAddCommand = () => {
        if (!newCommand || !newResponse) {
            alert('Please fill in both command and response.');
            return;
        }
        addCommand({ 
            command: newCommand.startsWith('/') ? newCommand : `/${newCommand}`, 
            response: newResponse,
            adminOnly: isAdminOnly 
        });
        setNewCommand('');
        setNewResponse('');
        setAiPrompt('');
        setIsAdminOnly(false);
        setIsModalOpen(false);
    };

    const handleGenerateResponse = async () => {
        if (!aiPrompt) {
            alert('Please enter a prompt for the AI.');
            return;
        }
        setIsGenerating(true);
        const generatedResponse = await generateCommandResponse(aiPrompt);
        setNewResponse(generatedResponse);
        setIsGenerating(false);
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Custom Commands</h1>
                    <p className="text-text-secondary">Create and manage your bot's custom text commands.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors">
                    <span className="mr-2">{ICONS.plus}</span>
                    New Command
                </button>
            </div>
            
            <div className="bg-surface p-6 rounded-xl border border-border mb-8">
                <h2 className="text-xl font-bold mb-4">Your Custom Commands</h2>
                <div className="space-y-4">
                    {commands.length > 0 ? commands.map(cmd => (
                        <div key={cmd.id} className="bg-background p-4 rounded-lg border border-border flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-primary font-mono">{cmd.command}</p>
                                    {cmd.adminOnly && <span className="text-xs font-bold bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">ADMIN</span>}
                                </div>
                                <p className="text-text-secondary mt-1 whitespace-pre-wrap">{cmd.response}</p>
                            </div>
                            <button
                                onClick={() => removeCommand(cmd.id)}
                                className="text-red-400 hover:text-red-300 p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 transition-colors flex-shrink-0 ml-4"
                            >
                                {ICONS.trash}
                            </button>
                        </div>
                    )) : <p className="text-text-secondary text-center py-8">No custom commands created yet.</p>}
                </div>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-border">
                <h2 className="text-xl font-bold mb-4">Built-in System Commands</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SystemCommand command="/download <url>" description="Downloads video or images from most platforms." />
                    <SystemCommand command="/status" description="Check your own status (Unique ID, warnings, role, etc.)." />
                    <SystemCommand command="/list banned" description="View the list of all banned users." />
                    <SystemCommand command="/list warned" description="View the list of users with active warnings." />
                    <SystemCommand command="/list scammers" description="View the public list of marked scammers." />
                </div>
            </div>


            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Command">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="command" className="block text-sm font-medium text-text-secondary mb-2">Command</label>
                        <input
                            type="text"
                            id="command"
                            value={newCommand}
                            onChange={(e) => setNewCommand(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="/command_name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Generate Response with AI</label>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                className="flex-grow bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none"
                                placeholder="Describe what the command should do"
                            />
                            <button
                                onClick={handleGenerateResponse}
                                disabled={isGenerating || !process.env.API_KEY}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 rounded-lg flex items-center transition-colors disabled:bg-gray-500"
                            >
                               {ICONS.wand}
                            </button>
                        </div>
                         {!process.env.API_KEY && <p className="text-xs text-yellow-400 mt-1">API_KEY environment variable not set. AI features are disabled.</p>}
                    </div>
                    <div>
                        <label htmlFor="response" className="block text-sm font-medium text-text-secondary mb-2">Response Text</label>
                        <textarea
                            id="response"
                            value={newResponse}
                            onChange={(e) => setNewResponse(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none h-32"
                            placeholder="The bot will reply with this text."
                        />
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="adminOnly"
                            checked={isAdminOnly}
                            onChange={(e) => setIsAdminOnly(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="adminOnly" className="ml-2 block text-sm text-text-secondary">
                            Admin Only Command
                        </label>
                    </div>
                    <button
                        onClick={handleAddCommand}
                        className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        Create Command
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Commands;
