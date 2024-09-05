import { IContactsData, IOrderData } from "../types/contracts";
import { ModelBase } from "./ModelBase";


const propertyName: keyof IOrderData = 'products';

export type ContactFormErrors = Partial<Record<keyof IContactsData, string>>;

export class ContactsModal extends ModelBase {

  formErrors: ContactFormErrors = {};
  private data: IContactsData = {
    email: "",
    telephone: ""
  }

  setField(name: string, value: string): void {

    if (name !== 'email' && name !== 'telephone') {
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

    if (this.data.telephone.length === 0) {
      errors.telephone = 'Необходимо указать телефон';
    }

    this.formErrors = errors;
    this.events.emit('contacts:error-change', this.formErrors);
    return Object.keys(errors).length === 0;
  }
}