import React from 'react';
import { Users } from 'lucide-react';

export const PeopleInSpace = ({ count, names }) => {
  return (
    <div className="glass-panel p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
          <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold dark:text-white">People in Space</h2>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{count}</p>
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Aboard the ISS</h3>
        <ul className="space-y-2">
          {names.map((name, idx) => (
            <li key={idx} className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-dark-bg p-2 rounded">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>{name}</span>
            </li>
          ))}
          {names.length === 0 && (
            <li className="text-gray-500 italic">No astronaut data available</li>
          )}
        </ul>
      </div>
    </div>
  );
};
