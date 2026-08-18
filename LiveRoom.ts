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

type AdminAuthResult = {
  authenticated: boolean;
};

export class LiveRoom extends DurableObject {
  async fetch(request: Request): Promise<Response> {
    if (request.headers.get('Upgrade') !== 'websocket') {
      return new Response('LiveRoom is running');
    }

    const webSocketPair = new WebSocketPair();

    const client = webSocketPair[0];
    const server = webSocketPair[1];

    const token = new URL(request.url).searchParams.get('token');

    const auth = await this.authenticateAdmin(token);

    this.ctx.acceptWebSocket(server);

    server.serializeAttachment({
      isAdmin: auth.authenticated,
    });

    const messages = await this.getMessages();

    server.send(
      JSON.stringify({
        type: 'connected',
        message: 'Connected to the live room.',
        isAdmin: auth.authenticated,
      })
    );

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
      this.sendError(socket, 'Invalid message.');
      return;
    }

    if (!this.isRoomMessage(parsedMessage)) {
      this.sendError(socket, 'Invalid chat message.');
      return;
    }

    const isAdmin = this.isAdminSocket(socket);

    switch (parsedMessage.type) {
      case 'chat':
        await this.handleChatMessage(parsedMessage, isAdmin);
        break;

      case 'delete':
        if (!isAdmin) {
          this.sendError(socket, 'Admin permission required.');
          return;
        }

        await this.handleDeleteMessage(parsedMessage.id);
        break;

      case 'clear':
        if (!isAdmin) {
          this.sendError(socket, 'Admin permission required.');
          return;
        }

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
    message: Extract<RoomMessage, { type: 'chat' }>,
    isAdmin: boolean
  ) {
    const newMessage: ChatMessage = {
      id: message.id,
      name: message.name,
      message: message.message,
      timestamp: message.timestamp,

      // Only the authenticated admin can create
      // a host message.
      isHost: isAdmin && message.isHost === true,
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

  private isAdminSocket(socket: WebSocket): boolean {
    const attachment = socket.deserializeAttachment();

    if (!attachment || typeof attachment !== 'object') {
      return false;
    }

    return 'isAdmin' in attachment && attachment.isAdmin === true;
  }

  private async authenticateAdmin(
    token: string | null
  ): Promise<AdminAuthResult> {
    if (!token) {
      return {
        authenticated: false,
      };
    }

    const { payload, signature } = this.parseAdminToken(token);

    if (!payload || !signature) {
      return {
        authenticated: false,
      };
    }

    const parts = payload.split(':');

    if (parts.length !== 2 || parts[0] !== 'admin') {
      return {
        authenticated: false,
      };
    }

    const expiresAt = Number(parts[1]);

    if (
      !Number.isFinite(expiresAt) ||
      expiresAt <= Math.floor(Date.now() / 1000)
    ) {
      return {
        authenticated: false,
      };
    }

    const adminPassword = this.getAdminPassword();

    if (!adminPassword) {
      console.error('ADMIN_PASSWORD is not configured.');

      return {
        authenticated: false,
      };
    }

    const expectedSignature = await this.createSignature(
      adminPassword,
      payload
    );

    if (!this.constantTimeEqual(signature, expectedSignature)) {
      return {
        authenticated: false,
      };
    }

    return {
      authenticated: true,
    };
  }

  private getAdminPassword(): string | undefined {
    const env = this.env as typeof this.env & {
      ADMIN_PASSWORD?: string;
    };

    return env.ADMIN_PASSWORD;
  }

  private parseAdminToken(token: string): {
    payload: string | null;
    signature: string | null;
  } {
    const lastColon = token.lastIndexOf(':');

    if (lastColon === -1) {
      return {
        payload: null,
        signature: null,
      };
    }

    return {
      payload: token.slice(0, lastColon),
      signature: token.slice(lastColon + 1),
    };
  }

  private async createSignature(
    secret: string,
    payload: string
  ): Promise<string> {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      {
        name: 'HMAC',
        hash: 'SHA-256',
      },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(payload)
    );

    return Array.from(new Uint8Array(signature))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  private constantTimeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;

    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }

  private sendError(socket: WebSocket, message: string) {
    try {
      socket.send(
        JSON.stringify({
          type: 'error',
          message,
        })
      );
    } catch {
      // Ignore disconnected sockets.
    }
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
