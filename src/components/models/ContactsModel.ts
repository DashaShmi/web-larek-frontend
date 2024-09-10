import { IAppEventScheme, IContactsData } from "../../types/contracts";
import { IEvents } from "../base/events";
import { DataErrors } from "../../types/contracts";
import { ModelWithValidation } from "../base/ModelWithValidation";

export class ContactsModel extends ModelWithValidation<IContactsData, IAppEventScheme> {
  private readonly phoneRegEx = /^((8|\+374|\+994|\+995|\+375|\+7|\+380|\+38|\+996|\+998|\+993)[\- ]?)?\(?\d{3,5}\)?[\- ]?\d{1}[\- ]?\d{1}[\- ]?\d{1}[\- ]?\d{1}[\- ]?\d{1}(([\- ]?\d{1})?[\- ]?\d{1})?$/

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
    this.validate();
  }

  protected validate(): void {
    const errors: DataErrors<IContactsData> = {};

    if (this.data.value.email.length === 0) {
      errors.email = 'Необходимо указать email';
    } else if (!this.data.value.email.includes('@')) {
      errors.email = 'Вы не указали @';
    }

    if (this.data.value.phone.length === 0) {
      errors.phone = 'Необходимо указать телефон';
    } else if (!this.phoneRegEx.test(this.data.value.phone)) {
      errors.phone = 'Поле телефон содержит недопустимый формат';
    }

    this._data.errors = errors;
    this._data.isValid = Object.keys(errors).length === 0;
    this.events.emit('contacts:error-change', this.data);
  }
}