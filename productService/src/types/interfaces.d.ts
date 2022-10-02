export interface ResponseInterface {
  products: Array<ProductInterface>;
}

export interface ProductInterface {
  count: number;
  description: string;
  id: string;
  price: number;
  title: string;
}

export interface StockInterface {
  product_id: string;
  count: number;
}

export interface RequestInterface {
  body: ProductInterface;
}

export type CreteProductResponse = ProductInterface & StockInterface;
