import { handlerPath } from '@libs/handler-resolver';
import { GET_PRODUCT_BY_ID, PATH_TO_HANDLERS } from 'src/constants';
import getProductByIdResponseData from './responseData';

export default {
  handler: `${handlerPath(__dirname)}/${PATH_TO_HANDLERS[GET_PRODUCT_BY_ID]}`,
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
