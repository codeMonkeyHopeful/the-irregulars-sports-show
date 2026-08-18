import { DurableObject } from 'cloudflare:workers';

export class LiveRoom extends DurableObject {
  async fetch(request: Request): Promise<Response> {
    if (request.headers.get('Upgrade') !== 'websocket') {
      return new Response('LiveRoom is running');
    }

    const webSocketPair = new WebSocketPair();

    const client = webSocketPair[0];
    const server = webSocketPair[1];

    this.ctx.acceptWebSocket(server);

    server.send(
      JSON.stringify({
        type: 'connected',
        message: 'Connected to the live room.',
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

    this.broadcast({
      type: 'message',
      data: parsedMessage,
    });
  }

  async webSocketClose(
    socket: WebSocket,
    code: number,
    reason: string,
    wasClean: boolean
  ) {
    socket.close(code, reason);
  }

  async webSocketError(socket: WebSocket, error: unknown) {
    console.error('WebSocket error:', error);
  }

  private broadcast(data: unknown) {
    const message = JSON.stringify(data);

    for (const socket of this.ctx.getWebSockets()) {
      try {
        socket.send(message);
      } catch {
        // Ignore sockets that are no longer available.
      }
    }
  }
}
