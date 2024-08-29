import { IPaymentInfoData } from "../types/contracts";
import { ViewWithForm } from "./ViewWithForms";

export class PaymentInfoView extends ViewWithForm<IPaymentInfoData> {
  override render(data: IPaymentInfoData): HTMLElement {
    return this.element;
  }
}