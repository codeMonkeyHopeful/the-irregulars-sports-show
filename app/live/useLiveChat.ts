'use client';

import { useEffect, useState } from 'react';

import type { ChatMessage } from './liveRoom';
import { useLiveRoom } from './useLiveRoom';

export const useLiveChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const { connected, lastMessage, sendMessage } = useLiveRoom();

  useEffect(() => {
    if (!lastMessage) {
      return;
    }

    /*
     * Someone connected and the Durable Object
     * sent the existing chat history.
     */
    if (lastMessage.type === 'history') {
      if (!Array.isArray(lastMessage.data)) {
        return;
      }

      setMessages(lastMessage.data as ChatMessage[]);

      return;
    }

    /*
     * New chat message.
     */
    if (lastMessage.type === 'message') {
      const data = lastMessage.data;

      if (!data || typeof data !== 'object') {
        return;
      }

      const chatMessage = data as ChatMessage;

      if (!chatMessage.id || !chatMessage.name || !chatMessage.message) {
        return;
      }

      setMessages((currentMessages) => {
        if (currentMessages.some((message) => message.id === chatMessage.id)) {
          return currentMessages;
        }

        return [...currentMessages, chatMessage].slice(-200);
      });

      return;
    }

    /*
     * Admin deleted a message.
     */
    if (lastMessage.type === 'message-deleted') {
      const id = lastMessage.id;

      if (typeof id !== 'string') {
        return;
      }

      setMessages((currentMessages) =>
        currentMessages.filter((message) => message.id !== id)
      );

      return;
    }

    /*
     * Admin cleared the entire chat.
     */
    if (lastMessage.type === 'chat-cleared') {
      setMessages([]);

      return;
    }
  }, [lastMessage]);

  const addMessage = (name: string, message: string, isHost = false) => {
    if (!connected) {
      return false;
    }

    return sendMessage({
      type: 'chat',
      id: crypto.randomUUID(),
      name,
      message,
      timestamp: Date.now(),
      isHost,
    });
  };

  const deleteMessage = (id: string) => {
    if (!connected) {
      return false;
    }

    return sendMessage({
      type: 'delete',
      id,
    });
  };

  const clearMessages = () => {
    if (!connected) {
      return false;
    }

    return sendMessage({
      type: 'clear',
    });
  };

  return {
    messages,
    addMessage,
    deleteMessage,
    clearMessages,
    connected,
  };
};
