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

    server.addEventListener('message', (event) => {
      this.handleMessage(server, event.data);
    });

    server.addEventListener('close', () => {
      // Cloudflare handles the WebSocket lifecycle.
    });

    server.addEventListener('error', () => {
      // Cloudflare handles the connection cleanup.
    });

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

  private handleMessage(sender: WebSocket, data: string | ArrayBuffer) {
    if (typeof data !== 'string') {
      return;
    }

    let message: unknown;

    try {
      message = JSON.parse(data);
    } catch {
      sender.send(
        JSON.stringify({
          type: 'error',
          message: 'Invalid message.',
        })
      );

      return;
    }

    this.broadcast({
      type: 'message',
      data: message,
    });
  }

  private broadcast(data: unknown) {
    const message = JSON.stringify(data);

    for (const socket of this.ctx.getWebSockets()) {
      try {
        socket.send(message);
      } catch {
        // Ignore connections that are no longer available.
      }
    }
  }
}
