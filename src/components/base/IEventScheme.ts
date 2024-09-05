import { IContactsData, IIdData, IOrderData, IPaymentInfoData, IProductData } from "../../types/contracts";

export interface IEventScheme {
  'product:open': IIdData;
  'product:add_to_cart': IProductData;
  'product:remove_from_cart': IIdData;
  'cart:changed': IProductData[];
  'cart:item-deleted': IIdData;
  'cart:completed': IProductData[];
  'catalog:changed': IProductData[];
  'contacts:submit': IContactsData;
  'paymentsInfo:submit': IPaymentInfoData;
  'order:completed': IOrderData;
}
