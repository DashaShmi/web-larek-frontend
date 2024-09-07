import { IContactsData } from "../types/contracts";
import { FormErrors, IFormDataWithErrors } from "./FormErrors";
import { ModelBase } from "./ModelBase";

export class ContactsModel extends ModelBase {

  public data: IFormDataWithErrors<IContactsData> = {
    value: {
      email: "",
      phone: "",
    },
    errors: {},
  };


  setField(name: string, value: string): void {

    if (name !== 'email' && name !== 'phone') {
      console.error(`Неизвестное имя поля: ${name}`)
      return;
    }
    this.data.value[name] = value;
    this.validateOrder()
  }

  validateOrder(): boolean {
    const errors: FormErrors<IContactsData> = {};

    if (this.data.value.email.length === 0) {
      errors.email = 'Необходимо указать email';
    } else if (!this.data.value.email.includes('@')) {
      errors.email = 'Вы не указали @';
    }

    if (this.data.value.phone.length === 0) {
      errors.phone = 'Необходимо указать телефон';
    }

    this.data.errors = errors;
    this.events.emit('contacts:error-change', this.data);
    return Object.keys(errors).length === 0;
  }
}