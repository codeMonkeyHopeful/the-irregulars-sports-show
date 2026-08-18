'use client';

import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DEFAULT_LIVE_ROOM } from '../liveRoom';
import { useLiveChat } from '../useLiveChat';
import { useLivePasscode } from '../useLivePasscode';
import { useLiveStatus } from '../useLiveStatus';

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
    const token = localStorage.getItem('live-admin-token');

    if (token) {
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

    setLoggingIn(true);
    setLoginError('');

    try {
      const response = await fetch('/api/live/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
        }),
      });

      const body: unknown = await response.json();

      if (
        !body ||
        typeof body !== 'object' ||
        !('success' in body) ||
        !('token' in body)
      ) {
        setLoginError('Login failed.');
        return;
      }

      if (typeof body.success !== 'boolean' || typeof body.token !== 'string') {
        setLoginError('Invalid login response.');
        return;
      }

      if (!response.ok || !body.success) {
        setLoginError('Incorrect password.');
        return;
      }

      localStorage.setItem('live-admin-token', body.token);

      setAuthenticated(true);
      setPassword('');
    } catch (error) {
      console.error('Admin login error:', error);
      setLoginError('Unable to contact the server.');
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

    const sent = addMessage('Host', trimmedMessage, true);

    if (sent) {
      setHostMessage('');
    }
  };

  const handleClearChat = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete all chat messages?'
    );

    if (confirmed) {
      clearMessages();
    }
  };

  /*
   * ADMIN LOGIN
   */
  if (!authenticated) {
    return (
      <section className="mx-auto w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <p className="font-bold tracking-wide text-[hsl(2,100%,29%)]">
            🔴 LIVE
          </p>

          <h2 className="mt-3 text-2xl font-bold text-[#171717]">
            Admin Login
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to manage the live show.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-full">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-[#171717]"
            >
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
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-[#171717] outline-none transition placeholder:text-gray-400 focus:border-[hsl(2,100%,29%)] focus:ring-2 focus:ring-[hsl(2,100%,29%)]/20 disabled:bg-gray-100"
              placeholder="Enter password"
              autoComplete="current-password"
              disabled={loggingIn}
            />
          </div>

          {loginError && (
            <p
              className="w-full rounded-lg border border-red-200 bg-red-50 p-3 text-left text-sm font-medium text-[hsl(2,100%,29%)]"
              role="alert"
            >
              {loginError}
            </p>
          )}

          <button
            type="submit"
            disabled={loggingIn}
            className="w-full rounded-lg bg-[hsl(2,100%,29%)] px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loggingIn ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </section>
    );
  }

  return (
    <div className="flex w-full flex-col gap-8">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-5">
        <div>
          <h1 className="mt-1 text-3xl font-bold text-white">Show Control</h1>
        </div>

        <button
          onClick={handleLogout}
          className="text-sm font-medium text-gray-500 underline transition hover:text-[hsl(2,100%,29%)]"
        >
          <LogOut size={30} className="inline-block mr-1" />
        </button>
      </div>

      {/* LIVE CONTROLS */}
      <section className="w-full">
        <h2 className="mb-4 text-xl font-bold text-white">Live Show Control</h2>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="bg-[hsl(2,100%,29%)] px-6 py-4">
            <p className="font-semibold text-white">Broadcast Status</p>
          </div>

          <div className="p-6">
            <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:text-left">
              <div>
                <p className="text-sm text-gray-500">Chat Status</p>

                <p className="mt-1 text-xl font-bold text-[#171717]">
                  {isLive ? (
                    <span className="text-[hsl(2,100%,29%)]">🔴 LIVE</span>
                  ) : (
                    <span className="text-gray-500">⚫ OFFLINE</span>
                  )}
                </p>
              </div>

              {isLive ? (
                <button
                  onClick={endLive}
                  className="rounded-lg bg-[hsl(2,100%,29%)] px-6 py-3 font-semibold text-white transition hover:opacity-90"
                >
                  End Live
                </button>
              ) : (
                <button
                  onClick={startLive}
                  className="rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
                >
                  Start Live
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SHOW MANAGEMENT */}
      <section className="w-full">
        <h2 className="mb-4 text-xl font-bold text-white">Show Management</h2>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm leading-6 text-gray-600">
            Reset the local live show before starting a new test. This will end
            the show, clear all messages, and remove the listener passcode.
          </p>

          <button
            onClick={handleResetShow}
            className="mt-5 rounded-lg bg-[hsl(2,100%,29%)] px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Reset Show
          </button>
        </div>
      </section>

      {/* LISTENER PASSCODE */}
      <section className="w-full">
        <h2 className="mb-4 text-xl font-bold text-white">Listener Chat</h2>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm leading-6 text-gray-500">
            Set the passcode listeners will use to enter the live chat.
          </p>

          <div className="mx-auto mt-6 max-w-md">
            <label
              htmlFor="passcode"
              className="block text-sm font-semibold text-white"
            >
              Listener Passcode
            </label>

            <input
              id="passcode"
              type="text"
              value={passcode}
              onChange={(e) => updatePasscode(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-[#171717] outline-none transition placeholder:text-gray-400 focus:border-[hsl(2,100%,29%)] focus:ring-2 focus:ring-[hsl(2,100%,29%)]/20"
              placeholder="Example: IRREGULARS26"
            />
          </div>

          <div className="mt-5 text-center">
            <button
              onClick={handleSavePasscode}
              className="rounded-lg bg-[hsl(2,100%,29%)] px-6 py-3 font-semibold text-white transition hover:opacity-90"
            >
              Save Passcode
            </button>
          </div>
        </div>
      </section>

      {/* HOST MESSAGE */}
      <section className="w-full">
        <h2 className="mb-4 text-xl font-bold text-white">Host Message</h2>

        <form
          onSubmit={handleHostMessage}
          className="rounded-xl border border-[hsl(2,100%,29%)]/20 bg-[hsl(50,77%,88%)] p-6"
        >
          <p className="mb-4 text-sm text-gray-600">
            Messages sent here will appear in the chat with a HOST badge.
          </p>

          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={hostMessage}
              onChange={(e) => setHostMessage(e.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white p-3 text-[#171717] outline-none transition placeholder:text-gray-400 focus:border-[hsl(2,100%,29%)] focus:ring-2 focus:ring-[hsl(2,100%,29%)]/20"
              placeholder="Send a message as the host..."
              maxLength={500}
            />

            <button
              type="submit"
              className="rounded-lg bg-[hsl(2,100%,29%)] px-5 py-3 font-semibold text-white transition hover:opacity-90"
            >
              Send
            </button>
          </div>
        </form>
      </section>

      {/* CHAT MODERATION */}
      <section className="w-full">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Chat Moderation</h2>

            <p className="mt-1 text-sm text-gray-500">
              {messages.length} message{messages.length === 1 ? '' : 's'}
            </p>
          </div>

          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="rounded-lg bg-[hsl(2,100%,29%)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Clear Chat
            </button>
          )}
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {messages.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              No messages yet.
            </div>
          ) : (
            <div className="flex max-h-[500px] flex-col gap-3 overflow-y-auto bg-white p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.isHost
                      ? 'rounded-lg border border-[hsl(2,100%,29%)]/20 bg-[hsl(50,77%,88%)] p-4'
                      : 'rounded-lg bg-gray-100 p-4'
                  }
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#171717]">
                      {message.name}
                    </span>

                    {message.isHost && (
                      <span className="rounded bg-[hsl(2,100%,29%)] px-2 py-0.5 text-xs font-bold text-white">
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
                    <p className="break-words text-[#171717]">
                      {message.message}
                    </p>

                    <button
                      onClick={() => deleteMessage(message.id)}
                      className="shrink-0 text-sm font-semibold text-[hsl(2,100%,29%)] underline transition hover:opacity-70"
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
