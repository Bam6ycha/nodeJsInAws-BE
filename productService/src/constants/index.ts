export const GET_PRODUCTS = 'getProducts';
export const GET_PRODUCT_BY_ID = 'getProductById';
export const INCORRECT_ID_MESSAGE = 'Product with providing ID is not found.';
const GET_PRODUCTS_PATH = 'getProducts.main';
const GET_PRODUCTS_BY_ID_PATH = 'getProductById.main';

export const PATH_TO_HANDLERS = {
  [GET_PRODUCTS]: GET_PRODUCTS_PATH,
  [GET_PRODUCT_BY_ID]: GET_PRODUCTS_BY_ID_PATH,
};
