'use client';

import { useState } from 'react';

export const LiveAdmin = () => {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const [isLive, setIsLive] = useState(false);
  const [passcode, setPasscode] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // TEMPORARY ONLY
    if (password === 'test123') {
      setAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  if (!authenticated) {
    return (
      <section className="w-full max-w-md text-center">
        <h2 className="mb-6 text-2xl font-bold">Admin Login</h2>

        <form
          onSubmit={handleLogin}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-full text-left">
            <label htmlFor="password" className="block text-sm font-medium">
              Admin Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-lg border p-3"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="rounded-lg bg-black px-6 py-3 font-semibold text-white"
          >
            Login
          </button>
        </form>
      </section>
    );
  }

  return (
    <div className="flex w-full flex-col gap-[32px]">
      <section className="w-full">
        <h2 className="mb-6 text-center text-2xl font-bold">
          Live Show Control
        </h2>

        <div className="rounded-xl border p-6">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">Chat Status</p>

              <p className="mt-1 text-xl font-bold">
                {isLive ? '🔴 LIVE' : '⚫ OFFLINE'}
              </p>
            </div>

            <button
              onClick={() => setIsLive((current) => !current)}
              className={`rounded-lg px-6 py-3 font-semibold text-white ${
                isLive ? 'bg-red-600' : 'bg-green-600'
              }`}
            >
              {isLive ? 'End Live' : 'Start Live'}
            </button>
          </div>
        </div>
      </section>

      <section className="w-full">
        <h2 className="mb-6 text-center text-2xl font-bold">Listener Chat</h2>

        <div className="rounded-xl border p-6 text-center">
          <p className="text-sm text-gray-500">
            Set the passcode listeners will use to enter the live chat.
          </p>

          <div className="mx-auto mt-6 max-w-md text-left">
            <label htmlFor="passcode" className="block text-sm font-medium">
              Listener Passcode
            </label>

            <input
              id="passcode"
              type="text"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="mt-2 w-full rounded-lg border p-3"
              placeholder="Example: IRREGULARS26"
            />
          </div>

          <button
            className="mt-5 rounded-lg bg-black px-6 py-3 font-semibold text-white"
            onClick={() => alert(`Passcode set to: ${passcode}`)}
          >
            Save Passcode
          </button>
        </div>
      </section>
    </div>
  );
};
