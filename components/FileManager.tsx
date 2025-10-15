
import React, { useState } from 'react';
import { SharedFile } from '../types';
import { ICONS } from '../constants';
import Modal from './common/Modal';

interface FileManagerProps {
    files: SharedFile[];
    addFile: (file: Omit<SharedFile, 'id'>) => void;
    removeFile: (fileId: string) => void;
}

const FileManager: React.FC<FileManagerProps> = ({ files, addFile, removeFile }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [key, setKey] = useState('');
    const [description, setDescription] = useState('');

    const handleAddFile = () => {
        if (!name || !key || !description) {
            alert('Please fill in all fields.');
            return;
        }
        addFile({ name, key, description });
        setName('');
        setKey('');
        setDescription('');
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">File Sharing System</h1>
                    <p className="text-text-secondary">Manage files that users can access via commands.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors">
                    <span className="mr-2">{ICONS.plus}</span>
                    Add File
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {files.length > 0 ? files.map(file => (
                    <div key={file.id} className="bg-surface p-6 rounded-xl border border-border flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-text-primary">{file.name}</h3>
                            <p className="text-sm text-primary font-mono my-2 bg-background p-2 rounded">Key: {file.key}</p>
                            <p className="text-text-secondary text-sm">{file.description}</p>
                        </div>
                        <button
                            onClick={() => removeFile(file.id)}
                            className="mt-4 text-red-400 hover:text-red-300 p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors w-full flex items-center justify-center"
                        >
                            <span className="mr-2">{ICONS.trash}</span>
                            Remove
                        </button>
                    </div>
                )) : (
                    <div className="col-span-full text-center py-12 bg-surface rounded-xl border border-border">
                        <p className="text-text-secondary">No files have been shared yet.</p>
                        <p className="text-sm text-text-secondary/70">Admins and moderators can add files.</p>
                    </div>
                )}
            </div>
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New File">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">File Name</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none" placeholder="e.g., Welcome Document" />
                    </div>
                    <div>
                        <label htmlFor="key" className="block text-sm font-medium text-text-secondary mb-2">Access Key</label>
                        <input type="text" id="key" value={key} onChange={(e) => setKey(e.target.value)} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none" placeholder="e.g., welcome" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-2">Description / Content</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none h-24" placeholder="This can be the file content or a link to it." />
                    </div>
                    <button onClick={handleAddFile} className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        Add File
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default FileManager;
