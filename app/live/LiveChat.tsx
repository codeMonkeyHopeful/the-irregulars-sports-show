'use client';

import { useState } from 'react';
import { useLiveChat } from './useLiveChat';
import { useLivePasscode } from './useLivePasscode';
import { useLiveStatus } from './useLiveStatus';

export const LiveChat = () => {
  const { isLive } = useLiveStatus();
  const { passcode } = useLivePasscode();

  const { messages, addMessage } = useLiveChat();

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

    addMessage(trimmedName, trimmedMessage);

    setMessage('');
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

        <form
          onSubmit={handlePasscodeSubmit}
          className="mt-6 flex flex-col gap-4"
        >
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
    <div className="w-full rounded-xl border">
      {/* Header */}
      <div className="border-b p-4 text-center">
        <p className="font-semibold text-red-600">🔴 LIVE</p>

        <p className="text-sm text-gray-500">Join the conversation</p>
      </div>

      {/* Messages */}
      <div className="flex h-[400px] flex-col gap-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-sm text-gray-500">
            <p>
              No messages yet.
              <br />
              Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((chatMessage) => (
            <div key={chatMessage.id} className="rounded-lg bg-gray-100 p-3">
              <div className="flex items-center gap-2">
                <span className="font-bold">{chatMessage.name}</span>

                {chatMessage.isHost && (
                  <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
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

              <p className="mt-1 break-words">{chatMessage.message}</p>
            </div>
          ))
        )}
      </div>

      {/* Message form */}
      <form onSubmit={handleSendMessage} className="border-t p-4">
        <div className="mb-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="Your name"
            maxLength={30}
          />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border p-3"
            placeholder="Write a message..."
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
    </div>
  );
};
