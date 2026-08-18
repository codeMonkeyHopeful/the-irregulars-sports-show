'use client';

import { useState } from 'react';
import { useLivePasscode } from './useLivePasscode';
import { useLiveStatus } from './useLiveStatus';

export const LiveChat = () => {
  const { isLive } = useLiveStatus();
  const { passcode } = useLivePasscode();

  const [enteredPasscode, setEnteredPasscode] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (enteredPasscode === passcode) {
      setAuthenticated(true);
    } else {
      alert('Incorrect passcode');
    }
  };

  if (!isLive) {
    return (
      <div className="rounded-xl border p-8 text-center">
        <p className="text-lg font-semibold">
          The live chat is currently offline.
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Check back when the show is live.
        </p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="mx-auto w-full max-w-md rounded-xl border p-8">
        <div className="text-center">
          <p className="font-semibold text-red-600">🔴 LIVE</p>

          <h3 className="mt-3 text-xl font-bold">Enter the chat</h3>

          <p className="mt-2 text-sm text-gray-500">
            Enter the passcode provided by the host.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <input
            type="password"
            value={enteredPasscode}
            onChange={(e) => setEnteredPasscode(e.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="Enter passcode"
          />

          <button
            type="submit"
            className="rounded-lg bg-black px-6 py-3 font-semibold text-white"
          >
            Enter Chat
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="rounded-xl border p-8">
      <div className="mb-6 text-center">
        <p className="font-semibold text-red-600">🔴 LIVE</p>

        <p className="mt-1 text-sm text-gray-500">
          You are connected to the live chat.
        </p>
      </div>

      {/* Real-time chat will go here */}
      <div className="rounded-lg bg-gray-100 p-6 text-center">
        <p>Chat is live!</p>
      </div>
    </div>
  );
};
