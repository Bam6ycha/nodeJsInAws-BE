import { S3 } from 'aws-sdk';
import { middyfy } from '@libs/lambda';
import { S3CreateEvent } from 'aws-lambda';
import { createKeyForParsedFile, getParams } from 'src/utils';
import csvParser from 'csv-parser';
import { formatJSONResponse } from '@libs/api-gateway';
import { HTTP_STATUS_CODES } from 'src/types/httpStatusCodesEnum';
import { ResponseMessagesEnum } from 'src/types/responseMessagesEnum';

const parser = csvParser();
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
    const s3 = new S3({ region: 'eu-west-1' });
    const params = getParams(name, key);

    const readObjectFromS3 = new Promise((resolve, reject) => {
      const parsedObjects = [];
      s3.getObject(params)
        .createReadStream()
        .pipe(parser)
        .on('error', (error) => {
          reject(error.message);
        })
        .on('data', (chunk) => {
          console.log(chunk);
          parsedObjects.push(chunk);
        })
        .on('end', async () => {
          resolve(parsedObjects);
        });
    });

    const parsedObjects = await readObjectFromS3;
    await s3
      .putObject({
        Bucket: name,
        Key: createKeyForParsedFile(key),
        Body: JSON.stringify(parsedObjects),
      })
      .promise();
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
