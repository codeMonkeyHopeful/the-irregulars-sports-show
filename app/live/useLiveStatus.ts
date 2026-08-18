'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'live-status';

export const useLiveStatus = () => {
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const readStatus = () => {
      const status = localStorage.getItem(STORAGE_KEY);
      setIsLive(status === 'true');
    };

    // Get the current status when the component loads.
    readStatus();

    // Listen for changes from another browser tab.
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        readStatus();
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const startLive = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsLive(true);
  };

  const endLive = () => {
    localStorage.setItem(STORAGE_KEY, 'false');
    setIsLive(false);
  };

  return {
    isLive,
    startLive,
    endLive,
  };
};
