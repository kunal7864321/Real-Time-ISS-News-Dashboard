import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/UI/Navbar';
import { ISSTracker } from './components/ISS/ISSTracker';
import { NewsDashboard } from './components/News/NewsDashboard';
import { ChatbotButton } from './components/Chatbot/ChatbotButton';
import { ChatWindow } from './components/Chatbot/ChatWindow';

import { useTheme } from './hooks/useTheme';
import { useISS } from './hooks/useISS';
import { useNews } from './hooks/useNews';
import { useChatbot } from './hooks/useChatbot';

function App() {
  const { isDark, toggleTheme } = useTheme();
  
  // Data hooks
  const issData = useISS();
  const newsData = useNews();
  
  // Chatbot hook requires context from ISS and News
  const dashboardContext = {
    iss: issData.data,
    news: newsData.news
  };
  
  const chatbot = useChatbot(dashboardContext);
  
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: isDark ? '#1f2937' : '#ffffff',
            color: isDark ? '#f3f4f6' : '#111827',
          }
        }} 
      />
      
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <ISSTracker 
          issData={issData.data} 
          loading={issData.loading} 
          error={issData.error}
          refetch={issData.refetch}
          countdown={issData.countdown}
          isDark={isDark}
        />
        
        <NewsDashboard 
          newsData={newsData} 
          isDark={isDark}
        />
      </main>

      <ChatWindow 
        isOpen={isChatOpen} 
        messages={chatbot.messages}
        isTyping={chatbot.isTyping}
        sendMessage={chatbot.sendMessage}
        clearChat={chatbot.clearChat}
      />
      
      <ChatbotButton 
        isOpen={isChatOpen} 
        toggleOpen={() => setIsChatOpen(!isChatOpen)} 
      />
    </div>
  );
}

export default App;
