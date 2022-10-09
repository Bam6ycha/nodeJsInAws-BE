import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { DynamoDB } from 'aws-sdk';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { HTTP_STATUS_CODES } from 'src/types/statusCodeEnum';
import { ProductInterface, RequestInterface } from 'src/types/interfaces';
import { addUUID, createStock, isValidateRequestBody } from 'src/utils';
import {
  ERROR_MESSAGES,
  PRODUCTS,
  PRODUCT_IS_NOT_VALID,
  STOCKS,
} from 'src/constants';

const dynamoDB = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const createProduct: ValidatedEventAPIGatewayProxyEvent<
  ProductInterface
> = async (event) => {
  try {
    console.log(`Request URL :${event.path}`);
    console.log(`Arguments: ${event.requestContext}`);

    const requestBody = event.body as ProductInterface;
    console.log(event.path);
    if (isValidateRequestBody(requestBody)) {
      const product = addUUID(requestBody);
      const stock = createStock(product);

      await Promise.all([
        dynamoDB
          .put({
            TableName: PRODUCTS,
            Item: product,
          })
          .promise(),
        dynamoDB
          .put({
            TableName: STOCKS,
            Item: stock,
          })
          .promise(),
      ]);

      return formatJSONResponse(HTTP_STATUS_CODES.CREATED, { product, stock });
    } else {
      throw Error(ERROR_MESSAGES[PRODUCT_IS_NOT_VALID]);
    }
  } catch (error) {
    console.log(event);

    return formatJSONResponse(HTTP_STATUS_CODES.BAD_REQUEST, {
      error: (error as Error).message,
    });
  }
};

export const main = middyfy(createProduct);
