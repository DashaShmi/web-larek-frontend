import { IContactsData, IOrderData } from "../types/contracts";
import { ModelBase } from "./ModelBase";


export type ContactFormErrors = Partial<Record<keyof IContactsData, string>>;

export class ContactsModal extends ModelBase {

  private data: IContactsData = {
    email: "",
    phone: "",
    errors: {}
  }

  setField(name: string, value: string): void {

    if (name !== 'email' && name !== 'phone') {
      console.error(`Неизвестное имя поля: ${name}`)
      return;
    }
    this.data[name] = value;
    this.validateOrder()
  }

  validateOrder(): boolean {
    const errors: ContactFormErrors = {};

    if (this.data.email.length === 0) {
      errors.email = 'Необходимо указать email';
    } else if (!this.data.email.includes('@')) {
      errors.email = 'Вы не указали @';
    }

    if (this.data.phone.length === 0) {
      errors.phone = 'Необходимо указать телефон';
    }

    this.data.errors = errors;
    this.events.emit('contacts:error-change', this.data);
    return Object.keys(errors).length === 0;
  }
}