'use client';

import { useEffect, useState } from 'react';

export type ChatMessage = {
  id: string;
  name: string;
  message: string;
  timestamp: number;
  isHost?: boolean;
};

const STORAGE_KEY = 'live-chat-messages';

export const useLiveChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);

    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch {
        setMessages([]);
      }
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        if (event.newValue) {
          try {
            setMessages(JSON.parse(event.newValue));
          } catch {
            setMessages([]);
          }
        } else {
          setMessages([]);
        }
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

    const updatedMessages = [...messages, newMessage];

    setMessages(updatedMessages);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages));
  };

  const deleteMessage = (id: string) => {
    const updatedMessages = messages.filter((message) => message.id !== id);

    setMessages(updatedMessages);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages));
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
