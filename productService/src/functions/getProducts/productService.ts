import products from './products.mock.json';
import { ResponseInterface } from '../../types/interfaces';

export const response = (): Promise<ResponseInterface> =>
  new Promise((resolve, reject) => {
    try {
      setTimeout(() => resolve(products), 2000);
    } catch (error) {
      reject(error.message);
    }
  });
