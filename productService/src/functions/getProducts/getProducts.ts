import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { DynamoDB } from 'aws-sdk';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { CANNOT_GET_PRODUCTS, PRODUCTS, STOCKS } from 'src/constants';
import { HTTP_STATUS_CODES } from 'src/types/statusCodeEnum';
import { createProductWithCount } from 'src/utils';
import { ProductInterface, StockInterface } from 'src/types/interfaces';

const dynamoDB = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const getProducts: ValidatedEventAPIGatewayProxyEvent<
  Record<string, unknown>
> = async (event) => {
  try {
    console.log(`Request URL :${event.path}`);
    console.log(`Arguments: ${event.requestContext}`);

    const [{ Items: productsFromDB }, { Items: stocks }] = await Promise.all([
      dynamoDB.scan({ TableName: PRODUCTS }).promise(),
      dynamoDB.scan({ TableName: STOCKS }).promise(),
    ]);

    const products = createProductWithCount(
      productsFromDB as Array<Omit<ProductInterface, 'count'>>,
      stocks as Array<StockInterface>,
    );

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
