import { IPaymentInfoData } from "../types/contracts";
import { ViewWithForm } from "./ViewWithForms";

export class PaymentInfoView extends ViewWithForm<IPaymentInfoData> {
  protected override onInputChange(name: string, value: string): void {
    throw new Error("Method not implemented.");
  }

  protected override onSubmit(formData: Record<string, string>): void {
    this.events.emit('paymentsInfo:submit', formData as any);
  }

  override render(data: IPaymentInfoData): HTMLElement {
    return this.element;
  }
}