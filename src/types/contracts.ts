// работа с апи
import { IListResponse } from "../components/base/api"
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH';


export interface IApi {
  baseUrl: string;
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IApiOrderData {
  payment: "online" | "offline";
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export interface IAppApi {
  getProductList(): Promise<IListResponse<IProductData>>;
  getProduct(id: string): Promise<IProductData>;
  sendOrder(data: IApiOrderData): Promise<void>;
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

export interface IProductDetailViewData extends IProductData {
  inCart: boolean;
}

export interface IContactsData {
  email: string;
  telephone: string;
}

export interface IPaymentInfoData {
  paymentMethod: "online" | "offline";
  adress: string;
}

export interface IOrderData {
  readonly total: number;
  contacts: IContactsData;
  products: IProductData[];
  paymentInfo: IPaymentInfoData;
}

export interface ICartModel {
  products: IProductData[];
  add(data: IProductData): void;
  delete(productId: string): void;
  total: number;
  contains(productId: string): boolean;
}

export interface ICatalogModel {
  products: IProductData[];
}

export interface IOrderModel {
  contacts: IContactsData;
  paymentInfo: IPaymentInfoData;
}

export interface IModalData {
  content: HTMLElement;
}

export interface ICartData {
  products: IProductData[];
  total: number;
}

export interface IDeleteProductData {
  id: string;
}



