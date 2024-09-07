import { IPaymentInfoData } from "../types/contracts";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { ViewWithForm } from "./ViewWithForms";

export class PaymentInfoView extends ViewWithForm<IPaymentInfoData> {

  private readonly buttonOnline: HTMLButtonElement;
  private readonly buttonOffline: HTMLButtonElement;
  private readonly inputAdress: HTMLInputElement;
  private readonly formErrors: HTMLElement;

  constructor(element: HTMLElement, events: IEvents) {
    super(element, events);
    this.buttonOnline = ensureElement<HTMLButtonElement>('button[name="card"]', this.element);
    this.buttonOffline = ensureElement<HTMLButtonElement>('button[name="cash"]', this.element);
    this.inputAdress = ensureElement<HTMLInputElement>('input[name="address"]', this.element);
    this.formErrors = ensureElement<HTMLElement>(".form__errors", this.element);
  }


  protected override onInputChange(name: string, value: string): void {
    this.events.emit('paymentsInfo:input-change', {
      name: name,
      value: value
    })
  }

  protected override onSubmit(formData: Record<string, string>): void {
    this.events.emit('paymentsInfo:submit', formData as any);
  }

  override render(data: IPaymentInfoData): HTMLElement {
    this.formErrors.textContent = Object.values(data.errors).filter(x => x.trim().length > 0).join('; ');

    const isValid = Object.keys(data.errors).length === 0;
    this.submitButton.disabled = !isValid;

    return this.element;

  }
}