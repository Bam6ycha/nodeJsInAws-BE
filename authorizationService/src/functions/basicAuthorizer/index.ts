import { handlerPath } from '@libs/handler-resolver';
import { PathToHandlersEnum } from 'src/types/pathToHandlersEnum';

export default {
  handler: `${handlerPath(__dirname)}/${PathToHandlersEnum.BASIC_AUTHORIZER}`,
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
