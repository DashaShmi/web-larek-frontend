import { IContactsData, IDeleteProductData, IOrderData, IPaymentInfoData, IProductData } from "../../types/contracts";

export interface IEventScheme {
  'product:open': (data: IProductData) => unknown;
  'product:add_to_cart': (data: IProductData) => unknown;
  'cart:changed': (data: IProductData[]) => unknown;
  'cart:item-deleted': (data: IDeleteProductData) => unknown;
  'product:remove_from_cart': (data: IDeleteProductData) => unknown;
  'catalog:changed': (data: IProductData[]) => unknown;
  'cart:completed': (data: IProductData[]) => unknown;
  'contacts:submit': (data: IContactsData) => unknown;
  'paymentsInfo:submit': (data: IPaymentInfoData) => unknown;
}