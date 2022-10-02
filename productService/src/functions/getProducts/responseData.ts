import { ResponseDataInterface } from 'src/types/responseDataInterface';

const getProductsResponseData: ResponseDataInterface = {
  200: {
    description: 'Get products success',
    bodyType: 'CreteProductResponse',
  },
  400: {
    description: 'Bad request',
    bodyType: 'message',
  },
};

export default getProductsResponseData;
