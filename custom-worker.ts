// @ts-ignore
import { default as handler } from './.open-next/worker.js';

export default {
  fetch: handler.fetch,
};
