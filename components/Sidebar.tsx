
import React from 'react';
import { Page } from '../types';
import { ICONS } from '../constants';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isRunning: boolean;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: Page;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}> = ({ icon, label, currentPage, setCurrentPage }) => (
  <li
    className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors ${
      currentPage === label
        ? 'bg-primary text-white'
        : 'text-text-secondary hover:bg-surface hover:text-text-primary'
    }`}
    onClick={() => setCurrentPage(label)}
    aria-label={`Navigate to ${label}`}
    role="button"
  >
    {icon}
    <span className="ml-4 font-medium">{label}</span>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isRunning }) => {
  return (
    <aside className="w-64 bg-secondary p-4 flex flex-col fixed h-full">
      <div className="flex items-center mb-8">
         <svg className="h-10 w-10 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.89 16.82c-.89-1.06-2.22-1.63-3.66-1.57-1.45.07-2.79.63-3.69 1.69C7.66 18.06 7 19.48 7 21h10c0-1.52-.66-2.94-1.56-4.06l-.55-.12zM12 13c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" fill="#3b82f6" opacity=".4"/><path d="M12 13c-2.21 0-4-1.79-4-4s-1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm4.44 9.94c.54-1.06.56-2.28 0-3.38-.56-1.1-.56-2.28 0-3.38.54-1.06.56-2.28 0-3.38-1.07-.55-2.29-.56-3.38 0-1.1.56-2.28.56-3.38 0-1.06-.54-2.28-.56-3.38 0-.56 1.1-.56 2.28 0 3.38 1.07.55 2.29.56 3.38 0 1.1-.56 2.28-.56 3.38 0zm.56-6.88c.89 1.06 2.22 1.63 3.66 1.57 1.45-.07 2.79-.63 3.69-1.69.89-1.06 1.45-2.48 1.45-4 0-1.52-.55-2.94-1.45-4-1.06-.89-2.48-1.45-4-1.45s-2.94.55-4 1.45c-.89 1.06-1.45 2.48-1.45 4 0 1.52.55 2.94 1.45 4zM8.54 16.94c-.54 1.06-.56 2.28 0 3.38.56 1.1.56 2.28 0 3.38-.54 1.06-.56 2.28 0 3.38 1.07.55 2.29.56 3.38 0 1.1-.56 2.28-.56 3.38 0 1.06.54 2.28.56 3.38 0 .56-1.1.56-2.28 0-3.38-1.07-.55-2.29-.56-3.38 0-1.1.56-2.28.56-3.38 0z" fill="#3b82f6"/></svg>
        <h1 className="text-xl font-bold ml-2">TeleBot Pro</h1>
      </div>
      <nav className="flex-grow">
        <ul>
          {Object.values(Page).map(page => (
            <NavItem
              key={page}
              icon={ICONS[page.toLowerCase().replace(/ /g, '')] || ICONS.dashboard}
              label={page}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        <div className={`flex items-center p-3 rounded-lg ${isRunning ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          <div className="relative flex items-center">
            <span className={`h-3 w-3 rounded-full ${isRunning ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {isRunning && <span className={`absolute h-3 w-3 rounded-full animate-ping ${isRunning ? 'bg-green-400' : 'bg-red-400'}`}></span>}
          </div>
          <span className="font-semibold ml-3">{isRunning ? 'Bot is Running' : 'Bot is Stopped'}</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
