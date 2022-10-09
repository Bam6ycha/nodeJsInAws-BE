import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { DynamoDB } from 'aws-sdk';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { INCORRECT_ID_MESSAGE, PRODUCTS, STOCKS } from 'src/constants';
import { HTTP_STATUS_CODES } from 'src/types/statusCodeEnum';

const dynamoDB = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const getProductById: ValidatedEventAPIGatewayProxyEvent<
  Record<string, unknown>
> = async (event) => {
  try {
    console.log(`Request URL :${event.path}`);
    console.log(`Arguments: ${event.requestContext}`);

    const { productId } = event.pathParameters;
    const [{ Item: product }, { Item: stock }] = await Promise.all([
      dynamoDB
        .get({
          TableName: PRODUCTS,
          Key: {
            id: productId,
          },
        })
        .promise(),
      dynamoDB
        .get({
          TableName: STOCKS,
          Key: {
            product_id: productId,
          },
        })
        .promise(),
    ]);

    if (product && stock) {
      return formatJSONResponse(HTTP_STATUS_CODES.OK, {
        ...product,
        count: stock.count,
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
