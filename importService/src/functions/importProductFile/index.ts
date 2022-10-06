import { handlerPath } from '@libs/handler-resolver';
import { PathToHandlers } from 'src/types/pathToHandlersEnum';

export default {
  handler: `${handlerPath(__dirname)}/${PathToHandlers.importProductFile}`,
  events: [
    {
      http: {
        method: 'get',
        path: '/import',
        cors: true,
      },
    },
  ],
};
