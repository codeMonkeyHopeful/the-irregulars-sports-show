'use client';

import { useEffect, useState } from 'react';
import { ChatMessage } from './liveRoom';

const STORAGE_KEY = 'live-chat-messages';

export const useLiveChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const loadMessages = () => {
      const savedMessages = localStorage.getItem(STORAGE_KEY);

      if (!savedMessages) {
        setMessages([]);
        return;
      }

      try {
        setMessages(JSON.parse(savedMessages));
      } catch {
        setMessages([]);
      }
    };

    loadMessages();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        loadMessages();
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const addMessage = (name: string, message: string, isHost = false) => {
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      name,
      message,
      timestamp: Date.now(),
      isHost,
    };

    setMessages((currentMessages) => {
      const updatedMessages = [...currentMessages, newMessage];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages));

      return updatedMessages;
    });
  };

  const deleteMessage = (id: string) => {
    setMessages((currentMessages) => {
      const updatedMessages = currentMessages.filter(
        (message) => message.id !== id
      );

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages));

      return updatedMessages;
    });
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    messages,
    addMessage,
    deleteMessage,
    clearMessages,
  };
};
