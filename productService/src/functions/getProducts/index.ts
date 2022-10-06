import { handlerPath } from '@libs/handler-resolver';
import { PathToHandlersEnum } from 'src/types/pathToHandlersEnum';
import getProductsResponseData from './responseData';

export default {
  handler: `${handlerPath(__dirname)}/${PathToHandlersEnum.GET_PRODUCTS}`,
  events: [
    {
      http: {
        path: 'products',
        method: 'get',
        cors: true,
        responseData: getProductsResponseData,
      },
    },
  ],
};
