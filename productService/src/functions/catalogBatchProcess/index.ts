import { handlerPath } from '@libs/handler-resolver';
import { env } from 'process';
import { PathToHandlersEnum } from 'src/types/pathToHandlersEnum';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
  handler: `${handlerPath(__dirname)}/${
    PathToHandlersEnum.CATALOG_BATCH_PROCESS
  }`,
  events: [
    {
      sqs: {
        arn: { 'Fn::GetAtt': [`${env.SQSQueue}`, 'Arn'] },
        batchSize: 5,
        maximumBatchingWindow: 30,
      },
    },
  ],
};
