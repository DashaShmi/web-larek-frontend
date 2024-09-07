import { IContactsData, IIdData, IInputChangeData, IOrderData, IPaymentInfoData, IProductData } from "../../types/contracts";
import { IFormDataWithErrors } from "../FormErrors";



export interface IEventScheme {
  'product:open': IIdData;
  'product:add_to_cart': IProductData;
  'product:remove_from_cart': IIdData;
  // cart
  'cart:changed': IProductData[];
  'cart:item-deleted': IIdData;
  'cart:completed': IProductData[];
  // catalog
  'catalog:changed': IProductData[];
  // contacts
  'contacts:submit': IContactsData;
  'contacts:input-change': IInputChangeData;
  'contacts:error-change': IFormDataWithErrors<IContactsData>;
  // 
  'paymentsInfo:submit': IPaymentInfoData;
  'paymentsInfo:error-change': IFormDataWithErrors<IPaymentInfoData>;
  'paymentsInfo:input-change': IInputChangeData;
  'order:completed': IOrderData;
}


