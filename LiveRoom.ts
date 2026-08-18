import { DurableObject } from 'cloudflare:workers';

export class LiveRoom extends DurableObject {
  async fetch(request: Request): Promise<Response> {
    return new Response('LiveRoom is running');
  }
}
