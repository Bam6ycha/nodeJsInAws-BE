import { ResponseDataInterface } from 'src/types/responseDataInterface';

const getProductsResponseData: ResponseDataInterface = {
  200: {
    description: 'Get products success',
    bodyType: 'ResponseInterface',
  },
  404: {
    description: 'Products not found',
    bodyType: 'message',
  },
};

export default getProductsResponseData;
