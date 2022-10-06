import type { AWS } from '@serverless/typescript';
import * as dotenv from 'dotenv';
import { env } from 'process';

import esBuildConfig from './esBuild.config';
import importProductFile from '@functions/importProductFile';
import importFileParser from '@functions/importFileParser';

dotenv.config();

const serverlessConfiguration: AWS = {
  service: 'importservice',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      BUCKET_NAME: env.BUCKET,
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['s3:*'],
        Resource: env.BUCKET_ARN,
      },
      {
        Effect: 'Allow',
        Action: ['s3:*'],
        Resource: `${env.BUCKET_ARN}/*`,
      },
    ],
  },
  functions: { importProductFile, importFileParser },
  package: { individually: true },
  custom: {
    esbuild: esBuildConfig,
  },
};

module.exports = serverlessConfiguration;
