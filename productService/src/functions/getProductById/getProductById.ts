import { response } from '@functions/getProducts/productService';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { INCORRECT_ID_MESSAGE } from 'src/constants';
import { findProductById } from 'src/utils/getProductById';

const getProductById: ValidatedEventAPIGatewayProxyEvent<
  Record<string, unknown>
> = async (event) => {
  try {
    const { productId } = event.pathParameters;
    const { products } = await response();
    const product =
      findProductById(products, productId) ?? INCORRECT_ID_MESSAGE;

    return formatJSONResponse({
      product,
    });
  } catch (error) {
    return {
      statusCode: 404,
      body: 'Product not found',
    };
  }
};

export const main = middyfy(getProductById);
