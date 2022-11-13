import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
} from 'aws-lambda';

export const generatePolicy = (
  { methodArn, authorizationToken }: APIGatewayTokenAuthorizerEvent,
  effect: string,
): APIGatewayAuthorizerResult => ({
  principalId: authorizationToken.split(' ')[1],
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: methodArn,
      },
    ],
  },
});

export const decodeCredentials = ({
  authorizationToken,
}: APIGatewayTokenAuthorizerEvent) => {
  const [, credentials] = authorizationToken.split(' ');
  return Buffer.from(credentials, 'base64').toString('utf-8').split(':');
};
