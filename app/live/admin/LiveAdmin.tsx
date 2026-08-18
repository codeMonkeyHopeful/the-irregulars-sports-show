'use client';

import { useEffect, useState } from 'react';
import { DEFAULT_LIVE_ROOM } from '../liveRoom';
import { useLiveChat } from '../useLiveChat';
import { useLivePasscode } from '../useLivePasscode';
import { useLiveStatus } from '../useLiveStatus';

type AdminLoginResponse = {
  success?: boolean;
  token?: string;
  expiresAt?: number;
  error?: string;
};

export const LiveAdmin = () => {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [hostMessage, setHostMessage] = useState('');

  const { isLive, startLive, endLive } = useLiveStatus();

  const { passcode, updatePasscode, savePasscode } = useLivePasscode();

  const { messages, addMessage, deleteMessage, clearMessages } = useLiveChat();

  useEffect(() => {
    const savedToken = localStorage.getItem('live-admin-token');

    if (savedToken) {
      setAuthenticated(true);
    }
  }, []);

  const handleResetShow = () => {
    const confirmed = window.confirm(
      'Reset the entire live show? This will end the live session, clear the chat, and remove the listener passcode.'
    );

    if (!confirmed) {
      return;
    }

    localStorage.setItem('live-room', JSON.stringify(DEFAULT_LIVE_ROOM));

    window.location.reload();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoginError('');

    const trimmedPassword = password.trim();

    if (!trimmedPassword) {
      setLoginError('Please enter your password.');
      return;
    }

    setLoggingIn(true);

    try {
      const response = await fetch('/api/live/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: trimmedPassword,
        }),
      });

      const data = (await response.json()) as AdminLoginResponse;

      if (!response.ok) {
        setLoginError(
          typeof data.error === 'string' ? data.error : 'Login failed.'
        );

        return;
      }

      if (data.success !== true || typeof data.token !== 'string') {
        setLoginError('Login failed.');
        return;
      }

      localStorage.setItem('live-admin-token', data.token);

      setAuthenticated(true);
      setPassword('');
    } catch {
      setLoginError('Unable to connect to the server. Please try again.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('live-admin-token');
    setAuthenticated(false);
  };

  const handleSavePasscode = () => {
    savePasscode();
    alert('Listener passcode saved.');
  };

  const handleHostMessage = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedMessage = hostMessage.trim();

    if (!trimmedMessage) {
      return;
    }

    addMessage('Host', trimmedMessage, true);
    setHostMessage('');
  };

  const handleClearChat = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete all chat messages?'
    );

    if (confirmed) {
      clearMessages();
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
              onChange={(e) => {
                setPassword(e.target.value);
                setLoginError('');
              }}
              className="mt-2 w-full rounded-lg border p-3"
              placeholder="Enter password"
              autoComplete="current-password"
              disabled={loggingIn}
            />
          </div>

          {loginError && (
            <p
              className="w-full text-left text-sm font-medium text-red-600"
              role="alert"
            >
              {loginError}
            </p>
          )}

          <button
            type="submit"
            disabled={loggingIn}
            className="rounded-lg bg-black px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loggingIn ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </section>
    );
  }

  return (
    <div className="flex w-full flex-col gap-[32px]">
      {/* Live controls */}
      <section className="w-full">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Live Show Control</h2>

          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 underline"
          >
            Logout
          </button>
        </div>

        <div className="rounded-xl border p-6">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">Chat Status</p>

              <p className="mt-1 text-xl font-bold">
                {isLive ? '🔴 LIVE' : '⚫ OFFLINE'}
              </p>
            </div>

            {isLive ? (
              <button
                onClick={endLive}
                className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white"
              >
                End Live
              </button>
            ) : (
              <button
                onClick={startLive}
                className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white"
              >
                Start Live
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Show management */}
      <section className="w-full">
        <h2 className="mb-6 text-2xl font-bold">Show Management</h2>

        <div className="rounded-xl border border-red-200 p-6">
          <p className="text-sm text-gray-500">
            Reset the local live show before starting a new test. This will end
            the show, clear all messages, and remove the listener passcode.
          </p>

          <button
            onClick={handleResetShow}
            className="mt-5 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
          >
            Reset Show
          </button>
        </div>
      </section>

      {/* Listener passcode */}
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
              onChange={(e) => updatePasscode(e.target.value)}
              className="mt-2 w-full rounded-lg border p-3"
              placeholder="Example: IRREGULARS26"
            />
          </div>

          <button
            onClick={handleSavePasscode}
            className="mt-5 rounded-lg bg-black px-6 py-3 font-semibold text-white"
          >
            Save Passcode
          </button>
        </div>
      </section>

      {/* Host message */}
      <section className="w-full">
        <h2 className="mb-6 text-center text-2xl font-bold">Host Message</h2>

        <form onSubmit={handleHostMessage} className="rounded-xl border p-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={hostMessage}
              onChange={(e) => setHostMessage(e.target.value)}
              className="min-w-0 flex-1 rounded-lg border p-3"
              placeholder="Send a message as the host..."
              maxLength={500}
            />

            <button
              type="submit"
              className="rounded-lg bg-black px-5 py-3 font-semibold text-white"
            >
              Send
            </button>
          </div>
        </form>
      </section>

      {/* Chat moderation */}
      <section className="w-full">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Chat Moderation</h2>

          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Clear Chat
            </button>
          )}
        </div>

        <div className="rounded-xl border">
          {messages.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              No messages yet.
            </div>
          ) : (
            <div className="flex max-h-[500px] flex-col gap-3 overflow-y-auto p-4">
              {messages.map((message) => (
                <div key={message.id} className="rounded-lg bg-gray-100 p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{message.name}</span>

                    {message.isHost && (
                      <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                        HOST
                      </span>
                    )}

                    <span className="ml-auto text-xs text-gray-400">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="mt-2 flex items-start justify-between gap-4">
                    <p className="break-words">{message.message}</p>

                    <button
                      onClick={() => deleteMessage(message.id)}
                      className="shrink-0 text-sm font-semibold text-red-600 underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
