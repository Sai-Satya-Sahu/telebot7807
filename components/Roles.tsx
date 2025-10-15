
import React, { useState } from 'react';
import { User } from '../types';
import { ICONS } from '../constants';
import Modal from './common/Modal';

interface RolesProps {
    admins: User[];
    moderators: User[];
    addAdmin: (user: User) => void;
    removeAdmin: (userId: string) => void;
    addModerator: (user: User) => void;
    removeModerator: (userId: string) => void;
}

const UserList: React.FC<{ users: User[], onRemove: (id: string) => void, role: string }> = ({ users, onRemove, role }) => (
    <div className="space-y-3">
        {users.length > 0 ? users.map(user => (
            <div key={user.id} className="bg-background p-4 rounded-lg flex justify-between items-center border border-border">
                <div>
                    <p className="font-semibold">{user.username}</p>
                    <p className="text-sm text-text-secondary font-mono">ID: {user.id}</p>
                </div>
                <button
                    onClick={() => onRemove(user.id)}
                    className="text-red-400 hover:text-red-300 p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 transition-colors"
                    aria-label={`Remove ${role} ${user.username}`}
                >
                    {ICONS.trash}
                </button>
            </div>
        )) : <p className="text-text-secondary text-center py-4">No {role}s found.</p>}
    </div>
);


const Roles: React.FC<RolesProps> = ({ admins, moderators, addAdmin, removeAdmin, addModerator, removeModerator }) => {
    const [activeTab, setActiveTab] = useState<'admins' | 'moderators'>('admins');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUserId, setNewUserId] = useState('');
    const [newUsername, setNewUsername] = useState('');

    const handleAddUser = () => {
        if (!newUserId || !newUsername) {
            alert('Please fill in both User ID and Username.');
            return;
        }
        const newUser = { id: newUserId, username: newUsername };
        if (activeTab === 'admins') {
            addAdmin(newUser);
        } else {
            addModerator(newUser);
        }
        setNewUserId('');
        setNewUsername('');
        setIsModalOpen(false);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Role Management</h1>
            <p className="text-text-secondary mb-8">Assign roles and manage permissions for your bot. Adding a user here will register them with the bot and generate a permanent Unique ID.</p>
            
            <div className="flex border-b border-border mb-6">
                <button
                    onClick={() => setActiveTab('admins')}
                    className={`px-6 py-3 font-semibold ${activeTab === 'admins' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`}
                >
                    Admins ({admins.length})
                </button>
                <button
                    onClick={() => setActiveTab('moderators')}
                    className={`px-6 py-3 font-semibold ${activeTab === 'moderators' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`}
                >
                    Moderators ({moderators.length})
                </button>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-border">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold capitalize">{activeTab}</h2>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors">
                        <span className="mr-2">{ICONS.plus}</span>
                        Add {activeTab === 'admins' ? 'Admin' : 'Moderator'}
                    </button>
                </div>
                {activeTab === 'admins' ? (
                    <UserList users={admins} onRemove={removeAdmin} role="admin" />
                ) : (
                    <UserList users={moderators} onRemove={removeModerator} role="moderator" />
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Add New ${activeTab === 'admins' ? 'Admin' : 'Moderator'}`}>
                <form onSubmit={(e) => { e.preventDefault(); handleAddUser(); }} className="space-y-4">
                     <div>
                        <label htmlFor="userId" className="block text-sm font-medium text-text-secondary mb-2">User ID</label>
                        <input
                            type="text"
                            id="userId"
                            value={newUserId}
                            onChange={(e) => setNewUserId(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="e.g., 123456789"
                            required
                        />
                    </div>
                     <div>
                        <label htmlFor="username" className="block text-sm font-medium text-text-secondary mb-2">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="e.g., john_doe"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        Add User
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Roles;
