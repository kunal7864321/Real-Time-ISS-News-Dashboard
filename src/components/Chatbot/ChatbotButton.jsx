import React from 'react';
import { MessageSquare, X } from 'lucide-react';

export const ChatbotButton = ({ isOpen, toggleOpen }) => {
  return (
    <button
      onClick={toggleOpen}
      className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all duration-300 z-50 ${
        isOpen 
          ? 'bg-red-500 hover:bg-red-600 text-white rotate-90' 
          : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-110'
      }`}
      aria-label="Toggle Chatbot"
    >
      {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
    </button>
  );
};
