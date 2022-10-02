import { ResponseDataInterface } from 'src/types/responseDataInterface';

export const createProductsResponseData: ResponseDataInterface = {
  201: {
    description: 'Product was created',
    bodyType: 'CreteProductResponse',
  },
  404: {
    description: 'Products not found',
    bodyType: 'message',
  },
};
