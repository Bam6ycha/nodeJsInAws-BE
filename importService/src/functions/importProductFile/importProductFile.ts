import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { S3 } from 'aws-sdk';
import { middyfy } from '@libs/lambda';
import { formatJSONResponse } from '@libs/api-gateway';
import { env } from 'process';
import { ExpiresEnum } from 'src/types/expiresEnum';
import { HTTP_STATUS_CODES } from 'src/types/httpStatusCodesEnum';
import { ResponseMessagesEnum } from 'src/types/responseMessagesEnum';
import { getParams } from 'src/utils';
import { PathToUpload } from 'src/types/uploadedPathsEnum';

const { BUCKET_NAME } = env;
const contentType = 'text/csv';

const importProductFile: ValidatedEventAPIGatewayProxyEvent<
  Record<string, string>
> = async (event) => {
  console.log(`Event : ${JSON.stringify(event)}`);
  try {
    const {
      queryStringParameters: { name: fileName },
    } = event;

    if (fileName) {
      const s3 = new S3({ region: 'eu-west-1' });
      const key = `${PathToUpload.uploadedFolder}/${fileName}`;
      const params = getParams(
        BUCKET_NAME,
        key,
        ExpiresEnum.importProductFileExpirationTime,
        contentType,
      );
      const signedUrl = await s3.getSignedUrlPromise('putObject', params);

      return formatJSONResponse(HTTP_STATUS_CODES.OK, { signedUrl });
    }

    throw Error(ResponseMessagesEnum.fileNameParameterIsNotProvided);
  } catch (error) {
    return formatJSONResponse(HTTP_STATUS_CODES.BAD_REQUEST, {
      error: (error as Error).message,
    });
  }
};

export const main = middyfy(importProductFile);
