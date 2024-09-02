import { IContactsData, IOrderModel, IPaymentInfoData } from "../types/contracts";
import { ModelBase } from "./ModelBase";

export class OrderModel extends ModelBase implements IOrderModel {
  contacts: IContactsData = {
    email: "",
    telephone: ""
  }

  paymentInfo: IPaymentInfoData = {
    paymentMethod: "online",
    adress: ""
  }
}