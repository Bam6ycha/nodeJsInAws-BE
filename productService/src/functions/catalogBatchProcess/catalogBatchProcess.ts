import { DynamoDB, SNS } from 'aws-sdk';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { HTTP_STATUS_CODES } from 'src/types/statusCodeEnum';
import { SQSEvent, SQSRecord } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { ProductInterface } from 'src/types/interfaces';
import { env } from 'process';

const { PRODUCTS_TABLE_NAME, STOCKS_TABLE_NAME, TOPIC_ARN } = env;

const dynamoDB = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const sns = new SNS({ region: 'eu-west-1' });

const getPopulationData = (products: Array<SQSRecord>) =>
  products.reduce((prev, { body }) => {
    const { count, ...rest } = JSON.parse(body) as unknown as ProductInterface;
    const uuid = uuidv4();

    return prev.concat(
      dynamoDB
        .put({
          TableName: PRODUCTS_TABLE_NAME,
          Item: { ...rest, id: uuid },
        })
        .promise(),

      dynamoDB
        .put({
          TableName: STOCKS_TABLE_NAME,
          Item: { product_id: uuid, count },
        })
        .promise(),

      sns
        .publish({
          TopicArn: TOPIC_ARN,
          Message: body,
          Subject: 'New products was added',
          MessageAttributes: {
            count: {
              DataType: 'Number',
              StringValue: `${
                (JSON.parse(body) as unknown as ProductInterface).count
              }`,
            },
            price: {
              DataType: 'Number',
              StringValue: `${
                (JSON.parse(body) as unknown as ProductInterface).price
              }`,
            },
          },
        })
        .promise(),
    );
  }, []);

const catalogBatchProcess = async (event: SQSEvent) => {
  try {
    const products = event.Records;
    await Promise.allSettled(getPopulationData(products));
  } catch (error) {
    return formatJSONResponse(HTTP_STATUS_CODES.BAD_REQUEST, {
      error: (error as Error).message,
    });
  }
};

export const main = middyfy(catalogBatchProcess);
