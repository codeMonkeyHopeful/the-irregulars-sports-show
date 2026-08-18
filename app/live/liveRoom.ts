export type ChatMessage = {
  id: string;
  name: string;
  message: string;
  timestamp: number;
  isHost?: boolean;
};

export type LiveRoom = {
  isLive: boolean;
  passcode: string;
  messages: ChatMessage[];
};

export const DEFAULT_LIVE_ROOM: LiveRoom = {
  isLive: false,
  passcode: '',
  messages: [],
};
