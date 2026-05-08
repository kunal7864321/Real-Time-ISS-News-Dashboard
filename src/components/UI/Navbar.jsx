import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Rocket } from 'lucide-react';

export const Navbar = ({ isDark, toggleTheme }) => {
  return (
    <nav className="sticky top-0 z-50 glass-panel rounded-none border-t-0 border-l-0 border-r-0 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Rocket className="w-8 h-8 text-blue-600 dark:text-cyan-400" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-blue-500">
              Nexus Dashboard
            </h1>
          </div>
          <div className="flex items-center">
            <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
          </div>
        </div>
      </div>
    </nav>
  );
};
