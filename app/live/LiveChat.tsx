'use client';

import { useState } from 'react';
import { useLiveChat } from './useLiveChat';
import { useLivePasscode } from './useLivePasscode';
import { useLiveStatus } from './useLiveStatus';

export const LiveChat = () => {
  const { isLive } = useLiveStatus();
  const { passcode } = useLivePasscode();

  const { messages, addMessage, connected } = useLiveChat();

  const [enteredPasscode, setEnteredPasscode] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (enteredPasscode === passcode) {
      setAuthenticated(true);
      return;
    }

    alert('Incorrect passcode');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedMessage) {
      return;
    }

    const sent = addMessage(trimmedName, trimmedMessage);

    if (sent) {
      setMessage('');
    }
  };

  /*
   * OFFLINE
   */
  if (!isLive) {
    return (
      <div className="w-full rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <p className="font-semibold text-[hsl(2,100%,29%)]">
          ⚫ LIVE CHAT OFFLINE
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Check back when the show is live.
        </p>
      </div>
    );
  }

  /*
   * PASSCODE
   */
  if (!authenticated) {
    return (
      <div className="mx-auto w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <p className="font-semibold text-[hsl(2,100%,29%)]">🔴 LIVE</p>

          <h3 className="mt-3 text-xl font-bold text-[#171717]">
            Enter the chat
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Enter the passcode provided by the host.
          </p>
        </div>

        <form
          onSubmit={handlePasscodeSubmit}
          className="mt-6 flex flex-col gap-4"
        >
          <input
            type="password"
            value={enteredPasscode}
            onChange={(e) => setEnteredPasscode(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-[#171717] outline-none transition placeholder:text-gray-400 focus:border-[hsl(2,100%,29%)] focus:ring-2 focus:ring-[hsl(2,100%,29%)]/20"
            placeholder="Enter passcode"
          />

          <button
            type="submit"
            className="rounded-lg bg-[hsl(2,100%,29%)] px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Enter Chat
          </button>
        </form>
      </div>
    );
  }

  /*
   * CHAT
   */
  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 bg-[hsl(2,100%,29%)] px-5 py-4 text-center">
        <p className="font-bold tracking-wide text-white">🔴 LIVE</p>

        <p className="mt-1 text-sm text-[hsl(50,77%,88%)]">
          Join the conversation
        </p>
      </div>

      {/* Connection status */}
      {!connected && (
        <div className="border-b border-yellow-200 bg-yellow-50 px-4 py-2 text-center text-xs font-medium text-yellow-800">
          Connecting to live chat...
        </div>
      )}

      {/* Messages */}
      <div className="flex h-[400px] flex-col gap-3 overflow-y-auto bg-white p-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-sm text-gray-500">
            <p>
              No messages yet.
              <br />
              <span className="text-[hsl(2,100%,29%)]">
                Start the conversation!
              </span>
            </p>
          </div>
        ) : (
          messages.map((chatMessage) => (
            <div
              key={chatMessage.id}
              className={
                chatMessage.isHost
                  ? 'rounded-lg border border-[hsl(2,100%,29%)]/20 bg-[hsl(50,77%,88%)] p-3'
                  : 'rounded-lg bg-gray-100 p-3'
              }
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#171717]">
                  {chatMessage.name}
                </span>

                {chatMessage.isHost && (
                  <span className="rounded bg-[hsl(2,100%,29%)] px-2 py-0.5 text-xs font-bold text-white">
                    HOST
                  </span>
                )}

                <span className="ml-auto text-xs text-gray-400">
                  {new Date(chatMessage.timestamp).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <p className="mt-1 break-words text-[#171717]">
                {chatMessage.message}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Message form */}
      <form
        onSubmit={handleSendMessage}
        className="border-t border-gray-200 bg-gray-50 p-4"
      >
        {/* Name */}
        <div className="mb-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-[#171717] outline-none transition placeholder:text-gray-400 focus:border-[hsl(2,100%,29%)] focus:ring-2 focus:ring-[hsl(2,100%,29%)]/20"
            placeholder="Your name"
            maxLength={30}
          />
        </div>

        {/* Message */}
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white p-3 text-[#171717] outline-none transition placeholder:text-gray-400 focus:border-[hsl(2,100%,29%)] focus:ring-2 focus:ring-[hsl(2,100%,29%)]/20"
            placeholder="Write a message..."
            maxLength={500}
          />

          <button
            type="submit"
            disabled={!connected}
            className="rounded-lg bg-[hsl(2,100%,29%)] px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};
