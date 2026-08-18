'use client';

import { useEffect } from 'react';

export const LiveChat = () => {
  useEffect(() => {
    const existingScript = document.querySelector(
      'script[data-chateasily-room="vE6e3oKWJP"]'
    );

    if (existingScript) {
      return;
    }

    const script = document.createElement('script');

    script.src = 'https://chat.chateasily.com/embed-loader.js';
    script.async = true;

    script.dataset.chateasilyRoom = 'vE6e3oKWJP';
    script.dataset.roomId = 'vE6e3oKWJP';
    script.dataset.mode = 'inline';
    script.dataset.target = '#my-chat';
    script.dataset.width = '100%';
    script.dataset.height = '500px';

    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return <div id="my-chat" />;
};
