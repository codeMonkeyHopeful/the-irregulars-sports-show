'use client';

import { useEffect, useState } from 'react';
import type { ChatMessage, LiveRoom } from './liveRoom';

const STORAGE_KEY = 'live-room';

const DEFAULT_ROOM: LiveRoom = {
  isLive: false,
  passcode: '',
  messages: [],
};

export const useLiveChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const loadMessages = () => {
      const savedRoom = localStorage.getItem(STORAGE_KEY);

      if (!savedRoom) {
        setMessages([]);
        return;
      }

      try {
        const room: LiveRoom = JSON.parse(savedRoom);
        setMessages(room.messages ?? []);
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

  const updateRoom = (update: Partial<LiveRoom>) => {
    const savedRoom = localStorage.getItem(STORAGE_KEY);

    let room: LiveRoom = DEFAULT_ROOM;

    if (savedRoom) {
      try {
        room = JSON.parse(savedRoom);
      } catch {
        room = DEFAULT_ROOM;
      }
    }

    const updatedRoom: LiveRoom = {
      ...room,
      ...update,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRoom));

    return updatedRoom;
  };

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

      updateRoom({
        messages: updatedMessages,
      });

      return updatedMessages;
    });
  };

  const deleteMessage = (id: string) => {
    setMessages((currentMessages) => {
      const updatedMessages = currentMessages.filter(
        (message) => message.id !== id
      );

      updateRoom({
        messages: updatedMessages,
      });

      return updatedMessages;
    });
  };

  const clearMessages = () => {
    setMessages([]);

    updateRoom({
      messages: [],
    });
  };

  return {
    messages,
    addMessage,
    deleteMessage,
    clearMessages,
  };
};
