import { IContactsData } from "../types/contracts";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { ViewWithForm } from "./ViewWithForms";

export class ContactsView extends ViewWithForm<IContactsData> {

  private readonly formErrors: HTMLElement;

  constructor(element: HTMLElement, events: IEvents) {
    super(element, events);
    this.formErrors = ensureElement<HTMLElement>(".form__errors", this.element);
  }

  protected override onInputChange(name: string, value: string): void {
    this.events.emit('contacts:input-change', {
      name: name,
      value: value
    })
  }

  protected override onSubmit(formData: Record<string, string>): void {
    this.events.emit(`contacts:submit`, formData as any);
  }

  override render(data: IContactsData): HTMLElement {
    this.formErrors.textContent = Object.values(data.errors).filter(x => x.trim().length > 0).join('; ');

    const isValid = Object.keys(data.errors).length === 0;
    console.log(this.submitButton);
    this.submitButton.disabled = !isValid;
    return this.element;
  }
}