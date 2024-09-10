// работа с апи
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

export interface ICartModel {
  readonly products: IProductData[];
  readonly total: number;
  add(data: IProductData): void;
  delete(productId: string): void;
  contains(productId: string): boolean;
  reset(): void;
}

export interface ICatalogModel {
  products: IProductData[];
}

export interface IModalData {
  content: HTMLElement;
}

export interface ICartData {
  elements: HTMLElement[];
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

export interface ISuccessfulOrderData {
  total: number
}

export interface IPageData {
  count: number;
  isLocked: boolean;
}

export interface ICatalogData {
  elements: HTMLElement[];
}

export interface IFormDataWithErrors<T> {
  value: T;
  errors: FormErrors<T>;
  isValid: boolean;
}

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export interface IAppEventScheme {
  // product
  'product:open': IIdData;
  'product:add_to_cart': IProductData;
  'product:remove_from_cart': IIdData;
  // cart
  'cart:changed': void;
  'cart:item-deleted': IIdData;
  'cart:completed': void;
  'cart:open': void;
  // catalog
  'catalog:changed': IProductData[];
  // contacts
  'contacts:submit': void;
  'contacts:input-change': IInputChangeData;
  'contacts:error-change': IFormDataWithErrors<IContactsData>;
  // paymentsInfo
  'paymentsInfo:submit': void;
  'paymentsInfo:input-change': IInputChangeData;
  'paymentsInfo:error-change': IFormDataWithErrors<IPaymentInfoData>;
  // order
  'order:completed': ISuccessfulOrderData;
  'order:close': void;
  //modal
  'modal:open': void;
  'modal:close': void;
}

export interface IListResponse<T> {
  total: number;
  items: T[];
}

export interface IOrderResponse {
  id: string;
  total: number;
}

