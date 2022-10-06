import { handlerPath } from '@libs/handler-resolver';
import { env } from 'process';
import { PathToHandlers } from 'src/types/pathToHandlersEnum';
import { PathToUpload } from 'src/types/uploadedPathsEnum';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
  handler: `${handlerPath(__dirname)}/${PathToHandlers.importFileParser}`,
  events: [
    {
      s3: {
        bucket: env.BUCKET,
        event: 's3:ObjectCreated:*',
        existing: true,
        rules: [{ prefix: `${PathToUpload.uploadedFolder}/` }],
      },
    },
  ],
};
