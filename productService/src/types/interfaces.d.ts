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
