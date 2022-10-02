export const GET_PRODUCTS = 'getProducts';
export const GET_PRODUCT_BY_ID = 'getProductById';
export const INCORRECT_ID_MESSAGE = 'Product with providing ID is not found.';
export const CANNOT_GET_PRODUCTS = 'Can not get products.';
export const POPULATE_DATABASE = 'populateDataBase';
export const CREATE_PRODUCT = 'createProduct';

const GET_PRODUCTS_PATH = 'getProducts.main';
const GET_PRODUCTS_BY_ID_PATH = 'getProductById.main';
const POPULATE_DATABASE_PATH = 'populateDataBase.main';
const CREATE_PRODUCT_PATH = 'createProduct.main';

export const PATH_TO_HANDLERS = {
  [GET_PRODUCTS]: GET_PRODUCTS_PATH,
  [GET_PRODUCT_BY_ID]: GET_PRODUCTS_BY_ID_PATH,
  [POPULATE_DATABASE]: POPULATE_DATABASE_PATH,
  [CREATE_PRODUCT]: CREATE_PRODUCT_PATH,
};

export const DATA_BASE_POPULATED_SUCCESSFULLY =
  'Data base was populated successfully.';
export const DATA_BASE_POPULATION_FAILED = 'Failed to populate.';

export const PRODUCTS = '';
export const STOCKS = '';
export const RESOURCE_NAME_PRODUCTS = '';
export const RESOURCE_NAME_STOCKS = '';

export const PRODUCT_IS_NOT_VALID = 'Is not valid';
const IS_NOT_VALID = 'Product is not valid';

export const ERROR_MESSAGES = {
  [PRODUCT_IS_NOT_VALID]: IS_NOT_VALID,
};
