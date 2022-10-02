import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { DynamoDB } from 'aws-sdk';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { CANNOT_GET_PRODUCTS } from 'src/constants';
import { HTTP_STATUS_CODES } from 'src/types/statusCodeEnum';
import { createProductWithCount } from 'src/utils';
import { ProductInterface, StockInterface } from 'src/types/interfaces';
import { env } from 'process';

const dynamoDB = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const getProducts: ValidatedEventAPIGatewayProxyEvent<
  Record<string, unknown>
> = async (event) => {
  console.log(`Request URL :${event.path}`);
  console.log(`Arguments: ${event.requestContext}`);
  const { PRODUCTS_TABLE_NAME, STOCKS_TABLE_NAME } = env;
  try {
    const [{ Items: productsFromDB }, { Items: stocks }] = await Promise.all([
      dynamoDB.scan({ TableName: PRODUCTS_TABLE_NAME }).promise(),
      dynamoDB.scan({ TableName: STOCKS_TABLE_NAME }).promise(),
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
