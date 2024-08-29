import { IContactsData } from "../types/contracts";
import { ViewWithForm } from "./ViewWithForms";

export class ContactsView extends ViewWithForm<IContactsData> {
  override render(data: IContactsData): HTMLElement {
    return this.element;
  }
}