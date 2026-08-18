// @ts-ignore
import { default as handler } from './.open-next/worker.js';

import { LiveRoom } from './LiveRoom';

export { LiveRoom };

type WorkerEnv = {
  LIVE_ROOM: DurableObjectNamespace;
};

export default {
  async fetch(
    request: Request,
    env: WorkerEnv,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/live') {
      const roomId = env.LIVE_ROOM.idFromName('main');
      const room = env.LIVE_ROOM.get(roomId);

      return room.fetch(request);
    }

    return handler.fetch(request, env, ctx);
  },
};
