
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import Roles from './components/Roles';
import Commands from './components/Commands';
import FileManager from './components/FileManager';
import AdminActions from './components/AdminActions';
import ChannelManagement from './components/ChannelManagement';
import ProgrammableCommands from './components/ProgrammableCommands';
import Moderation from './components/Moderation';
import DirectShare from './components/DirectShare';
import { BotState, Page, User, CustomCommand, SharedFile, ManagedChannel, ProgrammableCommand, ManagedUser, DirectShare as DirectShareType } from './types';
import { initializeAiClient, isAiAvailable } from './services/geminiService';
import * as api from './services/apiService';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
    const [botState, setBotState] = useState<BotState>({
        token: '',
        backendApiUrl: '',
        isRunning: false,
        seniorAdminId: '',
        admins: [],
        moderators: [],
        commands: [],
        programmableCommands: [],
        files: [],
        channels: [],
        managedUsers: [],
        bannedWords: [],
        directShares: []
    });
    const [aiReady, setAiReady] = useState(false);

    useEffect(() => {
        try {
            const savedState = localStorage.getItem('telebotProState');
            if (savedState) {
                setBotState(JSON.parse(savedState));
            }
            initializeAiClient();
            setAiReady(isAiAvailable());
        } catch (error) {
            console.error("Failed to load state from localStorage", error);
        }
    }, []);

    const saveState = useCallback((newState: BotState) => {
        try {
            localStorage.setItem('telebotProState', JSON.stringify(newState));
            setBotState(newState);
        } catch (error) {
            console.error("Failed to save state to localStorage", error);
        }
    }, []);
    
    // API call wrapper
    const handleApiCall = async (apiFunction: Promise<any>, successMessage: string, optimisticUpdate?: Partial<BotState>) => {
        if (!botState.backendApiUrl) {
            alert('Please set your Backend API URL in Settings before performing this action.');
            return false;
        }

        if (optimisticUpdate) {
            saveState({ ...botState, ...optimisticUpdate });
        }

        const response = await apiFunction;
        if (response.success) {
            alert(successMessage);
            // If not an optimistic update, we might update state here based on response.data
            return true;
        } else {
            alert(`Error: ${response.message}`);
            // Revert optimistic update on failure
            if (optimisticUpdate) {
                const revertedState = { ...botState }; // Revert to pre-optimistic state
                 saveState(revertedState);
            }
            return false;
        }
    };


    // Bot Control
    const startBot = async () => {
        const success = await handleApiCall(
            api.controlBot(botState.backendApiUrl, botState.token, 'start'),
            'Bot start command sent successfully!',
            { isRunning: true }
        );
        if (!success) saveState({ ...botState, isRunning: false }); // Revert if API call fails
    };

    const stopBot = async () => {
        const success = await handleApiCall(
            api.controlBot(botState.backendApiUrl, botState.token, 'stop'),
            'Bot stop command sent successfully!',
            { isRunning: false }
        );
        if (!success) saveState({ ...botState, isRunning: true }); // Revert
    };

    const setToken = (token: string) => saveState({ ...botState, token });
    const setSeniorAdminId = (id: string) => saveState({ ...botState, seniorAdminId: id });
    const setBackendApiUrl = (url: string) => saveState({ ...botState, backendApiUrl: url });

    const getOrCreateManagedUser = (user: User, currentState: BotState): [ManagedUser, BotState] => {
        let managedUser = currentState.managedUsers.find(u => u.id === user.id);
        if (managedUser) {
            return [managedUser, currentState];
        }
        const newUser: ManagedUser = { ...user, uniqueId: `TBP-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, warnings: 0, isScammer: false, isBanned: false };
        const newState = { ...currentState, managedUsers: [...currentState.managedUsers, newUser] };
        return [newUser, newState];
    };
    
    // Roles Management
    const addAdmin = (user: User) => {
        const [, newState] = getOrCreateManagedUser(user, botState);
        saveState({ ...newState, admins: [...newState.admins, user] });
    };
    const removeAdmin = (userId: string) => saveState({ ...botState, admins: botState.admins.filter(u => u.id !== userId) });
    const addModerator = (user: User) => {
        const [, newState] = getOrCreateManagedUser(user, botState);
        saveState({ ...newState, moderators: [...newState.moderators, user] });
    };
    const removeModerator = (userId: string) => saveState({ ...botState, moderators: botState.moderators.filter(u => u.id !== userId) });

    // Command Management
    const addCommand = (command: Omit<CustomCommand, 'id'>) => {
        const newCommand = { ...command, id: Date.now().toString() };
        saveState({ ...botState, commands: [...botState.commands, newCommand] });
    };
    const removeCommand = (commandId: string) => saveState({ ...botState, commands: botState.commands.filter(c => c.id !== commandId) });

    // Programmable Commands
    const addProgrammableCommand = (command: Omit<ProgrammableCommand, 'id'>) => {
        const newCommand = { ...command, id: Date.now().toString() };
        saveState({ ...botState, programmableCommands: [...botState.programmableCommands, newCommand] });
    };
    const removeProgrammableCommand = (commandId: string) => saveState({ ...botState, programmableCommands: botState.programmableCommands.filter(c => c.id !== commandId) });

    // File Management
    const addFile = (file: Omit<SharedFile, 'id'>) => {
        const newFile = { ...file, id: Date.now().toString() };
        saveState({ ...botState, files: [...botState.files, newFile] });
    };
    const removeFile = (fileId: string) => saveState({ ...botState, files: botState.files.filter(f => f.id !== fileId) });

    // Channel Management
    const addChannel = (channel: ManagedChannel) => saveState({ ...botState, channels: [...botState.channels, channel] });
    const removeChannel = (channelId: string) => saveState({ ...botState, channels: botState.channels.filter(c => c.id !== channelId) });

    // Moderation
    const addBannedWord = (word: string) => saveState({ ...botState, bannedWords: [...botState.bannedWords, word.toLowerCase()] });
    const removeBannedWord = (word: string) => saveState({ ...botState, bannedWords: botState.bannedWords.filter(w => w !== word) });

    const addWarning = (userId: string) => {
        let userBanned = false;
        const updatedUsers = botState.managedUsers.map(u => {
            if (u.id === userId) {
                const newWarnings = u.warnings + 1;
                if (newWarnings >= 3) {
                    userBanned = true;
                    return { ...u, warnings: newWarnings, isBanned: true };
                }
                return { ...u, warnings: newWarnings };
            }
            return u;
        });
        if (userBanned) alert(`User ${userId} has been automatically banned after reaching 3 warnings.`);
        saveState({ ...botState, managedUsers: updatedUsers });
    };

    const pardonUser = (userId: string) => {
        const updatedUsers = botState.managedUsers.map(u => u.id === userId ? { ...u, warnings: 0, isBanned: false } : u);
        saveState({ ...botState, managedUsers: updatedUsers });
    };

    const toggleScammerStatus = (userId: string) => {
        const updatedUsers = botState.managedUsers.map(u => u.id === userId ? { ...u, isScammer: !u.isScammer } : u);
        saveState({ ...botState, managedUsers: updatedUsers });
    };

    const manualBan = (userId: string) => {
        const updatedUsers = botState.managedUsers.map(u => u.id === userId ? { ...u, isBanned: true } : u);
        saveState({ ...botState, managedUsers: updatedUsers });
    }

    // Direct Share
    const sendDirectFile = (share: Omit<DirectShareType, 'id' | 'timestamp'>) => {
        const newShare: DirectShareType = { ...share, id: Date.now().toString(), timestamp: new Date().toISOString() };
        saveState({ ...botState, directShares: [newShare, ...botState.directShares] });
        alert(`File "${share.fileName}" sent to user ${share.recipientId}`);
    };

    const renderPage = () => {
        switch (currentPage) {
            case Page.Dashboard: return <Dashboard botState={botState} />;
            case Page.Settings: return <Settings token={botState.token} setToken={setToken} backendApiUrl={botState.backendApiUrl} setBackendApiUrl={setBackendApiUrl} seniorAdminId={botState.seniorAdminId} setSeniorAdminId={setSeniorAdminId} isRunning={botState.isRunning} startBot={startBot} stopBot={stopBot} />;
            case Page.Roles: return <Roles admins={botState.admins} moderators={botState.moderators} addAdmin={addAdmin} removeAdmin={removeAdmin} addModerator={addModerator} removeModerator={removeModerator} />;
            case Page.Commands: return <Commands commands={botState.commands} addCommand={addCommand} removeCommand={removeCommand} isAiAvailable={aiReady} />;
            case Page.ProgrammableCommands: return <ProgrammableCommands commands={botState.programmableCommands} addCommand={addProgrammableCommand} removeCommand={removeProgrammableCommand} />;
            case Page.FileManager: return <FileManager files={botState.files} addFile={addFile} removeFile={removeFile} />;
            case Page.DirectShare: return <DirectShare directShares={botState.directShares} sendDirectFile={sendDirectFile} />;
            case Page.Moderation: return <Moderation botState={botState} addBannedWord={addBannedWord} removeBannedWord={removeBannedWord} addWarning={addWarning} pardonUser={pardonUser} toggleScammerStatus={toggleScammerStatus} manualBan={manualBan} />;
            case Page.AdminActions: return <AdminActions isAiAvailable={aiReady} apiUrl={botState.backendApiUrl} botToken={botState.token} />;
            case Page.ChannelManagement: return <ChannelManagement channels={botState.channels} addChannel={addChannel} removeChannel={removeChannel} />;
            default: return <Dashboard botState={botState} />;
        }
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} isRunning={botState.isRunning}/>
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                {renderPage()}
            </main>
        </div>
    );
};

export default App;
