'use client';

import { useEffect, useState } from 'react';
import type { ChatMessage } from './liveRoom';
import { useLiveRoom } from './useLiveRoom';

export const useLiveChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const { connected, lastMessage, sendMessage } = useLiveRoom();

  /*
   * Listen for messages coming from the
   * Cloudflare Durable Object.
   */
  useEffect(() => {
    if (!lastMessage) {
      return;
    }

    if (lastMessage.type !== 'message') {
      return;
    }

    const data = lastMessage.data;

    if (!data || typeof data !== 'object') {
      return;
    }

    const chatData = data as {
      type?: string;
      name?: string;
      message?: string;
      timestamp?: number;
      isHost?: boolean;
      id?: string;
    };

    if (chatData.type !== 'chat' || !chatData.name || !chatData.message) {
      return;
    }

    const newMessage: ChatMessage = {
      id: chatData.id ?? crypto.randomUUID(),
      name: chatData.name,
      message: chatData.message,
      timestamp: chatData.timestamp ?? Date.now(),
      isHost: chatData.isHost ?? false,
    };

    setMessages((currentMessages) => {
      /*
       * Prevent the same message from being
       * added twice.
       */
      if (currentMessages.some((message) => message.id === newMessage.id)) {
        return currentMessages;
      }

      return [...currentMessages, newMessage].slice(-200);
    });
  }, [lastMessage]);

  /*
   * Send a listener or host message.
   */
  const addMessage = (name: string, message: string, isHost = false) => {
    if (!connected) {
      return false;
    }

    const newMessage = {
      type: 'chat',
      id: crypto.randomUUID(),
      name,
      message,
      timestamp: Date.now(),
      isHost,
    };

    return sendMessage(newMessage);
  };

  /*
   * Delete a message locally for now.
   *
   * We'll make moderation server-side in the
   * next step so all listeners see the deletion.
   */
  const deleteMessage = (id: string) => {
    setMessages((currentMessages) =>
      currentMessages.filter((message) => message.id !== id)
    );
  };

  /*
   * Clear messages locally for now.
   *
   * We'll make this a room-wide operation
   * in the next step.
   */
  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    addMessage,
    deleteMessage,
    clearMessages,
    connected,
  };
};
