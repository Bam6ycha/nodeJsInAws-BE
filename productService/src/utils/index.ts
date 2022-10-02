import { ProductInterface, StockInterface } from 'src/types/interfaces';
import { v4 as uuidv4 } from 'uuid';

export const createProductWithCount = (
  products: Array<Omit<ProductInterface, 'count'>>,
  stocks: Array<StockInterface>,
) => {
  const stocksObject = stocks.reduce(
    (previousValue, { count, product_id }) =>
      Object.assign(previousValue, {
        [product_id]: {
          product_id,
          count,
        },
      }),
    {},
  );

  return products.map((product) => {
    return { ...product, count: stocksObject[product.id].count };
  });
};

export const addUUID = (product: ProductInterface) => ({
  ...product,
  id: uuidv4(),
});

export const createStock = ({ id, count }: ProductInterface) => ({
  product_id: id,
  count,
});

export const isValidateRequestBody = ({
  count,
  description,
  price,
  title,
}: ProductInterface) => {
  const isValidPrice = !Number.isNaN(price) && price >= 0;
  const isValidCount = !Number.isNaN(count) && count >= 0;
  const isValidDescription = description.length > 0;
  const isValidTitle = title.length > 0;

  return isValidCount && isValidDescription && isValidPrice && isValidTitle;
};
