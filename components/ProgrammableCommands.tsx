
import React, { useState } from 'react';
import { ProgrammableCommand } from '../types';
import { ICONS } from '../constants';
import Modal from './common/Modal';

interface ProgrammableCommandsProps {
    commands: ProgrammableCommand[];
    addCommand: (command: Omit<ProgrammableCommand, 'id'>) => void;
    removeCommand: (commandId: string) => void;
}

const ProgrammableCommands: React.FC<ProgrammableCommandsProps> = ({ commands, addCommand, removeCommand }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCommand, setNewCommand] = useState('');
    const [newCode, setNewCode] = useState('def handle(bot, update):\n    # Your code here\n    pass');

    const handleAddCommand = () => {
        if (!newCommand || !newCode) {
            alert('Please fill in both command and code.');
            return;
        }
        addCommand({ command: newCommand.startsWith('/p_') ? newCommand : `/p_${newCommand}`, code: newCode });
        setNewCommand('');
        setNewCode('def handle(bot, update):\n    # Your code here\n    pass');
        setIsModalOpen(false);
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Programmable Commands</h1>
                    <p className="text-text-secondary">Define complex actions using Python. Commands must start with /p_</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors">
                    <span className="mr-2">{ICONS.plus}</span>
                    New Script
                </button>
            </div>
            
            <div className="bg-surface p-6 rounded-xl border border-border">
                <div className="space-y-4">
                    {commands.length > 0 ? commands.map(cmd => (
                        <div key={cmd.id} className="bg-background p-4 rounded-lg border border-border flex justify-between items-start">
                            <div className="w-full overflow-hidden">
                                <p className="font-semibold text-primary font-mono">{cmd.command}</p>
                                <pre className="text-text-secondary mt-2 bg-black/30 p-4 rounded-md text-sm overflow-x-auto">
                                    <code>{cmd.code}</code>
                                </pre>
                            </div>
                            <button
                                onClick={() => removeCommand(cmd.id)}
                                className="text-red-400 hover:text-red-300 p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 transition-colors flex-shrink-0 ml-4"
                            >
                                {ICONS.trash}
                            </button>
                        </div>
                    )) : <p className="text-text-secondary text-center py-8">No programmable commands created yet.</p>}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Programmable Command">
                <form onSubmit={e => {e.preventDefault(); handleAddCommand();}} className="space-y-4">
                    <div>
                        <label htmlFor="p_command" className="block text-sm font-medium text-text-secondary mb-2">Command</label>
                        <input
                            type="text"
                            id="p_command"
                            value={newCommand}
                            onChange={(e) => setNewCommand(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="/p_my_script"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-text-secondary mb-2">Python Code</label>
                        <textarea
                            id="code"
                            value={newCode}
                            onChange={(e) => setNewCode(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary font-mono text-sm focus:ring-2 focus:ring-primary focus:outline-none h-64"
                            placeholder="def handle(bot, update): ..."
                            required
                        />
                         <p className="text-xs text-text-secondary mt-2">Note: This is a simulation. The code is saved but not executed in this interface.</p>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        Create Script
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default ProgrammableCommands;
