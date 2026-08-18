'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'live-passcode';

export const useLivePasscode = () => {
  const [passcode, setPasscode] = useState('');

  useEffect(() => {
    const savedPasscode = localStorage.getItem(STORAGE_KEY);

    if (savedPasscode) {
      setPasscode(savedPasscode);
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        setPasscode(event.newValue ?? '');
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
    localStorage.setItem(STORAGE_KEY, passcode);
  };

  return {
    passcode,
    updatePasscode,
    savePasscode,
  };
};
