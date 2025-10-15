
import React, { useState } from 'react';
import { ManagedChannel } from '../types';
import { ICONS } from '../constants';

interface ChannelManagementProps {
    channels: ManagedChannel[];
    addChannel: (channel: ManagedChannel) => void;
    removeChannel: (channelId: string) => void;
}

const ChannelManagement: React.FC<ChannelManagementProps> = ({ channels, addChannel, removeChannel }) => {
    const [newChannelId, setNewChannelId] = useState('');

    const handleAddChannel = () => {
        if (!newChannelId) {
            alert('Please enter a Channel ID or Username.');
            return;
        }
        addChannel({ id: newChannelId });
        setNewChannelId('');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Channel Management</h1>
            <p className="text-text-secondary mb-8">Specify which channels your bot should operate in.</p>

            <div className="max-w-2xl mx-auto">
                <div className="bg-surface p-6 rounded-xl border border-border">
                    <h2 className="text-xl font-bold mb-4">Add a New Channel</h2>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={newChannelId}
                            onChange={(e) => setNewChannelId(e.target.value)}
                            className="flex-grow bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="@channel_username or -100..."
                        />
                        <button
                            onClick={handleAddChannel}
                            className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors"
                        >
                            <span className="mr-2">{ICONS.plus}</span>
                            Add
                        </button>
                    </div>
                </div>

                <div className="mt-8 bg-surface p-6 rounded-xl border border-border">
                    <h2 className="text-xl font-bold mb-4">Managed Channels</h2>
                    <div className="space-y-3">
                        {channels.length > 0 ? channels.map(channel => (
                            <div key={channel.id} className="bg-background p-4 rounded-lg flex justify-between items-center border border-border">
                                <p className="font-semibold font-mono text-primary">{channel.id}</p>
                                <button
                                    onClick={() => removeChannel(channel.id)}
                                    className="text-red-400 hover:text-red-300 p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 transition-colors"
                                >
                                    {ICONS.trash}
                                </button>
                            </div>
                        )) : (
                            <p className="text-text-secondary text-center py-4">No channels are being managed.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChannelManagement;
