import type { AWS } from '@serverless/typescript';

import getProducts from '@functions/getProducts';
import getProductById from '@functions/getProductById';
import esBuildConfig from './esBuild.config';
import swaggerConfig from './swagger.config';

const serverlessConfiguration: AWS = {
  service: 'myservice',
  frameworkVersion: '3',
  plugins: ['serverless-auto-swagger', 'serverless-esbuild'],
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
  functions: { getProducts, getProductById },
  package: { individually: true },
  custom: {
    esbuild: esBuildConfig,
    autoswagger: swaggerConfig,
  },
};

module.exports = serverlessConfiguration;
