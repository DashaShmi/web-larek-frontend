import { IContactsData, IIdData, IOrderData, IPaymentInfoData, IProductData } from "../../types/contracts";

export interface IEventScheme {
  'product:open': (data: IIdData) => unknown;
  'product:add_to_cart': (data: IProductData) => unknown;
  'product:remove_from_cart': (data: IIdData) => unknown;
  'cart:changed': (data: IProductData[]) => unknown;
  'cart:item-deleted': (data: IIdData) => unknown;
  'cart:completed': (data: IProductData[]) => unknown;
  'catalog:changed': (data: IProductData[]) => unknown;
  'contacts:submit': (data: IContactsData) => unknown;
  'paymentsInfo:submit': (data: IPaymentInfoData) => unknown;
  'order:completed': (data: IOrderData) => unknown;
}