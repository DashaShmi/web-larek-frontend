import { IAppEventScheme, IContactsData } from "../../types/contracts";
import { IEvents } from "../base/events";
import { FormErrors } from "../../types/contracts";
import { FormModel } from "../base/FormModel";

export class ContactsModel extends FormModel<IContactsData, IAppEventScheme> {

  constructor(events: IEvents<IAppEventScheme>) {
    super(events, {
      email: "",
      phone: ""
    });
  }

  setField(name: string, value: string): void {
    if (name !== 'email' && name !== 'phone') {
      console.error(`Неизвестное имя поля: ${name}`)
      return;
    }
    this.data.value[name] = value;
    this.validateOrder();
  }

  protected validateOrder(): void {
    const errors: FormErrors<IContactsData> = {};

    if (this.data.value.email.length === 0) {
      errors.email = 'Необходимо указать email';
    } else if (!this.data.value.email.includes('@')) {
      errors.email = 'Вы не указали @';
    }

    if (this.data.value.phone.length === 0) {
      errors.phone = 'Необходимо указать телефон';
    }

    this._data.errors = errors;
    this._data.isValid = Object.keys(errors).length === 0;
    this.events.emit('contacts:error-change', this.data);
  }
}