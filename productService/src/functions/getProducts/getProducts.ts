import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { CANNOT_GET_PRODUCTS } from 'src/constants';
import { HTTP_STATUS_CODES } from 'src/types/statusCodeEnum';
import { response } from './productService';

const getProducts: ValidatedEventAPIGatewayProxyEvent<
  Record<string, unknown>
> = async () => {
  try {
    const { products } = await response();

    if (products) {
      return formatJSONResponse(HTTP_STATUS_CODES.OK, {
        products,
      });
    } else {
      throw new Error(CANNOT_GET_PRODUCTS);
    }
  } catch (error) {
    formatJSONResponse(HTTP_STATUS_CODES.NOT_FOUND, {
      error: (error as Error).message,
    });
  }
};

export const main = middyfy(getProducts);
