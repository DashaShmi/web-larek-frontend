import { IContactsData } from "../types/contracts";
import { ViewWithForm } from "./ViewWithForms";

export class ContactsView extends ViewWithForm<IContactsData> {
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
    return this.element;
  }
}