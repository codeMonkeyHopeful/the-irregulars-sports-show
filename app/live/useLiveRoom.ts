'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type LiveRoomMessage = {
  type: string;
  data?: unknown;
  message?: string;
  id?: string;
};

type UseLiveRoomOptions = {
  enabled?: boolean;
  authToken?: string | null;
};

export const useLiveRoom = ({
  enabled = true,
  authToken = null,
}: UseLiveRoomOptions = {}) => {
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

      /*
       * If this connection belongs to an
       * authenticated admin, identify it
       * immediately after connecting.
       */
      if (authToken) {
        socket.send(
          JSON.stringify({
            type: 'authenticate',
            token: authToken,
          })
        );
      }
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
  }, [enabled, authToken]);

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
