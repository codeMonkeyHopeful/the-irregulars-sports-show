'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type LiveRoomMessage = {
  type: string;
  data?: unknown;
  message?: string;
};

type UseLiveRoomOptions = {
  enabled?: boolean;
};

export const useLiveRoom = ({ enabled = true }: UseLiveRoomOptions = {}) => {
  const socketRef = useRef<WebSocket | null>(null);

  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<LiveRoomMessage | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

    const socketUrl = `${protocol}//${window.location.host}/api/live`;

    const socket = new WebSocket(socketUrl);

    socketRef.current = socket;

    socket.addEventListener('open', () => {
      setConnected(true);
    });

    socket.addEventListener('message', (event) => {
      try {
        const parsed: LiveRoomMessage = JSON.parse(event.data);

        setLastMessage(parsed);
      } catch {
        console.error('Received invalid WebSocket message.');
      }
    });

    socket.addEventListener('close', () => {
      setConnected(false);
      socketRef.current = null;
    });

    socket.addEventListener('error', () => {
      setConnected(false);
    });

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [enabled]);

  const sendMessage = useCallback((message: unknown) => {
    const socket = socketRef.current;

    if (!socket) {
      return false;
    }

    if (socket.readyState !== WebSocket.OPEN) {
      return false;
    }

    socket.send(JSON.stringify(message));

    return true;
  }, []);

  return {
    connected,
    lastMessage,
    sendMessage,
  };
};
