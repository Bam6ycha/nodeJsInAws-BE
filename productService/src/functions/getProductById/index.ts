import { handlerPath } from '@libs/handler-resolver';
import { PathToHandlersEnum } from 'src/types/pathToHandlersEnum';
import getProductByIdResponseData from './responseData';

export default {
  handler: `${handlerPath(__dirname)}/${PathToHandlersEnum.GET_PRODUCT_BY_ID}`,
  events: [
    {
      http: {
        path: 'products/{productId}',
        method: 'get',
        cors: true,
        responseData: getProductByIdResponseData,
      },
    },
  ],
};
