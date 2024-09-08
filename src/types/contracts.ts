// работа с апи
import { IListResponse, IOrderResponse } from "../components/base/api"
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH';


export interface IApi {
  baseUrl: string;
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IApiOrderData {
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export interface IAppApi {
  getProductList(): Promise<IListResponse<IProductData>>;
  getProduct(id: string): Promise<IProductData>;
  sendOrder(data: IApiOrderData): Promise<IOrderResponse>;
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
  phone: string;
}
export type PaymentMethod = "" | "online" | "offline";

export interface IPaymentInfoData {
  paymentMethod: PaymentMethod
  address: string;
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

export interface IIdData {
  id: string;
}

export interface ICartItemData {
  id: string;
  title: string;
  price: number | null;
  index: string;
}

export interface IInputChangeData {
  name: string;
  value: string;
}



