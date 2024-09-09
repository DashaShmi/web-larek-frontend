import { IContactsData } from "../../types/contracts";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { IFormDataWithErrors } from "../../types/contracts";
import { ViewWithForm } from "../base/ViewWithForms";

export class ContactsView extends ViewWithForm<IFormDataWithErrors<IContactsData>> {

  private readonly formErrors: HTMLElement;
  private readonly inputEmail: HTMLInputElement;
  private readonly inputPhone: HTMLInputElement;

  constructor(element: HTMLElement, events: IEvents) {
    super(element, events);
    this.formErrors = ensureElement<HTMLElement>(".form__errors", this.element);
    this.inputEmail = ensureElement<HTMLInputElement>('input[name="email"]', this.element);
    this.inputPhone = ensureElement<HTMLInputElement>('input[name="phone"]', this.element);
  }

  protected override onInputChange(name: string, value: string): void {
    this.events.emit('contacts:input-change', {
      name: name,
      value: value
    })
  }

  protected override onSubmit(): void {
    this.events.emit(`contacts:submit`);
  }

  override render(data: IFormDataWithErrors<IContactsData>): HTMLElement {
    this.formErrors.textContent = Object.values(data.errors).filter(x => x.trim().length > 0).join('; ');
    this.submitButton.disabled = !data.isValid;
    this.inputEmail.value = data.value.email;
    this.inputPhone.value = data.value.phone;
    return this.element;
  }
}