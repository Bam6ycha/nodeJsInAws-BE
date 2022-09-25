import { ResponseDataInterface } from 'src/types/responseDataInterface';

const getProductByIdResponseData: ResponseDataInterface = {
  200: {
    description: 'Get product success',
    bodyType: 'ProductInterface',
  },
  404: {
    description: 'Product not found',
    bodyType: 'message',
  },
};

export default getProductByIdResponseData;
