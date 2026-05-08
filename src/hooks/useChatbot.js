import { useState, useEffect, useCallback } from 'react';
import { HfInference } from '@huggingface/inference';
import { getStorageItem, setStorageItem } from '../utils/localStorage';
import toast from 'react-hot-toast';

const HF_TOKEN = import.meta.env.VITE_HF_TOKEN;
const hf = new HfInference(HF_TOKEN);
const MODEL_ID = 'meta-llama/Meta-Llama-3-8B-Instruct';

export const useChatbot = (dashboardContext) => {
  const [messages, setMessages] = useState(() => getStorageItem('chatbot_messages', []));
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setStorageItem('chatbot_messages', messages);
  }, [messages]);

  const clearChat = () => {
    setMessages([]);
    toast.success('Chat cleared');
  };

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg].slice(-30));
    
    setIsTyping(true);

    try {
      const systemPrompt = `You are a helpful dashboard assistant. Answer ONLY using the data below. Do not use outside knowledge. If the user asks something not covered by this data, say: "I can only answer questions based on the current dashboard data."
      
ISS DATA:
Position: Lat ${dashboardContext.iss?.position?.latitude || 'N/A'}, Lon ${dashboardContext.iss?.position?.longitude || 'N/A'}
Speed: ${(dashboardContext.iss?.speed || 0).toFixed(2)} km/h
Location: ${dashboardContext.iss?.locationName || 'N/A'}
People in space: ${dashboardContext.iss?.peopleCount || 0} - ${(dashboardContext.iss?.peopleNames || []).join(', ')}

NEWS DATA:
${Object.entries(dashboardContext.news || {}).map(([category, articles]) => 
  `${category}: ${articles?.length || 0} articles. Titles: ${articles?.slice(0, 3).map(a => a.title).join(' | ')}`
).join('\n')}`;

      // Format history for Llama 3 API
      const formattedMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role === 'bot' ? 'assistant' : m.role, content: m.content })),
        { role: 'user', content: text }
      ];

      const response = await hf.chatCompletion({
        model: MODEL_ID,
        messages: formattedMessages,
        max_tokens: 250
      });

      let botText = response.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
      
      const botMsg = { id: Date.now() + 1, role: 'bot', content: botText.trim() };
      setMessages(prev => [...prev, botMsg].slice(-30));
    } catch (error) {
      console.error(error);
      const errorMsg = { id: Date.now() + 1, role: 'bot', content: "Error connecting to AI service." };
      setMessages(prev => [...prev, errorMsg].slice(-30));
    } finally {
      setIsTyping(false);
    }
  }, [dashboardContext, messages]);

  return { messages, isTyping, sendMessage, clearChat };
};
