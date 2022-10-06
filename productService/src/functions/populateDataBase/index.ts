import { handlerPath } from '@libs/handler-resolver';
import { PathToHandlersEnum } from 'src/types/pathToHandlersEnum';

export default {
  handler: `${handlerPath(__dirname)}/${
    PathToHandlersEnum.POPULATE_DATABASE_PATH
  }`,
  events: [
    {
      http: {
        path: 'populate',
        method: 'get',
        cors: true,
      },
    },
  ],
};
