
import React from 'react';
import { BotState } from '../types';

interface DashboardProps {
    botState: BotState;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: string }> = ({ title, value, icon }) => (
    <div className="bg-surface p-6 rounded-xl border border-border flex items-center">
        <div className="bg-primary/20 text-primary p-3 rounded-lg">
            <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
            <p className="text-text-secondary">{title}</p>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ botState }) => {
    const warnedUsers = botState.managedUsers.filter(u => u.warnings > 0 && !u.isBanned).length;
    const bannedUsers = botState.managedUsers.filter(u => u.isBanned).length;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-text-secondary mb-8">An overview of your bot's current status and configuration.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Bot Status" value={botState.isRunning ? 'Running' : 'Stopped'} icon={botState.isRunning ? '✅' : '❌'} />
                <StatCard title="Admins" value={botState.admins.length} icon="🛡️" />
                <StatCard title="Moderators" value={botState.moderators.length} icon="⚔️" />
                <StatCard title="Managed Channels" value={botState.channels.length} icon="📢" />
                <StatCard title="Custom Commands" value={botState.commands.length} icon="⚙️" />
                <StatCard title="Programmable Commands" value={botState.programmableCommands.length} icon="👨‍💻" />
                <StatCard title="Shared Files" value={botState.files.length} icon="📁" />
                <StatCard title="Warned Users" value={warnedUsers} icon="⚠️" />
                <StatCard title="Banned Users" value={bannedUsers} icon="🚫" />
                <StatCard title="Banned Words" value={botState.bannedWords.length} icon="📝" />
            </div>

            <div className="mt-10 bg-surface p-6 rounded-xl border border-border">
                <h2 className="text-xl font-bold mb-4">Quick Info</h2>
                <ul className="space-y-3 text-text-secondary">
                    <li className="flex justify-between items-center">
                        <span>Senior Admin ID:</span>
                        <code className="bg-background px-2 py-1 rounded text-primary font-mono">{botState.seniorAdminId || 'Not Set'}</code>
                    </li>
                    <li className="flex justify-between items-center">
                        <span>Bot Token:</span>
                        <code className="bg-background px-2 py-1 rounded text-primary font-mono">{botState.token ? `${botState.token.substring(0, 12)}...` : 'Not Set'}</code>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
