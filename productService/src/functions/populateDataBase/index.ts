import { handlerPath } from '@libs/handler-resolver';
import { PATH_TO_HANDLERS, POPULATE_DATABASE } from 'src/constants';

export default {
  handler: `${handlerPath(__dirname)}/${PATH_TO_HANDLERS[POPULATE_DATABASE]}`,
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
