
export interface User {
  id: string; // Telegram User ID
  username: string;
}

export interface ManagedUser extends User {
  uniqueId: string; // Bot-generated permanent ID
  warnings: number;
  isScammer: boolean;
  isBanned: boolean;
}

export interface CustomCommand {
  id: string;
  command: string; // e.g., "/hello"
  response: string;
  adminOnly: boolean;
}

export interface ProgrammableCommand {
  id: string;
  command: string;
  code: string; // Python code
}

export interface SharedFile {
  id:string;
  name: string;
  key: string;
  description: string;
}

export interface DirectShare {
    id: string;
    recipientId: string;
    fileName: string;
    caption: string;
    timestamp: string;
}

export interface ManagedChannel {
    id: string; // Channel ID e.g. @channelusername or -100...
}

export interface BotState {
  token: string;
  isRunning: boolean;
  seniorAdminId: string;
  admins: User[];
  moderators: User[];
  commands: CustomCommand[];
  programmableCommands: ProgrammableCommand[];
  files: SharedFile[];
  channels: ManagedChannel[];
  managedUsers: ManagedUser[];
  bannedWords: string[];
  directShares: DirectShare[];
}

export enum Page {
    Dashboard = 'Dashboard',
    Settings = 'Settings',
    Roles = 'Roles',
    Commands = 'Commands',
    ProgrammableCommands = 'Programmable Commands',
    FileManager = 'File Manager',
    DirectShare = 'Direct Share',
    Moderation = 'Moderation',
    AdminActions = 'Admin Actions',
    ChannelManagement = 'Channel Management'
}
