import { IContactsData, IIdData, IInputChangeData, IPaymentInfoData, IProductData, ISuccessfulOrderData } from "../../types/contracts";
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
  'contacts:submit': void;
  'contacts:input-change': IInputChangeData;
  'contacts:error-change': IFormDataWithErrors<IContactsData>;
  // 
  'paymentsInfo:submit': void;
  'paymentsInfo:error-change': IFormDataWithErrors<IPaymentInfoData>;
  'paymentsInfo:input-change': IInputChangeData;
  'order:completed': ISuccessfulOrderData;
  'order:close': void;
}


