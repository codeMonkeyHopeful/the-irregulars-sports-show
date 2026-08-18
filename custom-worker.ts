// @ts-ignore
import { default as handler } from './.open-next/worker.js';

export { LiveRoom } from './LiveRoom';

export default {
  fetch: handler.fetch,
};
