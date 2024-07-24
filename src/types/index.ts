// работа с апи

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface IApi {
  baseUrl: string;
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// данные

export interface IProductData {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}



// _________*********


export interface IBuyer {
  phone: string;
  email: string;
  adress: string;
}

export interface ICardsData {
  cards: IProductData[];
  openCard(card: IProductData): void;
}

export interface ICart {
  addToCart();
  removeFromCart();

}




