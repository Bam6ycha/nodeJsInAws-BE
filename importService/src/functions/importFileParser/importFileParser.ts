import { S3, SQS } from 'aws-sdk';
import { middyfy } from '@libs/lambda';
import { S3CreateEvent } from 'aws-lambda';
import { getParams } from 'src/utils';
import csvParser from 'csv-parser';
import { formatJSONResponse } from '@libs/api-gateway';
import { HTTP_STATUS_CODES } from 'src/types/httpStatusCodesEnum';
import { ResponseMessagesEnum } from 'src/types/responseMessagesEnum';
import { env } from 'process';

const importFileParser = async (event: S3CreateEvent) => {
  try {
    const [
      {
        s3: {
          bucket: { name },
          object: { key },
        },
      },
    ] = event.Records;
    const { SQS_QUEUE_URL } = env;
    const s3 = new S3({ region: 'eu-west-1' });
    const sqs = new SQS({ region: 'eu-west-1' });
    const params = getParams(name, key);

    await new Promise((resolve, reject) => {
      const messages = [];
      s3.getObject(params)
        .createReadStream()
        .pipe(
          csvParser({
            mapHeaders: ({ header }) => header.trim().toLowerCase(),
          }),
        )
        .on('error', (error) => {
          reject(error.message);
        })
        .on('data', (chunk) => {
          messages.push(
            sqs
              .sendMessage({
                QueueUrl: SQS_QUEUE_URL,
                MessageBody: JSON.stringify(chunk),
              })
              .promise(),
          );
        })
        .on('end', async () => {
          await Promise.allSettled(messages);
          resolve(messages);
        });
    });

    await s3.deleteObject(params).promise();

    return formatJSONResponse(HTTP_STATUS_CODES.OK, {
      message: ResponseMessagesEnum.FileSuccessfullyParsed,
    });
  } catch (error) {
    return formatJSONResponse(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, {
      error: (error as Error).message,
    });
  }
};

export const main = middyfy(importFileParser);
