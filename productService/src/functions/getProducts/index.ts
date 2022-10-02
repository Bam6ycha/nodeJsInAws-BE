import { handlerPath } from '@libs/handler-resolver';
import { GET_PRODUCTS, PATH_TO_HANDLERS } from 'src/constants';
import getProductsResponseData from './responseData';

export default {
  handler: `${handlerPath(__dirname)}/${PATH_TO_HANDLERS[GET_PRODUCTS]}`,
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
