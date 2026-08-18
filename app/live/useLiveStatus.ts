'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'live-room';

type LiveRoomState = {
  isLive: boolean;
  passcode: string;
  messages: unknown[];
};

const DEFAULT_ROOM: LiveRoomState = {
  isLive: false,
  passcode: '',
  messages: [],
};

export const useLiveStatus = () => {
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const loadStatus = () => {
      const savedRoom = localStorage.getItem(STORAGE_KEY);

      if (!savedRoom) {
        setIsLive(false);
        return;
      }

      try {
        const room: LiveRoomState = JSON.parse(savedRoom);
        setIsLive(room.isLive);
      } catch {
        setIsLive(false);
      }
    };

    loadStatus();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        loadStatus();
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const updateRoom = (update: Partial<LiveRoomState>) => {
    const savedRoom = localStorage.getItem(STORAGE_KEY);

    let room = DEFAULT_ROOM;

    if (savedRoom) {
      try {
        room = JSON.parse(savedRoom);
      } catch {
        room = DEFAULT_ROOM;
      }
    }

    const updatedRoom = {
      ...room,
      ...update,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRoom));

    setIsLive(updatedRoom.isLive);
  };

  const startLive = () => {
    updateRoom({
      isLive: true,
    });
  };

  const endLive = () => {
    updateRoom({
      isLive: false,
    });
  };

  return {
    isLive,
    startLive,
    endLive,
  };
};
