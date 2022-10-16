import type { AWS } from '@serverless/typescript';

import getProducts from '@functions/getProducts';
import getProductById from '@functions/getProductById';
import populateDataBase from '@functions/populateDataBase';
import createProduct from '@functions/createProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess';
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
      TOPIC_ARN: { Ref: env.SNS_TOPIC },
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['dynamodb:*'],
        Resource: env.DYNAMODB_ARN,
      },
      {
        Effect: 'Allow',
        Action: ['sqs:*'],
        Resource: { 'Fn::GetAtt': ['SQSQueue', 'Arn'] },
      },
      {
        Effect: 'Allow',
        Action: ['sns:*'],
        Resource: { Ref: env.SNS_TOPIC },
      },
    ],
  },
  functions: {
    getProducts,
    getProductById,
    populateDataBase,
    createProduct,
    catalogBatchProcess,
  },
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
      [env.SQSQueue]: {
        Type: 'AWS::SQS::Queue',
        Properties: { QueueName: env.QUEUE_NAME },
      },
      [env.SNS_TOPIC]: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: env.SNS_TOPIC_NAME,
        },
      },
      [env.SNSSubscription]: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: env.email,
          Protocol: 'email',
          TopicArn: { Ref: env.SNS_TOPIC },
          FilterPolicy: { count: [{ numeric: ['>', 10] }] },
        },
      },
      [env.SNSSubscriptionCustomer]: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: env.secondEmail,
          Protocol: 'email',
          TopicArn: { Ref: env.SNS_TOPIC },
          FilterPolicy: { count: [{ numeric: ['<', 10] }] },
        },
      },
    },
    Outputs: {
      SQSQueueInstanceARN: {
        Description: 'SQSQueue instance',
        Value: {
          'Fn::GetAtt': ['SQSQueue', 'Arn'],
        },
        Export: {
          Name: `${env.QUEUE_NAME}ARN`,
        },
      },
      SQSQueueInstanceURL: {
        Description: 'SQSQueue instance',
        Value: {
          Ref: env.SQSQueue,
        },
        Export: {
          Name: `${env.QUEUE_NAME}URL`,
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
