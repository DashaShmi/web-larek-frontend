import { IPaymentInfoData } from "../types/contracts";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { IFormDataWithErrors } from "../types/contracts";
import { ViewWithForm } from "./ViewWithForms";

export class PaymentInfoView extends ViewWithForm<IFormDataWithErrors<IPaymentInfoData>> {

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

    this.buttonOnline.addEventListener('click', (event) => {
      this.events.emit('paymentsInfo:input-change', {
        name: 'paymentMethod',
        value: "online"
      })
    })

    this.buttonOffline.addEventListener('click', (event) => {
      this.events.emit('paymentsInfo:input-change', {
        name: 'paymentMethod',
        value: "offline"
      })
    })
  }

  protected override onInputChange(name: string, value: string): void {
    this.events.emit('paymentsInfo:input-change', {
      name: name,
      value: value
    })
  }

  protected override onSubmit(): void {
    this.events.emit('paymentsInfo:submit');
  }

  override render(data: IFormDataWithErrors<IPaymentInfoData>): HTMLElement {
    this.formErrors.textContent = Object.values(data.errors).filter(x => x.trim().length > 0).join('; ');

    this.submitButton.disabled = !data.isValid;

    this.buttonOffline.classList.remove('button_alt-active');
    this.buttonOnline.classList.remove('button_alt-active');

    if (data.value.paymentMethod === "offline") {
      this.buttonOffline.classList.add('button_alt-active');
    }
    else if (data.value.paymentMethod === "online") {
      this.buttonOnline.classList.add('button_alt-active');
    }

    return this.element;

  }
}