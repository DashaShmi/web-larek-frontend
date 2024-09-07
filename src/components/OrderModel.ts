import { IContactsData, IOrderModel, IPaymentInfoData } from "../types/contracts";
import { ModelBase } from "./ModelBase";

export class OrderModel extends ModelBase implements IOrderModel {
  contacts: IContactsData = {
    email: "",
    phone: "",
    errors: {},
  }

  paymentInfo: IPaymentInfoData = {
    paymentMethod: "online",
    adress: ""
  }
}