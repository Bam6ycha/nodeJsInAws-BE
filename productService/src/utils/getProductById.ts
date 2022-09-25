import { ProductInterface } from 'src/types/interfaces';

export const findProductById = (
  products: Array<ProductInterface>,
  productId: string,
) => products.find(({ id }) => id === productId);
