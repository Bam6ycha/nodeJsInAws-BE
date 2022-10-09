import type { AWS } from '@serverless/typescript';

import getProducts from '@functions/getProducts';
import getProductById from '@functions/getProductById';
import populateDataBase from '@functions/populateDataBase';
import createProduct from '@functions/createProduct';
import esBuildConfig from './esBuild.config';
import swaggerConfig from './swagger.config';
import {
  PRODUCTS,
  RESOURCE_NAME_PRODUCTS,
  RESOURCE_NAME_STOCKS,
  STOCKS,
} from 'src/constants';

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
      PRODUCTS_TABLE_NAME: PRODUCTS,
      STOCKS_TABLE_NAME: STOCKS,
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
        Resource: 'arn:aws:dynamodb:eu-west-1:506108326925:table/*',
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
      [RESOURCE_NAME_PRODUCTS]: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: PRODUCTS,
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
      [RESOURCE_NAME_STOCKS]: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: STOCKS,
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
