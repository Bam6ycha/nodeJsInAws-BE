import type { AWS } from '@serverless/typescript';

import basicAuthorizer from '@functions/basicAuthorizer';
import esBuildConfig from './esBuild.config';

import * as dotenv from 'dotenv';

dotenv.config();

const serverlessConfiguration: AWS = {
  service: 'authorizationservice',
  frameworkVersion: '3',
  plugins: ['serverless-dotenv-plugin', 'serverless-esbuild'],
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
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },

  functions: { basicAuthorizer },
  package: { individually: true },
  custom: {
    esbuild: esBuildConfig,
  },
};

module.exports = serverlessConfiguration;
