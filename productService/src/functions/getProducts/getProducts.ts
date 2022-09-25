import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { response } from './productService';

const getProducts: ValidatedEventAPIGatewayProxyEvent<
  Record<string, unknown>
> = async () => {
  try {
    const { products } = await response();
    return formatJSONResponse({
      products,
    });
  } catch (error) {
    return {
      statusCode: 404,
      body: 'Products not found',
    };
  }
};

export const main = middyfy(getProducts);
