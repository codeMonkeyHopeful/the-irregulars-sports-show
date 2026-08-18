import { DurableObject } from 'cloudflare:workers';

import type { ChatMessage } from './app/live/liveRoom';

const MESSAGES_KEY = 'messages';
const MAX_MESSAGES = 200;

type RoomMessage =
  | {
      type: 'chat';
      id: string;
      name: string;
      message: string;
      timestamp: number;
      isHost?: boolean;
    }
  | {
      type: 'delete';
      id: string;
    }
  | {
      type: 'clear';
    };

export class LiveRoom extends DurableObject {
  async fetch(request: Request): Promise<Response> {
    if (request.headers.get('Upgrade') !== 'websocket') {
      return new Response('LiveRoom is running');
    }

    const webSocketPair = new WebSocketPair();

    const client = webSocketPair[0];
    const server = webSocketPair[1];

    this.ctx.acceptWebSocket(server);

    const messages = await this.getMessages();

    server.send(
      JSON.stringify({
        type: 'history',
        data: messages,
      })
    );

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  async webSocketMessage(socket: WebSocket, message: string | ArrayBuffer) {
    if (typeof message !== 'string') {
      return;
    }

    let parsedMessage: unknown;

    try {
      parsedMessage = JSON.parse(message);
    } catch {
      socket.send(
        JSON.stringify({
          type: 'error',
          message: 'Invalid message.',
        })
      );

      return;
    }

    if (!this.isRoomMessage(parsedMessage)) {
      socket.send(
        JSON.stringify({
          type: 'error',
          message: 'Invalid chat message.',
        })
      );

      return;
    }

    switch (parsedMessage.type) {
      case 'chat':
        await this.handleChatMessage(parsedMessage);
        break;

      case 'delete':
        await this.handleDeleteMessage(parsedMessage.id);
        break;

      case 'clear':
        await this.handleClearMessages();
        break;
    }
  }

  async webSocketClose(socket: WebSocket, code: number, reason: string) {
    socket.close(code, reason);
  }

  async webSocketError(socket: WebSocket, error: unknown) {
    console.error('WebSocket error:', error);
  }

  private async handleChatMessage(
    message: Extract<RoomMessage, { type: 'chat' }>
  ) {
    const newMessage: ChatMessage = {
      id: message.id,
      name: message.name,
      message: message.message,
      timestamp: message.timestamp,
      isHost: message.isHost ?? false,
    };

    const messages = await this.getMessages();

    const updatedMessages = [...messages, newMessage].slice(-MAX_MESSAGES);

    await this.ctx.storage.put(MESSAGES_KEY, updatedMessages);

    this.broadcast({
      type: 'message',
      data: newMessage,
    });
  }

  private async handleDeleteMessage(id: string) {
    const messages = await this.getMessages();

    const updatedMessages = messages.filter((message) => message.id !== id);

    await this.ctx.storage.put(MESSAGES_KEY, updatedMessages);

    this.broadcast({
      type: 'message-deleted',
      id,
    });
  }

  private async handleClearMessages() {
    await this.ctx.storage.put(MESSAGES_KEY, []);

    this.broadcast({
      type: 'chat-cleared',
    });
  }

  private async getMessages(): Promise<ChatMessage[]> {
    const messages = await this.ctx.storage.get<ChatMessage[]>(MESSAGES_KEY);

    return messages ?? [];
  }

  private broadcast(data: unknown) {
    const message = JSON.stringify(data);

    for (const socket of this.ctx.getWebSockets()) {
      try {
        socket.send(message);
      } catch {
        // Ignore disconnected sockets.
      }
    }
  }

  private isRoomMessage(value: unknown): value is RoomMessage {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const message = value as Record<string, unknown>;

    if (message.type === 'chat') {
      return (
        typeof message.id === 'string' &&
        typeof message.name === 'string' &&
        typeof message.message === 'string' &&
        typeof message.timestamp === 'number'
      );
    }

    if (message.type === 'delete') {
      return typeof message.id === 'string';
    }

    if (message.type === 'clear') {
      return true;
    }

    return false;
  }
}
