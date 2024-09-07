import { IPaymentInfoData } from "../types/contracts";
import { ModelBase } from "./ModelBase";

export type PaymentInfoFormErrors = Partial<Record<keyof IPaymentInfoData, string>>;

export class PaymentInfoModel extends ModelBase {

  private data: IPaymentInfoData = {
    paymentMethod: "online",
    adress: "",
    errors: {},
  }

}