
import React, { useState } from 'react';
import { DirectShare as DirectShareType } from '../types';

interface DirectShareProps {
    directShares: DirectShareType[];
    sendDirectFile: (share: Omit<DirectShareType, 'id' | 'timestamp'>) => void;
}

const DirectShare: React.FC<DirectShareProps> = ({ directShares, sendDirectFile }) => {
    const [recipientId, setRecipientId] = useState('');
    const [fileName, setFileName] = useState('');
    const [caption, setCaption] = useState('');

    const handleSend = () => {
        if (!recipientId || !fileName) {
            alert('Recipient ID and File Name are required.');
            return;
        }
        sendDirectFile({ recipientId, fileName, caption });
        setRecipientId('');
        setFileName('');
        setCaption('');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Direct File Sharing</h1>
            <p className="text-text-secondary mb-8">Send a file with a caption directly to a user's private chat with the bot.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-surface p-6 rounded-xl border border-border">
                        <h2 className="text-xl font-bold mb-4">Send New File</h2>
                        <form onSubmit={(e) => {e.preventDefault(); handleSend();}} className="space-y-4">
                            <div>
                                <label htmlFor="recipientId" className="block text-sm font-medium text-text-secondary mb-2">Recipient User ID or Unique ID</label>
                                <input
                                    type="text"
                                    id="recipientId"
                                    value={recipientId}
                                    onChange={(e) => setRecipientId(e.target.value)}
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none"
                                    placeholder="e.g., 123456789 or TBP-..."
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="fileName" className="block text-sm font-medium text-text-secondary mb-2">File Name / Path</label>
                                <input
                                    type="text"
                                    id="fileName"
                                    value={fileName}
                                    onChange={(e) => setFileName(e.target.value)}
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none"
                                    placeholder="e.g., /path/to/your/file.zip"
                                    required
                                />
                                <p className="text-xs text-text-secondary mt-1">Note: This is a simulation. No file is actually uploaded from this interface.</p>
                            </div>
                            <div>
                                <label htmlFor="caption" className="block text-sm font-medium text-text-secondary mb-2">Caption (Optional)</label>
                                <textarea
                                    id="caption"
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none h-24"
                                    placeholder="Add an optional message..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg transition-colors"
                            >
                                Send File
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-surface p-6 rounded-xl border border-border">
                         <h2 className="text-xl font-bold mb-4">Sharing Log</h2>
                         <div className="space-y-3 max-h-96 overflow-y-auto">
                            {directShares.length > 0 ? directShares.map(share => (
                                <div key={share.id} className="bg-background p-4 rounded-lg border border-border">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold">To: <span className="font-mono text-primary">{share.recipientId}</span></p>
                                            <p className="font-semibold">File: <span className="font-mono text-text-primary">{share.fileName}</span></p>
                                            {share.caption && <p className="text-text-secondary mt-2 border-l-2 border-border pl-2 italic text-sm">"{share.caption}"</p>}
                                        </div>
                                        <span className="text-xs text-text-secondary flex-shrink-0 ml-4">{new Date(share.timestamp).toLocaleString()}</span>
                                    </div>
                                </div>
                            )) : <p className="text-text-secondary text-center py-8">No files have been sent directly yet.</p>}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DirectShare;
