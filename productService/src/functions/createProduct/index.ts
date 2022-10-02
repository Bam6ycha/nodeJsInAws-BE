import { handlerPath } from '@libs/handler-resolver';
import { CREATE_PRODUCT, PATH_TO_HANDLERS } from 'src/constants';
import { createProductsResponseData } from './responseData';

export default {
  handler: `${handlerPath(__dirname)}/${PATH_TO_HANDLERS[CREATE_PRODUCT]}`,
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
