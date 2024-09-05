import { IContactsData, IIdData, IInputChangeData, IOrderData, IPaymentInfoData, IProductData } from "../../types/contracts";
import { ContactFormErrors } from "../ContactsModal";



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
  'contacts:error-change': ContactFormErrors;
  // 
  'paymentsInfo:submit': IPaymentInfoData;
  'order:completed': IOrderData;
}


