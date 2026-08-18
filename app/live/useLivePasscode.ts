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

export const useLivePasscode = () => {
  const [passcode, setPasscode] = useState('');

  useEffect(() => {
    const loadPasscode = () => {
      const savedRoom = localStorage.getItem(STORAGE_KEY);

      if (!savedRoom) {
        setPasscode('');
        return;
      }

      try {
        const room: LiveRoomState = JSON.parse(savedRoom);
        setPasscode(room.passcode ?? '');
      } catch {
        setPasscode('');
      }
    };

    loadPasscode();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        loadPasscode();
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const updatePasscode = (value: string) => {
    setPasscode(value);
  };

  const savePasscode = () => {
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
      passcode,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRoom));
  };

  return {
    passcode,
    updatePasscode,
    savePasscode,
  };
};
