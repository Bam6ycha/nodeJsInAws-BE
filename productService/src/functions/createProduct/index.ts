import { handlerPath } from '@libs/handler-resolver';
import { PathToHandlersEnum } from 'src/types/pathToHandlersEnum';
import { createProductsResponseData } from './responseData';

export default {
  handler: `${handlerPath(__dirname)}/${PathToHandlersEnum.CREATE_PRODUCT}`,
  events: [
    {
      http: {
        path: 'products',
        method: 'post',
        cors: true,
        responseData: createProductsResponseData,
      },
    },
  ],
};
