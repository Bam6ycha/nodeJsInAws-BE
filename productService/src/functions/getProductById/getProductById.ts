import { response } from '@functions/getProducts/productService';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { INCORRECT_ID_MESSAGE } from 'src/constants';
import { HTTP_STATUS_CODES } from 'src/types/statusCodeEnum';
import { findProductById } from 'src/utils/getProductById';

const getProductById: ValidatedEventAPIGatewayProxyEvent<
  Record<string, unknown>
> = async (event) => {
  try {
    const { productId } = event.pathParameters;
    const { products } = await response();
    const product = findProductById(products, productId);

    if (product) {
      return formatJSONResponse(HTTP_STATUS_CODES.OK, {
        product,
      });
    } else {
      throw new Error(INCORRECT_ID_MESSAGE);
    }
  } catch (error) {
    return formatJSONResponse(HTTP_STATUS_CODES.NOT_FOUND, {
      error: (error as Error).message,
    });
  }
};

export const main = middyfy(getProductById);
