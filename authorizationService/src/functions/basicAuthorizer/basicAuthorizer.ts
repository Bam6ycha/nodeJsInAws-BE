import { APIGatewayTokenAuthorizerEvent } from 'aws-lambda';
import { env } from 'process';
import { decodeCredentials, generatePolicy } from 'src/utils';

const basicAuthorizer = async (
  event: APIGatewayTokenAuthorizerEvent,
  _,
  callback,
) => {
  console.log('Event:', event);

  if (event['type'] !== 'TOKEN') {
    callback('Unauthorized');
  }
  try {
    const [userName, password] = decodeCredentials(event);
    console.log(`userName:${userName}`, `password:${password}`);

    const isCorrectPassword = env[userName] === password;
    const effect = isCorrectPassword ? 'Allow' : 'Deny';

    const policy = generatePolicy(event, effect);

    callback(null, policy);
  } catch (error) {
    callback(`Unauthorized:${(error as Error).message}`);
  }
};

export const main = basicAuthorizer;
