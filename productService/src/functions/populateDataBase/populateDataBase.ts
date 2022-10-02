import { DynamoDB } from 'aws-sdk';
import productsStub from '../../productsDataStub/products.stub.json';
import { v4 as uuidv4 } from 'uuid';
import { DATA_BASE_POPULATED_SUCCESSFULLY } from 'src/constants';
import { middyfy } from '@libs/lambda';
import { formatJSONResponse } from '@libs/api-gateway';
import { HTTP_STATUS_CODES } from 'src/types/statusCodeEnum';

const { products } = productsStub;
const { PRODUCTS_TABLE_NAME, STOCKS_TABLE_NAME } = process.env;

const dynamoDB = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const getPopulationData = products.reduce((previous, { count, ...rest }) => {
  const uuid = uuidv4();

  return previous.concat(
    dynamoDB
      .put({
        TableName: PRODUCTS_TABLE_NAME,
        Item: { ...rest, id: uuid },
      })
      .promise(),
    dynamoDB
      .put({
        TableName: STOCKS_TABLE_NAME,
        Item: { product_id: uuid, count },
      })
      .promise(),
  );
}, []);

const populateDataBase = async (event) => {
  try {
    console.log(`Request URL :${event.path}`);
    console.log(`Arguments: ${event.requestContext}`);

    await Promise.all(getPopulationData);
    console.log(PRODUCTS_TABLE_NAME, STOCKS_TABLE_NAME);
    return formatJSONResponse(HTTP_STATUS_CODES.OK, {
      message: DATA_BASE_POPULATED_SUCCESSFULLY,
    });
  } catch (error) {
    return formatJSONResponse(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, {
      error: (error as Error).message,
    });
  }
};

export const main = middyfy(populateDataBase);
