'use client';

import { useLiveStatus } from './useLiveStatus';

export const LiveChat = () => {
  const { isLive } = useLiveStatus();

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

  return (
    <div className="rounded-xl border p-8">
      <div className="mb-6 text-center">
        <p className="font-semibold text-red-600">🔴 LIVE</p>

        <p className="mt-1 text-sm text-gray-500">
          The chat is currently live.
        </p>
      </div>

      {/* Real chat will go here */}
      <div className="rounded-lg bg-gray-100 p-6 text-center">
        <p>Chat is live!</p>
      </div>
    </div>
  );
};
