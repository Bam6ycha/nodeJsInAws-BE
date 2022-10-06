import type { AWS } from '@serverless/typescript';

import getProducts from '@functions/getProducts';
import getProductById from '@functions/getProductById';
import populateDataBase from '@functions/populateDataBase';
import createProduct from '@functions/createProduct';
import esBuildConfig from './esBuild.config';
import swaggerConfig from './swagger.config';
import * as dotenv from 'dotenv';
import { env } from 'process';

dotenv.config();

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
      PRODUCTS_TABLE_NAME: env.PRODUCTS_TABLE_NAME,
      STOCKS_TABLE_NAME: env.STOCKS_TABLE_NAME,
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem',
        ],
        Resource: env.DYNAMODB_ARN,
      },
    ],
  },
  functions: { getProducts, getProductById, populateDataBase, createProduct },
  package: { individually: true },
  custom: {
    esbuild: esBuildConfig,
    autoswagger: swaggerConfig,
  },
  resources: {
    Resources: {
      [env.PRODUCTS]: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: env.PRODUCTS_TABLE_NAME,
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
      [env.STOCKS]: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: env.STOCKS_TABLE_NAME,
          AttributeDefinitions: [
            {
              AttributeName: 'product_id',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'product_id',
              KeyType: 'HASH',
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
