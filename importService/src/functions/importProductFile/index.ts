import { handlerPath } from '@libs/handler-resolver';
import { PathToHandlers } from 'src/types/pathToHandlersEnum';
import { env } from 'process';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
  handler: `${handlerPath(__dirname)}/${PathToHandlers.importProductFile}`,
  events: [
    {
      http: {
        method: 'get',
        path: '/import',
        cors: true,
        authorizer: {
          arn: env.AUTHORIZER_ARN,
          identitySource: 'method.request.header.authorization',
          resultTtlInSeconds: 0,
          type: 'token',
        },
      },
    },
  ],
};
